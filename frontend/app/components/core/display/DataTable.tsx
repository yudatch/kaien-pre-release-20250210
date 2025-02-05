"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
  Tooltip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ButtonGroup,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useState } from 'react';
import { DataTableProps, Column } from '@/app/types/components/core/table';
import { LoadingSpinner } from '../feedback/LoadingSpinner';

export function DataTable<T>({
  columns,
  rows,
  loading = false,
  onRowClick,
  getRowId = (row: T) => (row as any).id,
  actions,
  hideActions = false,
  rowsPerPage = 10,
  page = 0,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  onDeleteConfirm,
  onDeleteCancel,
  deleteDialogOpen = false,
  deleteDialogTitle = '削除の確認',
  deleteDialogMessage = '本当に削除しますか？',
  customTableStyle,
  customButtonGroupStyle,
  useButtonGroup = false,
}: DataTableProps<T>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, row: T) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleActionSelect = (onClick: (row: T) => void) => {
    if (selectedRow) {
      onClick(selectedRow);
    }
    handleClose();
  };

  if (loading) {
    return (
      <Paper 
        elevation={customTableStyle?.elevation ?? 1}
        sx={{
          border: customTableStyle?.border,
          borderRadius: customTableStyle?.borderRadius,
        }}
      >
        <Box sx={{ p: 2 }}>
          <LoadingSpinner />
        </Box>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer 
        component={Paper}
        elevation={customTableStyle?.elevation ?? 1}
        sx={{
          border: customTableStyle?.border,
          borderRadius: customTableStyle?.borderRadius,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} align={column.align}>
                  {column.headerName}
                </TableCell>
              ))}
              {!hideActions && actions && actions.length > 0 && (
                <TableCell align="right">アクション</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => {
              const rowId = getRowId(row);
              return (
                <TableRow
                  key={rowId}
                  hover
                  onClick={() => onRowClick?.(row)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((column) => (
                    <TableCell key={`${rowId}-${column.field}`} align={column.align}>
                      {column.renderCell
                        ? column.renderCell({ row })
                        : column.valueGetter
                        ? column.valueGetter({ row })
                        : String((row as any)[column.field])}
                    </TableCell>
                  ))}
                  {!hideActions && actions && actions.length > 0 && (
                    <TableCell align="center">
                      {useButtonGroup ? (
                        <ButtonGroup size="small">
                          {actions.map((action, index) => (
                            action.label && action.variant ? (
                              <Button
                                key={`${rowId}-action-${index}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                                color={action.color || 'default'}
                                size="small"
                                variant={action.variant}
                              >
                                {action.label}
                              </Button>
                            ) : (
                              <IconButton
                                key={`${rowId}-action-${index}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                                color={action.color || 'default'}
                                size="small"
                              >
                                {action.icon}
                              </IconButton>
                            )
                          ))}
                        </ButtonGroup>
                      ) : (
                        actions.map((action, index) => (
                          action.label && action.variant ? (
                            <Button
                              key={`${rowId}-action-${index}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                              color={action.color || 'default'}
                              size="small"
                              variant={action.variant}
                              sx={{ mr: 1 }}
                            >
                              {action.label}
                            </Button>
                          ) : (
                            <Tooltip key={`${rowId}-action-${index}`} title={action.tooltip || ''}>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                                color={action.color || 'default'}
                                size="small"
                              >
                                {action.icon}
                              </IconButton>
                            </Tooltip>
                          )
                        ))
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {totalRows !== undefined && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={(_, newPage) => onPageChange?.(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) =>
            onRowsPerPageChange?.(parseInt(e.target.value, 10))
          }
        />
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={onDeleteCancel}
      >
        <DialogTitle>{deleteDialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteDialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteCancel}>キャンセル</Button>
          <Button onClick={onDeleteConfirm} color="error" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 