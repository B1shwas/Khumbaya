import { useQuery } from "@tanstack/react-query";
import { getBudgetSummary } from "../services/budgetService";

export const useBudgetSummary = (eventId: number) => {
  return useQuery({
    queryKey: ["budget-summary", eventId],
    queryFn: () => getBudgetSummary(eventId),
  });
};
