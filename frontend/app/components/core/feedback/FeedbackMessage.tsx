import { Box, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type MessageType = 'error' | 'success';

type FeedbackMessageProps = {
  message?: string | null;
  type: MessageType;
};

export function FeedbackMessage({ message, type }: FeedbackMessageProps) {
  if (!message) return null;

  const config = {
    error: {
      bgcolor: 'error.main',
      icon: <ErrorIcon sx={{ color: 'common.white' }} />,
      textColor: 'common.white'
    },
    success: {
      bgcolor: '#4caf50',
      icon: <CheckCircleIcon sx={{ color: 'common.white' }} />,
      textColor: 'common.white'
    },
  };

  const { bgcolor, icon, textColor } = config[type];

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        bgcolor,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        opacity: type === 'success' ? 0.8 : 1
      }}
    >
      {icon}
      <Typography color={textColor}>{message}</Typography>
    </Box>
  );
} 