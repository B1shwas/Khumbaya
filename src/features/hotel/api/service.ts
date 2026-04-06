import api from "@/src/api/axios";
import type { AcceptedGuestWithRoom, Hotel, RoomAllocation } from "../types/hotel.types";

// Get all hotels for an event
export const getHotelsForEvent = async (eventId: number): Promise<Hotel[]> => {
  try {
    const response = await api.get(`/event/${eventId}/hotels`);
    return response.data.data;
  } catch {
    return [];
  }
};

// Get room allocations for an event
export const getRoomAllocations = async (eventId: number): Promise<RoomAllocation[]> => {
  try {
    const response = await api.get(`/event/${eventId}/hotel-allocations`);
    return response.data.data;
  } catch {
    return [];
  }
};

// Allocate a guest to a room
export const allocateGuestToRoom = async (payload: {
  eventId: number;
  hotelId: number;
  guestId: number;
  roomNumber: string;
  roomType?: string;
  notes?: string;
}): Promise<RoomAllocation> => {
  const response = await api.post(`/event/${payload.eventId}/hotel-allocations`, payload);
  return response.data.data;
};

// Update a room allocation
export const updateRoomAllocation = async (
  allocationId: number,
  payload: Partial<Pick<RoomAllocation, "roomNumber" | "roomType" | "notes" | "status">>
): Promise<RoomAllocation> => {
  const response = await api.patch(`/hotel-allocations/${allocationId}`, payload);
  return response.data.data;
};

// Remove a room allocation
export const removeRoomAllocation = async (allocationId: number): Promise<void> => {
  await api.delete(`/hotel-allocations/${allocationId}`);
};

// Get hotel management data (guests with room assignments) for an event
export const getHotelManagement = async (eventId: number): Promise<AcceptedGuestWithRoom[]> => {
  try {
    const response = await api.get(`/event/${eventId}/hotel-management`);
    const raw = response.data.data ?? response.data;
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};
