import api from "@/src/api/axios";
import { Business } from "@/src/constants/business";
import { CreateBusinessPayload, UpdateBusinessPayload } from "../types";

export const getBusinessListApi = async (): Promise<Business[]> => {
  const response = await api.get("/business");
  return response.data.data.items;
};

export const createBusinessApi = async (
  payload: CreateBusinessPayload
): Promise<Business> => {
  const response = await api.post("/business", payload);
  return response.data.data;
};

export const getBusinessByIdApi = async (id: number | string): Promise<Business> => {
  const response = await api.get(`/business/${id}`);
  console.log("getBusinessByIdApi response:", response.data);

  return response.data.data.business_information;
};

export const updateBusinessApi = async (
  id: number | string,
  payload: UpdateBusinessPayload
): Promise<Business> => {
  const response = await api.patch(`/business/${id}`, payload);
  console.log("updateBusinessApi response:", response.data);
  return response.data.data;
};

export const deleteBusinessApi = async (id: number | string): Promise<void> => {
  console.log("deleteBusinessApi called with id:", id);

  await api.delete(`/business/${id}`);
};
