"use client";

import { Box, Button, ButtonGroup } from '@mui/material';
import { ArrowBack, Print, PictureAsPdf } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { PreviewActionsProps } from '@/app/types/components/documents/actions';

export function PreviewActions({ onPrint, onDownloadPDF }: PreviewActionsProps) {
  const router = useRouter();

  return (
    <Box sx={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 100,
      py: 2,
      px: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #e0e0e0'
    }}>
      <ButtonGroup 
        variant="outlined"
        sx={{ 
          '& .MuiButton-root': {
            borderColor: '#e0e0e0',
            color: '#666666',
            '&:hover': {
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.04)',
            }
          }
        }}
      >
        <Button 
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
        >
          戻る
        </Button>
        {onPrint && (
          <Button 
            startIcon={<Print />}
            onClick={onPrint}
          >
            印刷
          </Button>
        )}
        {onDownloadPDF && (
          <Button 
            startIcon={<PictureAsPdf />}
            onClick={onDownloadPDF}
          >
            PDF保存
          </Button>
        )}
      </ButtonGroup>
    </Box>
  );
} 