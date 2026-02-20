import api from "@/src/api/axios";

export const createUserApi = async (data: any) => {
  const response = await api.post("/user", data);
  return response.data;
};
export const getUserApi = async () => {
  const response = await api.get("/user");
  return response.data;
};

export const updateUserApi = async (data: any) => {
  const response = await api.patch("/user", data);
  return response.data;
};
export const getUserBuisnessApi = async () => {
  const response = await api.get("/user/business");
  return response.data;
};
