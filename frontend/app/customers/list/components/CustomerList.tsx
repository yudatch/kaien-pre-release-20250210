const handleDeleteConfirm = async () => {
  if (!customerToDelete) return;

  try {
    const response = await customersApi.deleteCustomer(customerToDelete.customer_id);
    if (response.success) {
      setCustomers(customers.filter(c => c.customer_id !== customerToDelete.customer_id));
    } else {
      setError(new Error('顧客の削除に失敗しました'));
    }
  } catch (err) {
    setError(err instanceof Error ? err : new Error('顧客の削除に失敗しました'));
  } finally {
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  }
}; 