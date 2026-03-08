import api from "@/src/api/axios";
import { z } from "zod";

export const updateUserMeSchema = z.object({
  username: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  photo: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  zip: z.string().optional(),
  relation: z.string().optional(),
  foodPreference: z.string().optional(),
  coverPhoto: z.string().optional(),
  info: z.any().optional(),
});

export type UpdateUserMePayload = z.infer<typeof updateUserMeSchema>;

export const createUserApi = async (data: any) => {
  const response = await api.post("/user", data);
  return response.data.data;
};
export const getUserApi = async () => {
  const response = await api.get("/user");
  return response.data;
};

export const updateUserApi = async (data: any) => {
  const response = await api.patch("/user", data);
  return response.data;
};
export const getUserProfile = async () => {
  const response = await api.get("/user/me");
  return response.data.data;
};
export const getUserBuisnessApi = async () => {
  const response = await api.get("/user/business");
  return response.data;
};

export const updateUserMeApi = async (data: UpdateUserMePayload) => {
  const payload = updateUserMeSchema.parse(data);
  const response = await api.patch("/user/me", payload);
  return response.data.data ?? response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confimPassword: string;
}) => {
  const response = await api.patch("/user", data);
  return response.data;
};
