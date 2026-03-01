import { useCallback, useEffect, useMemo, useState } from "react";
import {
    addBudgetItem,
    deleteBudgetItem,
    getBudget,
    togglePaidStatus,
    updateBudgetItem,
} from "../services/budgetService";
import { BudgetItem, BudgetSummary } from "../types/budget.types";

interface UseBudgetReturn {
  // Data
  budgetItems: BudgetItem[];
  summary: BudgetSummary;

  // Loading states
  loading: boolean;
  refreshing: boolean;

  // Actions
  reload: () => Promise<void>;
  refresh: () => Promise<void>;
  addItem: (item: Omit<BudgetItem, "id">) => Promise<void>;
  updateItem: (item: BudgetItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  togglePaid: (id: string) => Promise<void>;
}

export function useBudget(eventId?: string): UseBudgetReturn {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load budget data
  const loadBudget = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const data = await getBudget(eventId);
        setBudgetItems(data);
      } catch (error) {
        console.error("Error loading budget:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [eventId]
  );

  // Initial load
  useEffect(() => {
    loadBudget();
  }, [loadBudget]);

  // Calculate summary
  const summary = useMemo((): BudgetSummary => {
    const totalEstimated = budgetItems.reduce(
      (sum, item) => sum + item.estimated,
      0
    );
    const totalActual = budgetItems.reduce((sum, item) => sum + item.actual, 0);
    const totalPaid = budgetItems
      .filter((item) => item.isPaid)
      .reduce((sum, item) => sum + item.actual, 0);
    const totalPending = totalActual - totalPaid;
    const remaining = totalEstimated - totalActual;
    const percentUsed =
      totalEstimated > 0 ? Math.round((totalActual / totalEstimated) * 100) : 0;

    return {
      totalEstimated,
      totalActual,
      totalPaid,
      totalPending,
      remaining,
      percentUsed,
      isOverBudget: totalActual > totalEstimated,
      categoryCount: budgetItems.length,
    };
  }, [budgetItems]);

  // Actions
  const reload = useCallback(async () => {
    await loadBudget(false);
  }, [loadBudget]);

  const refresh = useCallback(async () => {
    await loadBudget(true);
  }, [loadBudget]);

  const addItem = useCallback(
    async (item: Omit<BudgetItem, "id">) => {
      const newItem = await addBudgetItem(eventId || "default", item);
      setBudgetItems((prev) => [...prev, newItem]);
    },
    [eventId]
  );

  const updateItem = useCallback(async (updatedItem: BudgetItem) => {
    await updateBudgetItem(updatedItem);
    setBudgetItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);

  const removeItem = useCallback(async (id: string) => {
    await deleteBudgetItem(id);
    setBudgetItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const togglePaid = useCallback(async (id: string) => {
    const updatedItem = await togglePaidStatus(id);
    if (updatedItem) {
      setBudgetItems((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
    }
  }, []);

  return {
    budgetItems,
    summary,
    loading,
    refreshing,
    reload,
    refresh,
    addItem,
    updateItem,
    removeItem,
    togglePaid,
  };
}
