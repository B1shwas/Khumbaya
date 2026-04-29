export type RSVPStatus = "attending" | "declined" | "pending";
import { GuestDetailInterface, Invitation } from "@/src/features/guests/types";

interface MemberRsvpRawFields {
  rawStatus: Invitation["status"];
  rawArrival: Invitation["arrivalDatetime"];
  rawDeparture: Invitation["departureDatetime"];
  rawAccommodation: Invitation["isAccomodation"];
  rawIsArrivalPickupRequired: Invitation["isArrivalPickupRequired"];
  rawIsDeparturePickupRequired: Invitation["isDeparturePickupRequired"];
  rawAssignedRoom: Invitation["assignedRoom"];
  rawArrivalInfo: Invitation["arrivalInfo"];
  rawDepartureInfo: Invitation["departureInfo"];
}

export interface MemberRsvpCardProp extends MemberRsvpRawFields {
  id: number;
  familyId: number;
  name: string;
  avatarUrl?: string;
  status: RSVPStatus;
  email?: string;
  phone: string;
  assignedRoom?: string;
  dateRange?: string;
  roomNeeded?: string;
  notes?: string;
}

function deriveStatus(event_guest: Invitation | null): RSVPStatus {
  if (!event_guest) return "pending";
  if (event_guest.status === "rejected") return "declined";
  if (event_guest.status === "accepted") return "attending";
  return "pending";
}

function formatDateRange(
  arrival: Date | null,
  departure: Date | null
): string | undefined {
  if (!arrival && !departure) return undefined;
  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (arrival && departure) return `${fmt(arrival)} – ${fmt(departure)}`;
  if (arrival) return `From ${fmt(arrival)}`;
  return `Until ${fmt(departure!)}`;
}

export function mapToMemberRsvp(
  item: GuestDetailInterface
): MemberRsvpCardProp {
  const status = deriveStatus(item.eventGuest);
  return {
    id: item.user.id,
    familyId: item.user.familyId ?? 0,
    name: item.user.username,
    email: item.user.email,
    phone: item.user.phone,
    avatarUrl: item.user.photo ?? undefined,
    status,
    dateRange: item.eventGuest
      ? formatDateRange(
        item.eventGuest.arrivalDatetime,
        item.eventGuest.departureDatetime
      )
      : undefined,
    roomNeeded:
      item.eventGuest?.isAccomodation != null
        ? item.eventGuest.isAccomodation
          ? "Yes"
          : "No"
        : undefined,
    assignedRoom: item.eventGuest?.assignedRoom ?? undefined,
    notes: item.eventGuest?.notes ?? undefined,
    rawStatus: item.eventGuest?.status ?? null,
    rawArrival: item.eventGuest?.arrivalDatetime ?? null,
    rawDeparture: item.eventGuest?.departureDatetime ?? null,
    rawAccommodation: item.eventGuest?.isAccomodation ?? null,
    rawIsArrivalPickupRequired:
      item.eventGuest?.isArrivalPickupRequired ?? null,
    rawIsDeparturePickupRequired:
      item.eventGuest?.isDeparturePickupRequired ?? null,
    rawAssignedRoom: item.eventGuest?.assignedRoom ?? null,
    rawArrivalInfo: item.eventGuest?.arrivalInfo ?? null,
    rawDepartureInfo: item.eventGuest?.departureInfo ?? null,
  };
}
