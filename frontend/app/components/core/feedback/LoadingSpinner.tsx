import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
}

export function LoadingSpinner({ size = 40 }: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        minHeight: '200px'
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
} 