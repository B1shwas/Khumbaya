import api from "@/src/api/axios";

export const getBudgetSummary = async (eventId: number) => {
  const response = await api.get(`/event/${eventId}/budget-summary`);
  return response.data.data;
};
