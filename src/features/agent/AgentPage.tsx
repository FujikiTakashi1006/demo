import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Stack, TextField, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Send } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useScenarioPlayer } from './useScenarioPlayer';
import ChatMessage from './components/ChatMessage';
import ToolAccordion from './components/ToolAccordion';
import characterWave from '../../assets/character-wave.png';
import characterThinking from '../../assets/character-thinking.png';
import characterSearching from '../../assets/character-searching.png';
import characterClipboard from '../../assets/character-clipboard.png';
import characterCelebrate from '../../assets/character-celebrate.png';
import characterDefault from '../../assets/character.png';
import characterConfused from '../../assets/confused.png';
import characterPointing from '../../assets/pointing.png';
import characterPresenting from '../../assets/presenting.png';
import characterThumbsup from '../../assets/thumbsup.png';
import characterTyping from '../../assets/typing.png';
import type { CharacterPose } from './useScenarioPlayer';
import ScenarioChips from './components/ScenarioChips';
import FullscreenArtifact from './components/FullscreenArtifact';
import type { ArtifactData } from './scenarios/types';
import { useStreamingText } from './hooks/useStreamingText';

const poseImageMap: Record<CharacterPose, string> = {
  wave: characterWave,
  thinking: characterThinking,
  searching: characterSearching,
  clipboard: characterClipboard,
  celebrate: characterCelebrate,
  default: characterDefault,
  confused: characterConfused,
  pointing: characterPointing,
  presenting: characterPresenting,
  thumbsup: characterThumbsup,
  typing: characterTyping,
};

const MotionBox = motion.create(Box);

