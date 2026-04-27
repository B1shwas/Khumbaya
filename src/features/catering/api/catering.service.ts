import api from "@/src/api/axios";
import {
    CateringMenu,
    CateringPlan,
    CreateCateringPayload,
    CreateMenuPayload,
    PaginatedCateringResponse,
    UpdateCateringPayload,
    UpdateMenuPayload,
} from "../types/catering.types";

export const getCateringsByEventIdApi = async (
  eventId: number | string,
  page = 1,
  limit = 10
): Promise<PaginatedCateringResponse> => {
  const response = await api.get("/catering", {
    params: { eventId, page, limit },
  });
  return response.data?.data ?? response.data;
};

export const getCateringByIdApi = async (
  cateringId: number | string
): Promise<CateringPlan> => {
  const response = await api.get(`/catering/${cateringId}`);
  return response.data?.data ?? response.data;
};

export const createCateringApi = async (
  eventId: number | string,
  payload: CreateCateringPayload
): Promise<CateringPlan> => {
  const response = await api.post(`/event/${eventId}/catering`, payload);
  return response.data?.data ?? response.data;
};

export const updateCateringApi = async (
  cateringId: number | string,
  payload: UpdateCateringPayload
): Promise<CateringPlan> => {
  const response = await api.patch(`/catering/${cateringId}`, payload);
  return response.data?.data ?? response.data;
};

export const deleteCateringApi = async (
  cateringId: number | string
): Promise<void> => {
  await api.delete(`/catering/${cateringId}`);
};

export const getCateringMenuApi = async (
  cateringId: number | string
): Promise<CateringMenu[]> => {
  const response = await api.get(`/catering/${cateringId}/menu`);
  return response.data?.data ?? response.data;
};

export const createCateringMenuApi = async (
  cateringId: number | string,
  payload: CreateMenuPayload
): Promise<CateringMenu> => {
  const response = await api.post(`/catering/${cateringId}/menu`, payload);
  return response.data?.data ?? response.data;
};

export const updateMenuApi = async (
  menuId: number | string,
  payload: UpdateMenuPayload
): Promise<CateringMenu> => {
  const response = await api.patch(`/menu/${menuId}`, payload);
  return response.data?.data ?? response.data;
};

export const deleteMenuApi = async (menuId: number | string): Promise<void> => {
  await api.delete(`/menu/${menuId}`);
};
