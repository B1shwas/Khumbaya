import api from "@/src/api/axios";
import type {
    CreateReviewForBusinessPayload,
    CreateReviewPayload,
    ReviewListResponse,
    ReviewQueryParams,
    ReviewResponse,
    UpdateReviewPayload,
} from "@/src/features/review/types";

const buildQueryString = (params?: ReviewQueryParams) => {
  const query = new URLSearchParams();
  if (!params) return "";
  if (params.businessId !== undefined)
    query.append("businessId", String(params.businessId));
  if (params.userId !== undefined)
    query.append("userId", String(params.userId));
  if (params.page !== undefined) query.append("page", String(params.page));
  if (params.limit !== undefined) query.append("limit", String(params.limit));
  return query.toString() ? `?${query.toString()}` : "";
};

export const getReviewsApi = async (
  params?: ReviewQueryParams
): Promise<ReviewListResponse> => {
  const response = await api.get(`/business/review${buildQueryString(params)}`);
  return response.data?.data;
};

export const getReviewApi = async (
  id: number | string
): Promise<ReviewResponse> => {
  const response = await api.get(`/business/review/${id}`);
  return response.data?.data;
};

export const createReviewApi = async (
  payload: CreateReviewPayload
): Promise<ReviewResponse> => {
  const response = await api.post(`/business/review`, payload);
  return response.data?.data;
};

export const createReviewForBusinessApi = async (
  businessId: number | string,
  payload: CreateReviewForBusinessPayload
): Promise<ReviewResponse> => {
  const response = await api.post(`/business/review/${businessId}`, payload);
  return response.data?.data;
};

export const updateReviewApi = async (
  id: number | string,
  payload: UpdateReviewPayload
): Promise<ReviewResponse> => {
  const response = await api.patch(`/business/review/${id}`, payload);
  return response.data?.data;
};

export const deleteReviewApi = async (
  id: number | string
): Promise<ReviewResponse> => {
  const response = await api.delete(`/business/review/${id}`);
  return response.data?.data;
};
