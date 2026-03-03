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
export const acceptInvitation = async (invitationId: number) => {
  const response = await api.post(`/event/invitation/accept/${invitationId}`);
  return response.data.data.items;
};
