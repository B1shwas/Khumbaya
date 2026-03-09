import api from "@/src/api/axios";
import {
    SubEventTemplate
} from "@/src/constants/subeventTemplates";
import { SelectedActivity } from "../types";

// ============================================
// Type Definitions

export interface SubEvent {
  id: number;
  eventId: number;
  templateId: string;
  template?: SubEventTemplate;
  date: string;
  theme: string;
  budget: string;
  activities: SelectedActivity[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubEventPayload {
  eventId: number;
  templateId: string;
  date: string;
  theme: string;
  budget: string;
  activities: SelectedActivity[];
}

export interface UpdateSubEventPayload {
  date?: string;
  theme?: string;
  budget?: string;
  activities?: SelectedActivity[];
}

export interface GetSubEventsParams {
  eventId: number;
  page?: number;
  limit?: number;
}

// ============================================
// API Functions


/**
 * Get all sub-events for a specific event
 */
export const getSubEventsApi = async ({
  eventId,
  page = 1,
  limit = 20,
}: GetSubEventsParams) => {
  const response = await api.get(`/event/${eventId}/subevents`, {
    params: { page, limit },
  });
  return response.data.data;
};

/**
 * Get a single sub-event by ID
 */
export const getSubEventById = async (subEventId: number) => {
  const response = await api.get(`/subevents/${subEventId}`);
  return response.data.data;
};

/**
 * Create a new sub-event
 */
export const createSubEventApi = async (data: CreateSubEventPayload) => {
  const response = await api.post("/subevents", data);
  return response.data.data;
};

/**
 * Update an existing sub-event
 */
export const updateSubEventApi = async (
  subEventId: number,
  data: UpdateSubEventPayload
) => {
  const response = await api.patch(`/subevents/${subEventId}`, data);
  return response.data.data;
};

/**
 * Delete a sub-event
 */
export const deleteSubEventApi = async (subEventId: number) => {
  const response = await api.delete(`/subevents/${subEventId}`);
  return response.data;
};

/**
 * Get sub-event templates
 */
export const getSubEventTemplatesApi = async () => {
  const response = await api.get("/subevents/templates");
  return response.data.data;
};


/**
 * Get all sub-events for an event (convenience function)
 */
export const getAllSubEventsByEventId = async (eventId: number) => {
  const response = await getSubEventsApi({ eventId });
  return response;
};

/**
 * Check if a sub-event template exists for an event
 */
export const checkSubEventExists = async (
  eventId: number,
  templateId: string
): Promise<boolean> => {
  try {
    const subEvents = await getSubEventsApi({ eventId, limit: 100 });
    return subEvents.some(
      (subEvent: SubEvent) => subEvent.templateId === templateId
    );
  } catch {
    return false;
  }
};
