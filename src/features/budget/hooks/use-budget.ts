import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBudgetCategory,
  getBudgetSummary,
  getCategoryDetails,
} from "../services/budgetService";

export const useBudgetSummary = (eventId: number) => {
  return useQuery({
    queryKey: ["budget-summary", eventId],
    queryFn: () => getBudgetSummary(eventId),
  });
};

export const useCategoryDetails = (eventId: number, categoryId: number) => {
  return useQuery({
    queryKey: ["category-details", eventId, categoryId],
    queryFn: () => getCategoryDetails(categoryId),
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
