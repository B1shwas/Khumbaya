import api from "@/src/api/axios";
import { z } from "zod";
import { budgetCategoryFormSchema } from "../schema";

export const getBudgetSummary = async (eventId: number) => {
  const response = await api.get(`/event/${eventId}/budget-summary`);
  return response.data.data;
};

export const addBudgetCategory = async (
  eventId: number,
  payload: z.infer<typeof budgetCategoryFormSchema>
) => {
  const response = await api.post(
    `/event/${eventId}/budget-category/create`,
    payload
  );
  return response.data.data;
};

export const getCategoryDetails = async (categoryId: number) => {
  const response = await api.get(`/budget-category/${categoryId}`);
  return response.data.data;
};

export const addExpenseToCategory = async (
  categoryId: number,
  payload: {
    name: string;
    estimatedCost: number;
    contractAmount?: number;
    businessId?: string;
    nextDueDate?: string;
    notes?: string;
  }
) => {
  const response = await api.post(
    `/budget-category/${categoryId}/expense/create`,
    payload
  );
  return response.data.data;
};

export const getExpenseById = async (expenseId: number) => {
  const response = await api.get(`/expense/${expenseId}`);
  return response.data.data;
};
