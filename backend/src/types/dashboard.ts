/**
 * 顧客サマリー情報
 * @interface CustomerSummary
 */
interface CustomerSummary {
  /** 総顧客数 */
  totalCustomers: number;
  /** 今月の新規顧客数 */
  newCustomersThisMonth: number;
  /** 進行中の案件数 */
  activeProjects: number;
  /** 最近のコンタクト履歴 */
  recentContacts: Array<{
    /** 顧客名 */
    customerName: string;
    /** コンタクト日付 (YYYY-MM-DD形式) */
    date: string;
    /** コンタクト種別 */
    type: string;
  }>;
}

interface ProjectSummary {
  totalProjects: number;
  projectsByStatus: {
    draft: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  recentQuotations: Array<{
    projectName: string;
    amount: number;
    status: string;
  }>;
}

interface PurchaseSummary {
  totalPurchases: number;
  monthlyExpenses: number;
  pendingOrders: number;
  lowStockProducts: Array<{
    name: string;
    currentStock: number;
    minimumStock: number;
  }>;
}

interface ConstructionSummary {
  activeConstructions: number;
  upcomingDeadlines: Array<{
    projectName: string;
    deadline: string;
    progress: number;
  }>;
}

export interface DashboardData {
  customers: CustomerSummary;
  projects: ProjectSummary;
  purchases: PurchaseSummary;
  constructions: ConstructionSummary;
}

/**
 * プロジェクトのステータス別集計
 */
export interface ProjectStatusCount {
  draft: number;
  in_progress: number;
  completed: number;
  cancelled: number;
} 