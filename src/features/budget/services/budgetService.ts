import { BudgetItem } from "../types/budget.types";

// Mock data for development
let mockData: BudgetItem[] = [
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

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch all budget items for an event
 */
export const getBudget = async (eventId?: string): Promise<BudgetItem[]> => {
  // Simulate API call
  await delay(300);
  return [...mockData];
};

/**
 * Add a new budget item
 */
export const addBudgetItem = async (
  eventId: string,
  item: Omit<BudgetItem, "id">
): Promise<BudgetItem> => {
  await delay(200);
  const newItem: BudgetItem = {
    ...item,
    id: `budget-${Date.now()}`,
  };
  mockData = [...mockData, newItem];
  return newItem;
};

/**
 * Update an existing budget item
 */
export const updateBudgetItem = async (
  item: BudgetItem
): Promise<BudgetItem> => {
  await delay(200);
  mockData = mockData.map((i) => (i.id === item.id ? item : i));
  return item;
};

/**
 * Delete a budget item
 */
export const deleteBudgetItem = async (id: string): Promise<void> => {
  await delay(200);
  mockData = mockData.filter((i) => i.id !== id);
};

/**
 * Mark a budget item as paid/unpaid
 */
export const togglePaidStatus = async (
  id: string
): Promise<BudgetItem | null> => {
  await delay(200);
  const item = mockData.find((i) => i.id === id);
  if (!item) return null;

  const updatedItem = { ...item, isPaid: !item.isPaid };
  mockData = mockData.map((i) => (i.id === id ? updatedItem : i));
  return updatedItem;
};

/**
 * Reset mock data to initial state
 */
export const resetBudgetData = (): void => {
  mockData = [
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
};

// ============================================
// BACKEND INTEGRATION NOTES:
// ============================================
// API Endpoints (to implement):
//    - GET /api/events/{id}/budget - Get all budget items
//    - POST /api/events/{id}/budget - Add budget item
//    - PUT /api/budget/{id} - Update budget item
//    - DELETE /api/budget/{id} - Delete budget item
//    - PATCH /api/budget/{id}/toggle-paid - Toggle paid status
