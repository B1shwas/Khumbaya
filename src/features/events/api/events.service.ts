import api from "@/src/api/axios";
import { Event } from "@/src/constants/event";

export interface CREATEEVENT {
  title: string;
  description?: string;
  type?: string;
  startDate?: string;
  date?: string;
  endDate?: string;
  budget?: number;
  theme?: string;
  parentId?: number;
  location?: string;
  role?: string;
  imageUrl?: string;
}

export interface EVENT {
  id: number;
  title: string;
  description?: string;
  type?: string;
  startDate?: string;
  date?: string;
  endDate?: string;
  budget?: number;
  theme?: string;
  parentId?: number;
  location?: string;
  role?: string;
  status?: string;
  organizer?: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
  eventMembershipId?: number;
}

interface InvitationRecord {
  id: number;
  eventId: number;
  status?: string;
}

interface InvitationEventRecord {
  id: number;
  title?: string;
  startDate?: string;
  startTime?: string | null;
  endDate?: string;
  location?: string;
  imageUrl?: string;
}

interface InvitationItem {
  invitation: InvitationRecord;
  event: InvitationEventRecord;
}

interface GetEventsParams {
  page?: number;
  limit?: number;
}

const formatDate = (dateValue?: string) => {
  if (!dateValue) return "—";

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (dateValue?: string, fallbackTime?: string | null) => {
  if (fallbackTime) return fallbackTime;
  if (!dateValue) return "TBD";

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "TBD";

  return parsed.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const mapInvitationToEvent = (item: InvitationItem): Event => {
  const invitationStatus = (item.invitation.status ?? "").toLowerCase();
  const now = Date.now();
  const endDateTime = item.event.endDate
    ? new Date(item.event.endDate).getTime()
    : undefined;

  const status =
    invitationStatus === "pending"
      ? "invited"
      : typeof endDateTime === "number" && endDateTime < now
        ? "completed"
        : "upcoming";

  return {
    id: String(item.event.id ?? item.invitation.eventId ?? item.invitation.id),
    invitationId: item.invitation.id,
    title: item.event.title ?? "Untitled Event",
    date: formatDate(item.event.startDate),
    time: formatTime(item.event.startDate, item.event.startTime),
    location: item.event.location ?? "Location TBA",
    venue: item.event.location ?? "Location TBA",
    imageUrl: item.event.imageUrl ?? "",
    role: "Guest",
    status,
  };
};

export const createEventApi = async (data: CREATEEVENT) => {
  const response = await api.post("/event", data);
  return response.data;
};

export const getEventsApi = async ({
  page = 1,
  limit = 20,
}: GetEventsParams = {}) => {
  const response = await api.get("/event", {
    params: { page, limit },
  });
  const payload = response.data?.data;

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }
  return [];
};

export const getInvitedEvent = async () => {
  const response = await api.get("/rsvp/invitations");
  const payload = response.data?.data;
  if (Array.isArray(payload?.items)) {
    return payload.items.map(mapInvitationToEvent);
  }
  return [] as Event[];
};

export const acceptRsvpInvitationApi = async (invitationId: number) => {
  const response = await api.post(`/rsvp/accept/${invitationId}`);
  return response.data;
};
export const updateEventApi = async (
  id: number,
  data: Partial<CREATEEVENT>
) => {
  const response = await api.patch(`/event/${id}`, data);
  return response.data;
};
export const deleteEventApi = async (id: number) => {
  const response = await api.delete(`/event/${id}`);
  return response.data;
};
export const getEventGuest = async (id: number) => {
  const response = await api.get(`/event/${id}/guests`);
  return response.data;
};
