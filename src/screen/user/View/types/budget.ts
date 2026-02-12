// ============================================
// Types
// ============================================

export interface BudgetItem {
  id: string;
  category: string;
  icon: string;
  estimated: number;
  actual: number;
  isPaid: boolean;
  color: string;
}

export const budgetData: BudgetItem[] = [
  {
    id: "1",
    category: "Venue",
    icon: "location",
    estimated: 5000,
    actual: 5200,
    isPaid: true,
    color: "#8B5CF6",
  },
  {
    id: "2",
    category: "Catering",
    icon: "restaurant",
    estimated: 3500,
    actual: 3800,
    isPaid: true,
    color: "#F59E0B",
  },
  {
    id: "3",
    category: "Photography",
    icon: "camera",
    estimated: 1500,
    actual: 1500,
    isPaid: false,
    color: "#EC4899",
  },
  {
    id: "4",
    category: "Decoration",
    icon: "color-palette",
    estimated: 2000,
    actual: 1800,
    isPaid: false,
    color: "#10B981",
  },
  {
    id: "5",
    category: "Entertainment",
    icon: "musical-notes",
    estimated: 1000,
    actual: 1200,
    isPaid: false,
    color: "#6366F1",
  },
  {
    id: "6",
    category: "Attire",
    icon: "shirt",
    estimated: 800,
    actual: 750,
    isPaid: true,
    color: "#14B8A6",
  },
];

export const getCategoryIcon = (icon: string): string => {
  const icons: Record<string, string> = {
    location: "🏛️",
    restaurant: "🍽️",
    camera: "📸",
    "color-palette": "🎨",
    "musical-notes": "🎵",
    shirt: "👔",
  };
  return icons[icon] || "📦";
};

export interface BudgetSummary {
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  remaining: number;
  percentUsed: number;
  isOverBudget: boolean;
}
