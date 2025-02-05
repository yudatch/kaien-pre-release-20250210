import { SxProps, Theme } from '@mui/material';

/**
 * コアコンポーネント用の共通スタイル定義
 */

export const layoutStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  } as SxProps<Theme>,
  
  content: {
    flex: 1,
    padding: 3,
    overflow: 'auto',
  } as SxProps<Theme>,
};

export const tableStyles = {
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 1,
    boxShadow: 1,
  } as SxProps<Theme>,
  
  header: {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    '& .MuiTableCell-head': {
      color: 'inherit',
      fontWeight: 'bold',
    },
  } as SxProps<Theme>,
};

export const formStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    maxWidth: 600,
    margin: 'auto',
    padding: 3,
  } as SxProps<Theme>,
  
  field: {
    width: '100%',
  } as SxProps<Theme>,
}; 