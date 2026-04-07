import api from "@/src/api/axios";

export const getCategoryOfType = async (type: string) => {
  const response = await api.get(`/general-category?type=${type}`);
  return response.data;
};
