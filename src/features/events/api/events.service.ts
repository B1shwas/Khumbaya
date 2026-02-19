import api from "@/src/api/axios";

export const createEventApi = async (data: any) => {
  const response = await api.post('/events', data);
  return response.data;
};