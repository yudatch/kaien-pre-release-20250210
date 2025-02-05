import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
`;

const underlineAnimation = keyframes`
  0% {
    width: 0;
    opacity: 0;
    transform: translateX(-50%);
  }
  30% {
    opacity: 1;
  }
  100% {
    width: calc(100% - 16px);
    opacity: 1;
    transform: translateX(0);
  }
`;

export function LoadingScreen({ isLoading }: { isLoading: boolean }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: isLoading ? 'none' : `${fadeOut} 0.5s ease-out forwards`,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: 700,
          fontSize: '8rem',
          background: 'linear-gradient(-45deg, #1e40af, #3b82f6, #60a5fa, #1e40af)',
          backgroundSize: '400% 400%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          animation: `${gradientAnimation} 3s ease infinite`,
          letterSpacing: '0.05em',
          position: 'relative',
          padding: '8px',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '4px',
            left: '8px',
            height: '2px',
            background: 'linear-gradient(90deg, #3b82f6 0%, rgba(59, 130, 246, 0.2) 100%)',
            borderRadius: '1px',
            animation: `${underlineAnimation} 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
            transformOrigin: 'left'
          }
        }}
      >
        KAIEN
      </Typography>
    </Box>
  );
} 