import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBudgetCategory,
  addExpenseToCategory,
  addPayment,
  getBudgetSummary,
  getCategoryDetails,
  getExpenseById,
} from "../services/budgetService";

export const useBudgetSummary = (eventId: number) => {
  return useQuery({
    queryKey: ["budget-summary", eventId],
    queryFn: () => getBudgetSummary(eventId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCategoryDetails = (categoryId: number) => {
  return useQuery({
    queryKey: ["category-details", categoryId],
    queryFn: () => getCategoryDetails(categoryId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useBudgetCategoryMutation = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-budget-category", eventId],
    mutationFn: (payload: { name: string; allocatedBudget: number }) =>
      addBudgetCategory(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-summary", eventId] });
    },
  });
};

export const useExpenseMutation = (categoryId: number, eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-expense", categoryId],
    mutationFn: (payload: {
      name: string;
      estimatedCost: number;
      contractAmount?: number;
      businessId?: string;
      nextDueDate?: string;
      notes?: string;
    }) => addExpenseToCategory(categoryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["category-details", categoryId],
      });
      queryClient.invalidateQueries({ queryKey: ["budget-summary", eventId] });
    },
  });
};

export const useExpenseById = (expenseId: number) => {
  return useQuery({
    queryKey: ["expense-details", expenseId],
    queryFn: () => getExpenseById(expenseId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePaymentMutation = (
  expenseId: number,
  categoryId: number,
  eventId: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-payment", expenseId],
    mutationFn: (payload: {
      name: string;
      amount: number;
      paidOn: string;
      mode: string;
      status: string;
      notes?: string;
    }) => addPayment(expenseId, payload),
    onSuccess: () => {
      // Refresh expense details
      queryClient.invalidateQueries({
        queryKey: ["expense-details", expenseId],
      });
      // Refresh category details
      queryClient.invalidateQueries({
        queryKey: ["category-details", categoryId],
      });
      // Refresh budget summary
      queryClient.invalidateQueries({
        queryKey: ["budget-summary", eventId],
      });
    },
  });
};
