export type RSVPStatus = "attending" | "declined" | "pending";
import { GuestDetailInterface, EventGuest } from "@/src/features/guests/types";
export interface MemberRsvpCardProp {
  id: number;
  familyId: number;
  name: string;
  avatarUrl?: string;
  status: RSVPStatus;
  dateRange?: string;
  roomNeeded?: string;
  notes?: string;
  rawStatus: string | null;
  rawArrival: string | null;
  rawDeparture: string | null;
  rawAccommodation: boolean | null;
}


function deriveStatus(event_guest: EventGuest | null): RSVPStatus {
  if (!event_guest) return "pending";
  if (event_guest.status === "rejected") return "declined";
  if (event_guest.status === "accepted") return "attending";
  return "pending";
}

function formatDateRange(
  arrival: string | null,
  departure: string | null
): string | undefined {
  if (!arrival && !departure) return undefined;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (arrival && departure) return `${fmt(arrival)} – ${fmt(departure)}`;
  if (arrival) return `From ${fmt(arrival)}`;
  return `Until ${fmt(departure!)}`;
}


export function mapToMemberRsvp(item: GuestDetailInterface): MemberRsvpCardProp {
  const status = deriveStatus(item.event_guest);
  return {
    id: item.user_detail.id,
    familyId: item.user_detail.familyId,
    name: item.user_detail.username,
    avatarUrl: item.user_detail.photo ?? undefined,
    status,
    dateRange: item.event_guest
      ? formatDateRange(
        item.event_guest.arrival_date_time,
        item.event_guest.departure_date_time
      )
      : undefined,
    roomNeeded:
      item.event_guest?.isAccomodation != null
        ? item.event_guest.isAccomodation
          ? "Yes"
          : "No"
        : undefined,
    notes: item.event_guest?.notes ?? undefined,
    rawStatus: item.event_guest?.status ?? null,
    rawArrival: item.event_guest?.arrival_date_time ?? null,
    rawDeparture: item.event_guest?.departure_date_time ?? null,
    rawAccommodation: item.event_guest?.isAccomodation ?? null,
  };
}

