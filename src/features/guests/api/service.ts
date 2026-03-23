
import api from "@/src/api/axios";

export interface InviteGuestPayload {
  fullName: string;
  invitation_name: string;
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
  const response = await api.post(`/event/${eventId}/invite`, payload);
  return response.data;
};

export const getEventGuest = async (eventId: number) => {
  const response = await api.get(`/event/guest/${eventId}`);
  return response.data.data;
};
export const getInvitation = async (eventId: number) => {
  const response = await api.get(`/event/${eventId}/invitation`);
  return response.data.data;
};

export const removeInvitation = async(eventId: number, guestId: number) => {

  const response = await api.delete(`/event/${eventId}/invitation`, { data: { userId: guestId } });
  return response.data.data;
}