export default function AgentPage() {
  const { messages, isPlaying, greetingPhase, characterPose, waitingForFollowUp, playScenario, addFollowUp } = useScenarioPlayer();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeArtifact, setActiveArtifact] = useState<ArtifactData | null>(null);
  const [inputValue, setInputValue] = useState('');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const greetingText = messages[0]?.content ?? '';
  const { displayed: streamedGreeting, done: greetingStreamDone } = useStreamingText(greetingText, 30);

  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scroll();
    const t = setTimeout(scroll, 350);
    return () => clearTimeout(t);
  }, [messages]);

  const shownArtifactsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    for (const msg of messages) {
      if (msg.artifact && !shownArtifactsRef.current.has(msg.id)) {
        shownArtifactsRef.current.add(msg.id);
        const timer = setTimeout(() => {
          setActiveArtifact(msg.artifact!);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [messages]);

  // When artifact is closed (or never opened) and scenario is done, show follow-up
  useEffect(() => {
    if (waitingForFollowUp && !activeArtifact) {
      addFollowUp();
    }
  }, [waitingForFollowUp, activeArtifact, addFollowUp]);

  const handleChipSelect = (trigger: string) => {
    if (!isPlaying) {
      playScenario(trigger);
    }
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isPlaying) return;
    setInputValue('');
    playScenario(text);
  };

  // Find the last assistant message in chatMessages to give it the current pose
  const chatMessagesForId = greetingPhase === 'done' ? messages.slice(1) : [];
  let lastAssistantChatId: string | null = null;
  for (let i = chatMessagesForId.length - 1; i >= 0; i--) {
    if (chatMessagesForId[i].type === 'assistant') {
      lastAssistantChatId = chatMessagesForId[i].id;
      break;
    }
  }

  // Show chips when not playing and last message is from assistant
  const lastMsg = messages[messages.length - 1];
  const showChips = !isPlaying && lastMsg?.type === 'assistant';

  // Messages to show in chat (skip the greeting message)
  const chatMessages = greetingPhase === 'done' ? messages.slice(1) : [];

  return (
    <>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: isDesktop
            ? 'calc(100vh - 48px)'
            : 'calc(100vh - calc(56px + env(safe-area-inset-bottom) + 16px))',
          ...(!isDesktop && {
            '@supports (height: 100dvh)': {
              height: 'calc(100dvh - calc(56px + env(safe-area-inset-bottom) + 16px))',
            },
          }),
        }}
      >


        {/* Chat area */}
        <Box
          ref={scrollRef}
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            px: { xs: 2, md: 3 },
            pt: 0,
            pb: 2,
            bgcolor: 'transparent',
            maxWidth: 680,
            mx: 'auto',
            width: '100%',
            scrollbarWidth: 'none',          // Firefox
            '&::-webkit-scrollbar': { display: 'none' },  // Chrome/Safari
          }}
        >
          {/* Greeting area */}
          {(greetingPhase !== 'done' || messages[0]?.id === 'greeting-thanks') && (
            <Box sx={{ mb: 2.5, px: { xs: 2, md: 4 }, maxWidth: 640, mx: 'auto', width: '100%' }}>
              {/* Avatar above message */}
              <Box
                component="img"
                src={poseImageMap.celebrate}
                alt=""
                sx={{
                  width: 44,
                  height: 44,
                  objectFit: 'contain',
                  mb: 0.5,
                }}
              />

              <AnimatePresence mode="wait">
                {greetingPhase !== 'done' ? (
                  <motion.div
                    key="bubble-initial"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: { xs: 15, md: 18 }, color: '#18181b' }}>
                      {streamedGreeting}
                    </Typography>
                  </motion.div>
                ) : (
                  <motion.div
                    key="bubble-thanks"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: { xs: 15, md: 18 }, color: '#18181b', mb: greetingStreamDone ? 2 : 0 }}>
                      {streamedGreeting}
                    </Typography>
                    {greetingStreamDone && <ScenarioChips onSelect={handleChipSelect} disabled={isPlaying} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          )}

          {/* Chat messages - group consecutive tool_calls into ToolAccordion */}
          {(() => {
            const elements: React.ReactNode[] = [];
            let i = 0;
            while (i < chatMessages.length) {
              const msg = chatMessages[i];
              if (msg.type === 'tool_call') {
                const toolGroup: typeof chatMessages = [];
                while (i < chatMessages.length && chatMessages[i].type === 'tool_call') {
                  toolGroup.push(chatMessages[i]);
                  i++;
                }
                // Find artifact in the next assistant message after this tool group
                const nextMsg = chatMessages[i];
                const artifact = nextMsg?.type === 'assistant' && nextMsg.artifact ? nextMsg.artifact : undefined;
                elements.push(
                  <ToolAccordion
                    key={`tools-${toolGroup[0].id}`}
                    tools={toolGroup}
                    artifactTitle={artifact?.title}
                    onArtifactClick={artifact ? () => setActiveArtifact(artifact) : undefined}
                  />
                );
              } else {
                // Skip assistant messages that only serve as artifact carriers (already shown via ToolAccordion button)
                const isArtifactOnly = msg.type === 'assistant' && msg.artifact && i > 0 && chatMessages[i - 1]?.type === 'tool_call';
                if (!isArtifactOnly) {
                  elements.push(
                    <ChatMessage
                      key={msg.id}
                      message={msg}
                      avatarSrc={msg.type === 'assistant' ? (msg.id === lastAssistantChatId ? poseImageMap[characterPose] : poseImageMap.default) : undefined}
                    />
                  );
                }
                i++;
              }
            }
            return elements;
          })()}

          {/* Inline scenario chips after scenarios complete */}
          {chatMessages.length > 0 && showChips && (
            <Box sx={{ ml: { xs: 5, md: 6 }, mt: 0.5 }}>
              <ScenarioChips onSelect={handleChipSelect} disabled={isPlaying} />
            </Box>
          )}

          {/* Reserve space for follow-up message when scenario is playing */}
          {isPlaying && <Box sx={{ minHeight: 100 }} />}

          {/* Spacer for input bar */}
          <Box sx={{ minHeight: 60 }} />
        </Box>

        {/* Input bar */}
        <Box sx={{
          position: 'fixed',
          bottom: { xs: 'calc(56px + env(safe-area-inset-bottom))', md: 0 },
          left: { xs: 0, md: '260px' },
          right: 0,
          px: { xs: 1.5, md: 3 },
          pt: 0,
          pb: 1,
          bgcolor: 'background.default',
          zIndex: 10,
        }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ maxWidth: 680, mx: 'auto' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="メッセージを入力..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend(); }}
              disabled={isPlaying}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  bgcolor: 'transparent',
                  fontSize: 16,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ea580c' },
                },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={isPlaying || !inputValue.trim()}
              sx={{
                bgcolor: inputValue.trim() ? '#18181b' : '#e4e4e7',
                color: '#ffffff',
                width: 40,
                height: 40,
                '&:hover': { bgcolor: '#27272a' },
                '&.Mui-disabled': { bgcolor: '#e4e4e7', color: '#a1a1aa' },
                transition: 'background-color 0.15s ease',
              }}
            >
              <Send sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>
      </MotionBox>

      <FullscreenArtifact
        artifact={activeArtifact}
        onClose={() => setActiveArtifact(null)}
      />
    </>
  );
}
