import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBudgetCategory,
  getBudgetSummary,
  updateBudgetCategory,
} from "../services/budgetService";

export const useBudgetSummary = (eventId: number) => {
  return useQuery({
    queryKey: ["budget-summary", eventId],
    queryFn: () => getBudgetSummary(eventId),
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

export const useBudgetCategoryUpdateMutation = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-budget-category", eventId],
    mutationFn: (payload: {
      categoryId: number;
      name: string;
      allocatedBudget: number;
    }) =>
      updateBudgetCategory(eventId, payload.categoryId, {
        name: payload.name,
        allocatedBudget: payload.allocatedBudget,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-summary", eventId] });
    },
  });
};
