import { Typography } from '@mui/material';
import { PageTitleProps } from '@/app/types/components/core/display';

export function PageTitle({ title }: PageTitleProps) {
  return (
    <Typography 
      variant="h4" 
      component="h1"
      sx={{ 
        fontWeight: 600,
        color: '#b3b3b3',
        fontSize: '1.2rem',
        mb: 4
      }}
    >
      {title}
    </Typography>
  );
} 