import { SxProps, Theme } from '@mui/material';

export const DocumentStyles: Record<string, SxProps<Theme>> = {
  container: {
    width: '210mm',
    minHeight: '297mm',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '15mm',
    boxSizing: 'border-box',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    '@media print': {
      boxShadow: 'none'
    }
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    mb: 3
  },

  documentTitle: {
    fontSize: '1.8rem',
    fontWeight: 500,
    marginBottom: 1,
    borderBottom: '3px solid',
    borderColor: 'grey.800',
    paddingBottom: 0.5,
    fontFamily: '"Noto Sans JP", "Helvetica", "Arial", sans-serif',
    letterSpacing: '0.02em',
    color: 'common.black'
  },

  customerName: {
    mb: 1,
    fontSize: '0.9rem',
    color: 'common.black'
  },

  customerAddress: {
    fontSize: '0.85rem',
    color: 'common.black'
  },

  companyInfo: {
    textAlign: 'right',
    '& .MuiTypography-root': {
      lineHeight: 1.5,
      fontFamily: '"Noto Sans JP", "Helvetica", "Arial", sans-serif',
      letterSpacing: '0.05em',
      fontSize: '0.9rem'
    }
  },

  companyName: {
    fontWeight: 500,
    mb: 1,
    fontSize: '1rem',
    fontFamily: '"Noto Sans JP", "Helvetica", "Arial", sans-serif',
    color: 'common.black'
  },

  companyPostalCode: {
    fontSize: '0.85rem',
    color: 'common.black'
  },

  companyAddress: {
    fontSize: '0.85rem',
    color: 'common.black'
  },

  companyPhone: {
    fontSize: '0.85rem',
    color: 'common.black'
  },

  companyTaxId: {
    fontSize: '0.85rem',
    mt: 1,
    color: 'common.black'
  },

  companySeal: {
    width: '70px',
    height: '70px',
    border: '2px solid',
    borderColor: 'grey.400',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginTop: 2,
    position: 'relative',
    '&::after': {
      content: '"認印"',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '1rem',
      color: 'grey.600',
      fontFamily: '"Noto Serif JP", serif',
      letterSpacing: '0.1em'
    }
  },

  totalAmount: {
    mb: 4
  },

  totalAmountText: {
    fontSize: '2.4rem',
    fontWeight: 500,
    color: 'grey.900',
    borderBottom: '2px solid',
    borderColor: 'grey.800',
    paddingBottom: 1,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    letterSpacing: '0.02em'
  },

  tableContainer: {
    mb: 4,
    '& .MuiTableCell-head': {
      backgroundColor: 'grey.100',
      fontWeight: 500,
      fontSize: '0.85rem',
      padding: '8px',
      letterSpacing: '0.05em',
      fontFamily: '"Noto Sans JP", "Helvetica", "Arial", sans-serif',
      color: 'common.black'
    },
    '& .MuiTableCell-body': {
      borderBottom: '1px solid',
      borderColor: 'grey.300',
      fontSize: '0.85rem',
      padding: '8px',
      letterSpacing: '0.05em',
      fontFamily: '"Noto Sans JP", "Helvetica", "Arial", sans-serif',
      color: 'common.black',
      '&[align="right"]': {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        letterSpacing: '0.1em'
      }
    }
  },

  tableHeader: {
    p: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  notes: {
    mt: 4,
    fontSize: '0.8rem',
    '& .MuiTypography-root': {
      fontSize: '0.75rem',
      color: 'common.black',
      mb: 0.5
    }
  },

  actionButtons: {
    mt: 2,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 1
  },

  errorMessage: {
    mt: 2,
    color: 'error.main'
  }
}; 