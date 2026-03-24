export interface EventGuest {
  id: number;
  userId: number;
  eventId: number;
  familyId: number;
  status: string | null;
  arrival_date_time: string | null;
  departure_date_time: string | null;
  isAccomodation: boolean | null;
  isArrivalPickupRequired: boolean | null;
  isDeparturePickupRequired: boolean | null;
  notes: string | null;
  assigned_room: string | null;
  arrival_info: string | null;
  pickup_info?: string | null;
  departure_info: string | null;
  role: string | null;
  invited_by: number;
  joined_at: string;
  category: "friend" | "family" | "colleague" | "vvip";
}

export interface UserDetail {
  id: number;
  username: string;
  email: string;
  phone: string;
  photo: string | null;
  familyId: number;
  relation: string | null;
}

export interface GuestDetailInterface {
  user_detail: UserDetail;
  event_guest: EventGuest;
  family_name: string | null;
}

export interface FamilyGroup {
  type: "family";
  familyId: number;
  family_name: string;
  members: GuestDetailInterface[];
  primaryMember: GuestDetailInterface;
  memberCount: number;
}

export interface IndividualGuest {
  type: "individual";
  data: GuestDetailInterface;
}

export type GroupedInvitation = FamilyGroup | IndividualGuest;

export function groupInvitationsByFamily(
  invitations: GuestDetailInterface[]
): GroupedInvitation[] {
  const familyMap = new Map<number, GuestDetailInterface[]>();
  const individuals: GuestDetailInterface[] = [];

  invitations.forEach((invitation) => {
    if (invitation.event_guest.familyId !== null) {
      const familyId = invitation.event_guest.familyId;
      if (!familyMap.has(familyId)) {
        familyMap.set(familyId, []);
      }
      familyMap.get(familyId)!.push(invitation);
    } else {
      individuals.push(invitation);
    }
  });

  const grouped: GroupedInvitation[] = [];

  familyMap.forEach((members, familyId) => {
    grouped.push({
      type: "family",
      familyId,
      family_name: members[0].family_name || "Family",
      members,
      primaryMember: members[0],
      memberCount: members.length,
    });
  });

  individuals.forEach((guest) => {
    grouped.push({
      type: "individual",
      data: guest,
    });
  });

  return grouped;
}
