"use client";

import { Paper } from '@mui/material';
import { ReactNode } from 'react';

interface FormLayoutProps {
  children: ReactNode;
  mode?: 'view' | 'edit' | 'create';
}

export default function FormLayout({ children, mode = 'create' }: FormLayoutProps) {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3,
        bgcolor: mode === 'view' ? 'background.paper' : undefined,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      {children}
    </Paper>
  );
} 