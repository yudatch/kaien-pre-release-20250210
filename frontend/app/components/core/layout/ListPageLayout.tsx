"use client";

import { Box, Paper, Button, ButtonGroup } from '@mui/material';
import { Add } from '@mui/icons-material';
import { PageTitle } from '../display/PageTitle';
import { ListPageLayoutProps } from '@/app/types/components/core/layout';

export function ListPageLayout({
  title,
  addButtonLabel,
  onAddClick,
  children,
  customLayout
}: ListPageLayoutProps) {
  const renderButtons = () => {
    if (!addButtonLabel && !customLayout?.additionalButtons) return null;

    const buttonStyle = {
      borderColor: customLayout?.buttonGroupStyle?.borderColor ?? '#e0e0e0',
      color: customLayout?.buttonGroupStyle?.color ?? '#666666',
      '&:hover': {
        borderColor: customLayout?.buttonGroupStyle?.hoverBorderColor ?? '#3b82f6',
        backgroundColor: customLayout?.buttonGroupStyle?.hoverBackgroundColor ?? 'rgba(59, 130, 246, 0.04)',
      }
    };

    if (customLayout?.useButtonGroup) {
      return (
        <ButtonGroup 
          variant="outlined" 
          sx={{ 
            '& .MuiButton-root': buttonStyle
          }}
        >
          {addButtonLabel && onAddClick && (
            <Button
              startIcon={<Add />}
              onClick={onAddClick}
            >
              {addButtonLabel}
            </Button>
          )}
          {customLayout.additionalButtons?.map((button, index) => (
            <Button
              key={index}
              startIcon={button.icon}
              onClick={button.onClick}
            >
              {button.label}
            </Button>
          ))}
        </ButtonGroup>
      );
    }

    return addButtonLabel && onAddClick && (
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={onAddClick}
        sx={buttonStyle}
      >
        {addButtonLabel}
      </Button>
    );
  };

  return (
    <Box className="space-y-6">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <PageTitle title={title} />
        {renderButtons()}
      </Box>
      {children}
    </Box>
  );
} 