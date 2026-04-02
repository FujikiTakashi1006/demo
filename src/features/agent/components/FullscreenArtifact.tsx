import { Box, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { ArtifactData } from '../scenarios/types';
import aiceLogo from '../../../assets/s-960x540_v-fs_webp_b4f19ff5-f591-4855-bf62-f92e5e0260e5_small.webp';

interface Props {
  artifact: ArtifactData | null;
  onClose: () => void;
}

export default function FullscreenArtifact({ artifact, onClose }: Props) {
  return (
    <AnimatePresence>
      {artifact && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: '#e8e8e8',
            }}
          />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2.5,
                py: 1.5,
                bgcolor: '#ffffff',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                pt: 'calc(14px + env(safe-area-inset-top))',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  component="img"
                  src={aiceLogo}
                  alt=""
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
                <Typography sx={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>
                  {artifact.title}
                </Typography>
              </Box>
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  bgcolor: '#f4f4f5',
                  width: 32,
                  height: 32,
                  '&:hover': { bgcolor: '#e4e4e7' },
                }}
              >
                <Close sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ flex: 1, overflow: 'auto', position: 'relative', zIndex: 1, background: '#e8e8e8' }}
          >
            <Box
              sx={{
                maxWidth: 640,
                mx: 'auto',
                my: { xs: 2, md: 3 },
                p: { xs: 2.5, md: 4 },
                pb: 'calc(32px + env(safe-area-inset-bottom))',
                bgcolor: '#ffffff',
                borderRadius: 0,
                boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
                overflow: 'hidden',
              }}
              dangerouslySetInnerHTML={{ __html: artifact.content }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
