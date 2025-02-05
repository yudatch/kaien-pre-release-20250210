import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

type DeleteConfirmDialogProps = {
  open: boolean;
  title: string;
  targetName: string | undefined;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

export function DeleteConfirmDialog({
  open,
  title,
  targetName,
  onCancel,
  onConfirm,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {targetName ? `${targetName}を削除します。よろしいですか？` : '削除します。よろしいですか？'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading}>
          キャンセル
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus disabled={isLoading}>
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
} 