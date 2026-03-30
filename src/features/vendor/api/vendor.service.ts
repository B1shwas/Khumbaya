import api from "@/src/api/axios";
import {
  ContactVendorPayload,
  HireVendorPayload,
  Vendor
} from "../types";

export const getVendorListApi = async (): Promise<Vendor[]> => {
  const response = await api.get("/business");
  return response.data.data.items;
};

export const getVendorByIdApi = async (id: string): Promise<Vendor> => {
  const response = await api.get(`/business/${id}`);
  return response.data.data;
};

export const hireVendorApi = async (
  payload: HireVendorPayload
): Promise<void> => {
  await api.post(`/business/${payload.vendorId}/hire`, {
    eventId: payload.eventId,
    notes: payload.notes,
  });
};

export const contactVendorApi = async (
  payload: ContactVendorPayload
): Promise<void> => {
  await api.post(`/business/${payload.vendorId}/contact`, {
    message: payload.message,
    contactType: payload.contactType,
  });
};

export const getVendorsByEventApi = async (
  eventId: string
): Promise<Vendor[]> => {
  const response = await api.get(`/events/${eventId}/vendors`);
  return response.data.data.items;
};
