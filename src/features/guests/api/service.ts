// invite to the user
//accept the invitation
// invitation accept by the user
import api from "@/src/api/axios";

export interface InviteGuestPayload {
  fullName: string;
  email: string;
  phone: string;
  eventId: number;
  isFamily: boolean;
}

export interface EventResponseUserDetail {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  photo: string | null;
  familyId: number | null;
  relation: string | null;
}

export interface EventResponseGuestDetail {
  id: number;
  userId: number;
  eventId: number;
  familyId: number | null;
  invited_by: number | null;
  role: string | null;
  status: string | null;
  notes: string | null;
  arrival_date_time: string | null;
  departure_date_time: string | null;
  isAccomodation: boolean | null;
  joined_at: string;
}

export interface EventResponseItem {
  user_detail: EventResponseUserDetail;
  event_guest: EventResponseGuestDetail | null;
}

export type InvitationResponseStatus = "attending" | "declined" | "pending";

export interface InvitationResponcePayload {
  userid: number;
  status: InvitationResponseStatus;
  notes: string | null;
  arrival_date_time: string | null;
  departure_date_time: string | null;
  isAccomodation: boolean;
  traveling: {
    arrivalPickup: boolean;
    departureDrop: boolean;
  };
}

export const inviteGuest = async (
  eventId: number,
  payload: InviteGuestPayload
) => {
  const response = await api.post(`/event/${eventId}/invite`, payload);
  return response.data;
};

export const getEventGuest = async (eventId: number) => {
  const response = await api.get(`/event/guest/${eventId}`);
  console.warn("🚀 [getEventGuest] API Response:", response.data);
  return response.data.data;
};
export const getInvitation = async (eventId: number) => {
  const response = await api.get(`/event/event/${eventId}/invitation`);
  return response.data.data;
};

export const getEventResponses = async (
  eventId: number
): Promise<EventResponseItem[]> => {
  const response = await api.get(`/invitation/event-responses/${eventId}`);
  const payload = response.data?.data;
  return Array.isArray(payload) ? payload : [];
};

export const acceptInvitation = async (invitationId: number) => {
  const response = await api.post(`/event/invitation/accept/${invitationId}`);
  return response.data.data.items;
};

export const setInvitationResponce = async (
  eventId: number,
  payload: InvitationResponcePayload
): Promise<EventResponseGuestDetail[]> => {
  const response = await api.post(`/invitation/responce/${eventId}`, payload);
  const data = response.data?.data;
  return Array.isArray(data) ? data : [];
};

// Backward-compatible alias for existing imports/usages.
export const setResponce = setInvitationResponce;
