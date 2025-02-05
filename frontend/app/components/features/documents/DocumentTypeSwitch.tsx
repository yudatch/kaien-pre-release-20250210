import { Button, ButtonGroup } from '@mui/material';
import { useRouter } from 'next/navigation';

interface DocumentTypeSwitchProps {
  currentType: '見積書' | '請求書';
  documentId?: string;
  projectId: number;
}

export default function DocumentTypeSwitch({
  currentType,
  documentId,
  projectId
}: DocumentTypeSwitchProps) {
  const router = useRouter();

  const handleSwitch = (newType: '見積書' | '請求書') => {
    if (currentType === newType) return;

    const basePath = newType === '見積書' ? '/projects/quotations' : '/projects/invoices';
    
    if (documentId) {
      router.push(`${basePath}/${documentId}/edit?inherit=true&projectId=${projectId}`);
    } else {
      router.push(`${basePath}/new?inherit=true&projectId=${projectId}`);
    }
  };

  return (
    <ButtonGroup 
      variant="outlined" 
      sx={{
        '& .MuiButton-root': {
          borderColor: '#e0e0e0',
          color: '#666666',
          backgroundColor: 'white',
          '&:hover': {
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.04)',
          },
          '&.Mui-selected': {
            backgroundColor: '#3b82f6',
            color: 'white',
            '&:hover': {
              backgroundColor: '#2563eb',
            }
          }
        }
      }}
    >
      <Button
        onClick={() => handleSwitch('見積書')}
        className={currentType === '見積書' ? 'Mui-selected' : ''}
      >
        見積書
      </Button>
      <Button
        onClick={() => handleSwitch('請求書')}
        className={currentType === '請求書' ? 'Mui-selected' : ''}
      >
        請求書
      </Button>
    </ButtonGroup>
  );
} 