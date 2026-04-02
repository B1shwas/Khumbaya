import api from "@/src/api/axios";
import { Business, BusinessWithAttribute } from "@/src/constants/business";
import {
  CreateBusinessPayload,
  UpdateBusinessPayload,
  UpdateBusinessServicePayload,
  UpdateBusinessVenuePayload,
} from "../types";

export const getBusinessListApi = async (userId?: number): Promise<Business[]> => {
  const response = await api.get(`/business${userId ? `?userId=${userId}` : ''}`);
  return response.data.data.items;
};

export const createBusinessApi = async (
  payload: CreateBusinessPayload
): Promise<Business> => {
  const response = await api.post("/business", payload);
  return response.data.data;
};

export const getBusinessByIdApi = async (id: number | string): Promise<BusinessWithAttribute> => {
  const response = await api.get(`/business/${id}`);
  console.log("getBusinessByIdApi response:", response.data);

  return response.data.data;
};

export const updateBusinessApi = async (
  id: number | string,
  payload: UpdateBusinessPayload
): Promise<BusinessWithAttribute> => {
  const response = await api.patch(`/business/${id}`, payload);
  console.log("updateBusinessApi response:", response.data);
  return response.data.data;
};


export const updateBusinessServiceApi = async (
  serviceId: number | string,
  params: UpdateBusinessServicePayload
): Promise<BusinessWithAttribute> => {
  const response = await api.patch(`/business/service/${serviceId}`, params);
  return response.data.data;
};

export const updateBusinessVenueApi = async (
  venueId: number | string,
  params: UpdateBusinessVenuePayload
): Promise<BusinessWithAttribute> => {
  const response = await api.patch(`/business/venue/${venueId}`, params);
  return response.data.data;
};



export const deleteBusinessApi = async (id: number | string): Promise<void> => {
  console.log("deleteBusinessApi called with id:", id);

  await api.delete(`/business/${id}`);
};
