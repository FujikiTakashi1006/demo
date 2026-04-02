import { useState, useRef, useCallback, useEffect } from 'react';
import type { ChatMessage, ScenarioStep } from './scenarios/types';
import { getToolCategory } from './scenarios/types';
import { findScenario } from './scenarios';

const GREETING_INITIAL: ChatMessage = {
  id: 'greeting-initial',
  type: 'assistant',
  content: 'こんにちは！建築向けチャットボットデモです！\nデモを使ってくれてありがとう！',
};

const GREETING_THANKS: ChatMessage = {
  id: 'greeting-thanks',
  type: 'assistant',
  content: 'シナリオを4つ考えてみたから\n使ってみてね！',
};

export type GreetingPhase = 'initial' | 'done';
export type CharacterPose = 'wave' | 'thinking' | 'searching' | 'clipboard' | 'celebrate' | 'default' | 'confused' | 'pointing' | 'presenting' | 'thumbsup' | 'typing';

export function useScenarioPlayer() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING_INITIAL]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [greetingPhase, setGreetingPhase] = useState<GreetingPhase>('initial');
  const [characterPose, setCharacterPose] = useState<CharacterPose>('wave');
  const [waitingForFollowUp, setWaitingForFollowUp] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const idCounterRef = useRef(0);

  const nextId = useCallback(() => `msg-${++idCounterRef.current}`, []);

  // Greeting animation sequence: show initial greeting, then swap to thanks
  useEffect(() => {
    if (greetingPhase !== 'initial') return;
    const timer = setTimeout(() => {
      setMessages([GREETING_THANKS]);
      setGreetingPhase('done');
      setCharacterPose('celebrate');
    }, 2000);
    return () => clearTimeout(timer);
  }, [greetingPhase]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const playScenario = useCallback(
    (userMessage: string) => {
      const scenario = findScenario(userMessage);

      setMessages((prev) => [
        ...prev,
        { id: nextId(), type: 'user', content: userMessage, attachment: scenario?.attachment },
      ]);

      if (!scenario) {
        setCharacterPose('confused');
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            type: 'assistant',
            content: 'こちらはデモ版のため、以下のシナリオからお試しください。',
          },
        ]);
        return null;
      }

      setIsPlaying(true);
      setCharacterPose('thinking');
      setWaitingForFollowUp(false);
      followUpAddedRef.current = false;
      clearTimeouts();

      // Alternate between searching/typing for tool calls
      const toolPoses: CharacterPose[] = ['searching', 'typing'];
      let toolCallIndex = 0;
      let cumulativeDelay = 0;

      scenario.steps.forEach((step: ScenarioStep) => {
        cumulativeDelay += step.delay;

        if (step.type === 'tool_call') {
          const toolMsgId = nextId();
          const pose = toolPoses[toolCallIndex % toolPoses.length];
          toolCallIndex++;
          const runningTimeout = setTimeout(() => {
            setCharacterPose(pose);
            setMessages((prev) => [
              ...prev,
              {
                id: toolMsgId,
                type: 'tool_call',
                toolName: step.toolName,
                toolCategory: step.toolName ? getToolCategory(step.toolName) : undefined,
                toolStatus: 'running',
              },
            ]);
          }, cumulativeDelay);
          timeoutsRef.current.push(runningTimeout);

          cumulativeDelay += 1000;
          const completedTimeout = setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === toolMsgId
                  ? { ...msg, toolStatus: 'completed' as const, toolResult: step.toolResult }
                  : msg,
              ),
            );
          }, cumulativeDelay);
          timeoutsRef.current.push(completedTimeout);
        } else if (step.type === 'assistant') {
          const timeout = setTimeout(() => {
            setCharacterPose(step.artifact ? 'presenting' : 'clipboard');
            setMessages((prev) => [
              ...prev,
              { id: nextId(), type: step.type, content: step.content, artifact: step.artifact },
            ]);
          }, cumulativeDelay);
          timeoutsRef.current.push(timeout);
        } else {
          const timeout = setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              { id: nextId(), type: step.type, content: step.content, artifact: step.artifact },
            ]);
          }, cumulativeDelay);
          timeoutsRef.current.push(timeout);
        }
      });

      // After scenario completes
      cumulativeDelay += 1500;
      const doneTimeout = setTimeout(() => {
        setCharacterPose('thumbsup');
        setIsPlaying(false);
        setWaitingForFollowUp(true);
      }, cumulativeDelay);
      timeoutsRef.current.push(doneTimeout);

      return scenario;
    },
    [clearTimeouts, nextId],
  );

  const followUpAddedRef = useRef(false);
  const addFollowUp = useCallback(() => {
    if (followUpAddedRef.current) return;
    followUpAddedRef.current = true;
    setWaitingForFollowUp(false);

    setCharacterPose('pointing');
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        type: 'assistant',
        content: 'どうでした？\n導入についてのご相談はお問い合わせからどうぞ！\n他のシナリオも試してみてね！',
      },
    ]);
  }, [nextId]);

  const resetChat = useCallback(() => {
    clearTimeouts();
    setMessages([GREETING_INITIAL]);
    setIsPlaying(false);
    setGreetingPhase('initial');
    setCharacterPose('wave');
    setWaitingForFollowUp(false);
    followUpAddedRef.current = false;
    idCounterRef.current = 0;
  }, [clearTimeouts]);

  return { messages, isPlaying, greetingPhase, characterPose, waitingForFollowUp, playScenario, addFollowUp, resetChat };
}
