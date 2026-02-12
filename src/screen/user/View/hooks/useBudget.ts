import { useMemo } from "react";
import { budgetData } from "../types/budget";

export const useBudget = () => {
  const summary = useMemo(() => {
    const totalEstimated = budgetData.reduce(
      (sum, item) => sum + item.estimated,
      0,
    );
    const totalActual = budgetData.reduce((sum, item) => sum + item.actual, 0);
    const totalPaid = budgetData
      .filter((item) => item.isPaid)
      .reduce((sum, item) => sum + item.actual, 0);
    const remaining = totalEstimated - totalActual;
    const percentUsed = Math.round((totalActual / totalEstimated) * 100);
    const isOverBudget = totalActual > totalEstimated;

    return {
      totalEstimated,
      totalActual,
      totalPaid,
      remaining,
      percentUsed,
      isOverBudget,
    };
  }, []);

  return {
    budgetItems: budgetData,
    summary,
  };
};
