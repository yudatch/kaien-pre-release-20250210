'use client';

import { Typography, TypographyProps } from '@mui/material';

interface LogoProps extends Omit<TypographyProps, 'children'> {}

export default function Logo(props: LogoProps) {
  return (
    <Typography
      variant="h6"
      component="div"
      {...props}
      sx={{
        fontWeight: 700,
        fontSize: '3rem',
        lineHeight: '2rem',
        padding: '8px',
        background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
        backgroundClip: 'text',
        color: 'transparent',
        letterSpacing: '0.025em',
        textTransform: 'uppercase',
        position: 'relative',
        cursor: 'pointer',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-5px',
          left: '0',
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, #3b82f6 0%, rgba(59, 130, 246, 0.2) 100%)',
          borderRadius: '1px',
        },
        ...props.sx,
      }}
    >
      KAIEN
    </Typography>
  );
} 