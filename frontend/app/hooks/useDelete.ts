import { useState } from 'react';

type UseDeleteOptions<T> = {
  onDelete: (id: number) => Promise<any>;
  onSuccess?: (deletedItem: T) => void;
  onError?: (error: Error) => void;
  confirmMessage?: string;
  successMessage?: string;
  errorMessage?: string;
};

type DeleteResponse = {
  success: boolean;
  message?: string;
};

export function useDelete<T extends { expense_id?: number }>({
  onDelete,
  onSuccess,
  onError,
  confirmMessage = '本当に削除しますか？',
  successMessage = '削除しました',
  errorMessage = '削除に失敗しました'
}: UseDeleteOptions<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteClick = (item: T) => {
    setItemToDelete(item);
    setIsDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDialogOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !itemToDelete.expense_id) return;

    try {
      setIsLoading(true);
      setError(null);
      await onDelete(itemToDelete.expense_id);
      onSuccess?.(itemToDelete);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '削除に失敗しました。';
      setError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return {
    isLoading,
    error,
    itemToDelete,
    isDialogOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  };
} 