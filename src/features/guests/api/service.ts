
import api from "@/src/api/axios";

export interface InviteGuestPayload {
  fullName: string;
  invitation_name: string;
  email: string;
  phone: string;
  eventId: number;
  isFamily: boolean;
  role: string,
  category: string,
  status: string,
  isAccomodation: boolean,
  // TODO: Enable once backend invite endpoint supports linking existing users.
  // userId?: number;
}

export const inviteGuest = async (
  eventId: number,
  payload: InviteGuestPayload
) => {
  console.log("This is the data ", eventId, payload);
  const response = await api.post(`/event/${eventId}/invite`, payload);
  return response.data;
};

export const getEventGuest = async (eventId: number) => {
  const response = await api.get(`/event/guest/${eventId}`);
  console.warn("🚀 [getEventGuest] API Response:", response.data);
  return response.data.data;
};
export const getInvitation = async (eventId: number) => {
  const response = await api.get(`/event/${eventId}/invitation`);
  return response.data.data;
};
export const acceptInvitation = async (invitationId: number) => {
  const response = await api.post(`/event/invitation/accept/${invitationId}`);
  return response.data.data.items;
};

