import { z } from "zod";

export const budgetCategoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required").max(255),
  allocatedBudget: z
    .string()
    .min(1, "Allocated budget is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Allocated budget must be a positive number",
    }),
});

export type BudgetCategoryFormData = z.infer<typeof budgetCategoryFormSchema>;

export const expenseFormSchema = z.object({
  name: z.string().min(1, "Expense name is required").max(255),
  estimatedCost: z
    .string()
    .min(1, "Estimated cost is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Estimated cost must be a positive number"),
  contractAmount: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Contract amount must be a positive number"),
  businessId: z.string().max(255).optional().or(z.literal("")),
  nextDueDate: z.string().optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;

export const setBudgetSchema = z.object({
  budget: z
    .string()
    .min(1, "Budget is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Budget must be a positive number",
    }),
});

export type SetBudgetFormData = z.infer<typeof setBudgetSchema>;
