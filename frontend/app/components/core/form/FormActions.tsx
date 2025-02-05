"use client";

import { Box, Button } from '@mui/material';
import { FormActionsProps } from '@/app/types/components/features/customers/forms';

export function FormActions({ onSave, onCancel, disabled, mode = 'create' }: FormActionsProps) {
  const getSaveLabel = () => {
    switch (mode) {
      case 'create':
        return '登録';
      case 'edit':
        return '更新';
      default:
        return '保存';
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
      {mode !== 'view' && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onSave}
          disabled={disabled}
        >
          {getSaveLabel()}
        </Button>
      )}
      <Button variant="outlined" onClick={onCancel}>
        {mode === 'view' ? '戻る' : 'キャンセル'}
      </Button>
    </Box>
  );
} 