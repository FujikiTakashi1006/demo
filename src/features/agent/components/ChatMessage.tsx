import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { InsertDriveFile } from '@mui/icons-material';
import type { ChatMessage as ChatMessageType } from '../scenarios/types';
import { useStreamingText } from '../hooks/useStreamingText';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

interface Props {
  message: ChatMessageType;
  avatarSrc?: string;
}

export default function ChatMessage({ message, avatarSrc }: Props) {
  const isUser = message.type === 'user';
  const { displayed } = useStreamingText(message.content ?? '', 30, !isUser);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        mb: 2.5,
        px: { xs: 2, md: 4 },
        maxWidth: 640,
        mx: 'auto',
        width: '100%',
        animation: `${fadeIn} 0.3s ease-out both`,
      }}
    >
      {/* AI avatar — above the message */}
      {!isUser && avatarSrc && (
        <Box
          component="img"
          src={avatarSrc}
          alt=""
          sx={{
            width: 44,
            height: 44,
            objectFit: 'contain',
            mb: 0.5,
          }}
        />
      )}

      {/* User attachment */}
      {isUser && message.attachment && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: '#27272a',
          border: '1px solid #3f3f46',
          borderRadius: '12px',
          px: 1.5,
          py: 1,
          mb: 0.5,
        }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '8px',
            bgcolor: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <InsertDriveFile sx={{ fontSize: 16, color: '#fff' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {message.attachment.name}
            </Typography>
            <Typography sx={{ fontSize: 10, color: '#a1a1aa' }}>
              {message.attachment.size}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Message bubble */}
      <Box
        sx={{
          px: isUser ? 2 : 0,
          py: isUser ? 1.2 : 0,
          bgcolor: isUser ? '#18182b' : 'transparent',
          color: isUser ? '#ffffff' : '#18181b',
          borderRadius: isUser ? '20px 20px 4px 20px' : 0,
          maxWidth: isUser ? '85%' : '100%',
        }}
      >
        <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: { xs: 15, md: 18 } }}>
          {isUser ? message.content : displayed}
        </Typography>
      </Box>
    </Box>
  );
}
