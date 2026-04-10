import api from "@/src/api/axios";
import { Business, BusinessWithAttribute } from "@/src/constants/business";
import {
  CreateBusinessPayload,
  CreateBusinessVenuePayload,
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
  return response.data.data;
};

export const updateBusinessApi = async (
  id: number | string,
  payload: UpdateBusinessPayload
): Promise<BusinessWithAttribute> => {
  const response = await api.patch(`/business/${id}`, payload);
  return response.data.data;
};

export const sendEnquiry = async (params: any, businessId: number) => {
  const response = await api.patch(`/business/${businessId}`, params);
  return response.data.data ?? response.data;

}
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

export const createBusinessVenueApi = async (
  params: CreateBusinessVenuePayload
): Promise<BusinessWithAttribute> => {
  const response = await api.post(`/business/${params.business_id}/venue`, params);
  return response.data.data;
};

export const deleteBusinessApi = async (id: number | string): Promise<void> => {
  await api.delete(`/business/${id}`);
};

export interface AddEventVendorPayload {
  vendorId: number;
  budget?: string;
  guests?: string;
  notes?: string;
  status?: string;
}

export const addEventVendorApi = async (
  eventId: string | number,
  payload: AddEventVendorPayload
): Promise<any> => {
  const response = await api.post(`/vendor/event/${eventId}`, payload);
  return response.data.data;
};

export const getEventBusinessApi = async (
  eventId: string | number
): Promise<Business[]> => {
  const response = await api.get(`/event/vendor/${eventId}/`);
  const payload = response.data?.data;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};
