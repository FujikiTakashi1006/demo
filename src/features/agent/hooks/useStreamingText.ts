import { useState, useEffect, useRef } from 'react';

export function useStreamingText(text: string, speed = 30, enabled = true) {
  const [displayed, setDisplayed] = useState(enabled ? '' : text);
  const [done, setDone] = useState(!enabled);
  const prevTextRef = useRef(text);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    // テキストが変わったらリセット
    if (prevTextRef.current !== text) {
      prevTextRef.current = text;
      setDisplayed('');
      setDone(false);
    }

    if (!text) return;

    let i = displayed.length;
    if (i >= text.length) {
      setDone(true);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, i + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [text, displayed, speed, enabled]);

  return { displayed, done };
}
