import api from "@/src/api/axios";
import { Event } from "@/src/constants/event";

export interface CREATEEVENT {
  title: string;
  description?: string;
  type?: string;
  startDateTime?: Date;
  endDateTime?: Date;
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
  startDateTime?: string;
  endDateTime?: string;
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
    startDateTime: item.event.startDate ?? "",
    endDateTime: item.event.endDate ?? "",
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

export const getUpcomingEventsApi = async ({
  page = 1,
  limit = 20,
}: GetEventsParams = {}) => {
  const response = await api.get("/event", {
    params: { page, limit },
  });
  const payload = response.data?.data;

  if (Array.isArray(payload?.items)) {
    return payload.items.map((item: any, index: number) => {
      // Merge properties from the indexed key (e.g., payload["0"]) if it exists
      const extraData = payload[index.toString()] || {};
      const mergedItem = {
        ...extraData, // Take properties from indexed key first as it seems more complete
        ...item, // Then overwrite with item properties if any
      };

      const startDateTime = mergedItem.startDateTime || mergedItem.startDate;

      return {
        ...mergedItem,
        id: String(mergedItem.id),
        date: formatDate(startDateTime),
        time: formatTime(startDateTime),
        role: mergedItem.role || "Guest", // Ensure role is explicitly set
      } as Event;
    });
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

export const getCompletedEventsApi = async ({
  page = 1,
  limit = 20,
}: GetEventsParams = {}) => {
  const events = await getUpcomingEventsApi({ page, limit });

  return events.filter((event: Event) => {
    if (event.status === "completed") return true;

    const endDate = event.endDateTime ? new Date(event.endDateTime) : undefined;
    return !!endDate && !Number.isNaN(endDate.getTime()) && endDate < new Date();
  });
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
export const getUserInvitedEvents = async () => { }

