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
