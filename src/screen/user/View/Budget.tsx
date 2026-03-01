// Re-export the new BudgetScreen from the features/budget directory
// This maintains backward compatibility while using the new architecture
export { default } from "@/src/features/budget/BudgetScreen";

// Also re-export types for backward compatibility
export type {
  BudgetItem,
  BudgetSummary
} from "@/src/features/budget/types/budget.types";

