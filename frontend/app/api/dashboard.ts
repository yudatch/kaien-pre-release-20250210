import { ENDPOINTS } from './endpoints';
import { client } from './client';

export interface CustomerSummary {
  totalCustomers: number;
  newCustomersThisMonth: number;
  activeProjects: number;
  recentContacts: {
    customerName: string;
    date: string;
    type: string;
  }[];
}

export interface ProjectStatusCount {
  draft: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}

export interface ProjectSummary {
  totalProjects: number;
  projectsByStatus: ProjectStatusCount;
  recentQuotations: {
    projectName: string;
    amount: number;
    status: string;
  }[];
}

export interface PurchaseSummary {
  totalPurchases: number;
  monthlyExpenses: number;
  pendingOrders: number;
  lowStockProducts: {
    name: string;
    currentStock: number;
    minimumStock: number;
  }[];
}

export interface ConstructionSummary {
  activeConstructions: number;
  upcomingDeadlines: {
    projectName: string;
    deadline: string;
    progress: number;
  }[];
}

export interface DashboardData {
  customers: CustomerSummary;
  projects: ProjectSummary;
  purchases: PurchaseSummary;
  constructions: ConstructionSummary;
}

export interface DashboardResponse {
  data: DashboardData;
  message?: string;
  success?: boolean;
}

export const dashboardApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await client.get<DashboardData>(ENDPOINTS.DASHBOARD.BASE);
    return response.data;
  }
}; 