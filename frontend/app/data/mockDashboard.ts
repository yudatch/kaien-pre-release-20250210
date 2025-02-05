import { DashboardData } from '../types/dashboard';

export const mockDashboardData: DashboardData = {
  customers: {
    totalCustomers: 156,
    newCustomersThisMonth: 8,
    activeProjects: 12,
    recentContacts: [
      { customerName: '株式会社ABC', date: '2024-03-15', type: '商談' },
      { customerName: 'DEF工業', date: '2024-03-14', type: '見積提出' },
      { customerName: 'GHI建設', date: '2024-03-13', type: '電話対応' },
    ]
  },
  projects: {
    totalProjects: 45,
    projectsByStatus: {
      draft: 5,
      in_progress: 15,
      completed: 22,
      cancelled: 3
    },
    recentQuotations: [
      { projectName: 'オフィス改装工事', amount: 2800000, status: 'sent' },
      { projectName: '設備更新作業', amount: 1500000, status: 'accepted' },
      { projectName: '定期メンテナンス', amount: 450000, status: 'draft' },
    ]
  },
  purchases: {
    totalPurchases: 89,
    monthlyExpenses: 4500000,
    pendingOrders: 7,
    lowStockProducts: [
      { name: '空調フィルター', currentStock: 5, minimumStock: 10 },
      { name: 'LED照明器具', currentStock: 8, minimumStock: 15 },
      { name: '配管部材', currentStock: 12, minimumStock: 20 },
    ]
  },
  constructions: {
    activeConstructions: 8,
    upcomingDeadlines: [
      { projectName: 'A社ビル改装', deadline: '2024-03-30', progress: 75 },
      { projectName: 'B社設備工事', deadline: '2024-04-15', progress: 40 },
      { projectName: 'C社定期点検', deadline: '2024-04-05', progress: 90 },
    ]
  }
}; 