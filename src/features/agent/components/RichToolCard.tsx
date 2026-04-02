import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage, ToolCategory } from '../scenarios/types';

interface Props {
  message: ChatMessage;
  isLast?: boolean;
}

const TOOL_COLOR = '#ea580c';

const categoryConfig: Record<ToolCategory, { label: string }> = {
  site_db:     { label: '現場データ' },
  weather_api: { label: '天気情報' },
  doc_gen:     { label: '書類生成' },
  knowledge:   { label: 'ナレッジ' },
};

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ display: 'block' }}>
      <circle cx="7" cy="7" r="5" fill="none" stroke="rgba(234,88,12,0.2)" strokeWidth="1.5" />
      <motion.circle
        cx="7" cy="7" r="5" fill="none" stroke={TOOL_COLOR} strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="24 8"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '7px 7px' }}
      />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ display: 'block' }}>
      <motion.circle
        cx="7" cy="7" r="6" fill={TOOL_COLOR}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: '7px 7px' }}
      />
      <motion.path
        d="M4 7.2 L6.2 9.2 L10 4.8"
        fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
      />
    </svg>
  );
}

const MotionBox = motion.create(Box);

export default function RichToolCard({ message, isLast = false }: Props) {
  const done = message.toolStatus === 'completed';
  const cat = message.toolCategory ?? 'site_db';
  const cfg = categoryConfig[cat];

  return (
    <MotionBox
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      sx={{ ml: { xs: 2, md: 3 }, mb: 0.5 }}
    >
      <Box
        sx={{
          bgcolor: 'rgba(234,88,12,0.04)',
          borderRadius: '10px',
          border: '1px solid rgba(234,88,12,0.1)',
          px: 1.5,
          py: 0.8,
        }}
      >
        {/* Row: dot/line + label + spinner/check */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Timeline dot + line connector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Dot */}
            <svg width="8" height="8" viewBox="0 0 8 8" style={{ display: 'block', flexShrink: 0 }}>
              <motion.circle
                cx="4" cy="4" r="3"
                fill={done ? TOOL_COLOR : 'transparent'}
                stroke={TOOL_COLOR} strokeWidth="1.5"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: '4px 4px' }}
              />
              {!done && (
                <motion.circle
                  cx="4" cy="4" r="3" fill="none" stroke={TOOL_COLOR} strokeWidth="1"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                  style={{ transformOrigin: '4px 4px' }}
                />
              )}
            </svg>
            {/* Horizontal line to next (if not last) */}
            {!isLast && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: done ? 1 : 0.3 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  width: 12,
                  height: 2,
                  backgroundColor: done ? TOOL_COLOR : 'rgba(234,88,12,0.2)',
                  borderRadius: 1,
                  transformOrigin: 'left',
                }}
              />
            )}
          </Box>

          <Typography sx={{ fontSize: 12, fontWeight: 700, color: TOOL_COLOR, flex: 1 }}>
            {cfg.label}
          </Typography>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="check" style={{ display: 'flex' }}>
                <CheckMark />
              </motion.div>
            ) : (
              <motion.div
                key="spin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex' }}
              >
                <Spinner />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Result */}
        <AnimatePresence>
          {done && message.toolResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Typography sx={{ fontSize: 12, color: '#71717a', mt: 0.3, ml: '20px', lineHeight: 1.5 }}>
                {message.toolResult}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </MotionBox>
  );
}
