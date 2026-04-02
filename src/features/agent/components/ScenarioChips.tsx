import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Description, Psychology, CalendarMonth, Payments } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { scenarios } from '../scenarios';
import type { ScenarioIconId } from '../scenarios/types';

interface Props {
  onSelect: (trigger: string) => void;
  disabled?: boolean;
}

const iconMap: Record<ScenarioIconId, React.ReactNode> = {
  description: <Description sx={{ fontSize: 22, color: '#71717a' }} />,
  psychology: <Psychology sx={{ fontSize: 22, color: '#71717a' }} />,
  calendar_month: <CalendarMonth sx={{ fontSize: 22, color: '#71717a' }} />,
  payments: <Payments sx={{ fontSize: 22, color: '#71717a' }} />,
};

const MotionBox = motion.create(Box);

export default function ScenarioChips({ onSelect, disabled }: Props) {
  const [entryDone, setEntryDone] = useState(false);
  useEffect(() => {
    const lastDelay = 0.6 + (scenarios.length - 1) * 0.5 + 0.25;
    const timer = setTimeout(() => setEntryDone(true), lastDelay * 1000);
    return () => clearTimeout(timer);
  }, []);

  const canHover = entryDone && !disabled;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {scenarios.map((s, i) => (
        <MotionBox
          key={s.id}
          onClick={() => !disabled && onSelect(s.trigger)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.6 + i * 0.5, ease: 'easeOut' }}
          whileHover={canHover ? { scale: 1.03, y: -1 } : undefined}
          whileTap={canHover ? { scale: 0.97 } : undefined}
          sx={{
            px: 2.5,
            py: 1.8,
            borderRadius: '14px',
            border: '1px solid rgba(0,0,0,0.08)',
            bgcolor: '#ffffff',
            cursor: disabled ? 'default' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            transition: 'border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            ...(!disabled && {
              '&:hover': {
                borderColor: 'rgba(234,88,12,0.3)',
                bgcolor: 'rgba(234,88,12,0.03)',
                boxShadow: '0 2px 8px rgba(234,88,12,0.08)',
              },
            }),
          }}
        >
          {iconMap[s.iconId]}
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#18181b' }}>
            {s.label}
          </Typography>
        </MotionBox>
      ))}
    </Box>
  );
}
