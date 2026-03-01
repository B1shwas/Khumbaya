export interface BudgetItem {
  id: string;
  category: string;
  icon: string;
  estimated: number;
  actual: number;
  isPaid: boolean;
  color: string;
}

export interface BudgetSummary {
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  totalPending: number;
  remaining: number;
  percentUsed: number;
  isOverBudget: boolean;
  categoryCount: number;
}

export interface BudgetCategory {
  name: string;
  icon: string;
  color: string;
}

export const DEFAULT_BUDGET_CATEGORIES: BudgetCategory[] = [
  { name: "Venue", icon: "location", color: "#8B5CF6" },
  { name: "Catering", icon: "restaurant", color: "#F59E0B" },
  { name: "Photography", icon: "camera", color: "#EC4899" },
  { name: "Decoration", icon: "color-palette", color: "#10B981" },
  { name: "Entertainment", icon: "musical-notes", color: "#6366F1" },
  { name: "Attire", icon: "shirt", color: "#14B8A6" },
];
