import api from "@/src/api/axios";
import { SubEvent } from "@/src/constants/event";

export type { SubEvent };

export interface CreateSubEventPayload {
  eventId: number;
  templateId?: number;
  title: string;
  description?: string;
  date: string;
  startDateTime?: string;
  endDateTime?: string;
  location?: string;
  budget?: number;
  theme?: string;
  imageUrl?: string;
  activities?: any[];
}

export interface UpdateSubEventPayload {
  title?: string;
  description?: string;
  date?: string;
  startDateTime?: string;
  endDateTime?: string;
  location?: string;
  budget?: number;
  theme?: string;
  imageUrl?: string;
}

export interface GetSubEventsParams {
  eventId: number;
  page?: number;
  limit?: number;
}

/**
 * Get all sub-events for an event
 */
export const getSubEventsApi = async ({
  eventId,
  page = 1,
  limit = 20,
}: GetSubEventsParams) => {
  const response = await api.get(`/event/${eventId}/sub-events`, {
    params: { page, limit },
  });
  return response.data.data;
};

/**
 * Get a single sub-event by ID
 * Uses same endpoint as regular event - /event/:id
 */
export const getSubEventById = async (subEventId: number) => {
  const response = await api.get(`/event/${subEventId}`);
  return response.data.data;
};

/**
 * Update an existing sub-event
 * Uses same endpoint as regular event - /event/:id with PATCH
 */
export const updateSubEventApi = async (
  subEventId: number,
  data: UpdateSubEventPayload
) => {
  const response = await api.patch(`/event/${subEventId}`, data);
  return response.data;
};

/**
 * Delete a sub-event
 * Uses same endpoint as regular event - /event/:id
 */
export const deleteSubEventApi = async (subEventId: number) => {
  const response = await api.delete(`/event/${subEventId}`);
  return response.data;
};

/**
 * Create a new sub-event
 */
export const createSubEventApi = async (data: CreateSubEventPayload) => {
  const response = await api.post(`/event/${data.eventId}/sub-events`, data);
  return response.data;
};

/**
 * Get all sub-event templates
 */
export const getSubEventTemplatesApi = async () => {
  const response = await api.get("/sub-event/templates");
  return response.data.data;
};
