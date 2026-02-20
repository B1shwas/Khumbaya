// ============================================
// Types
// ============================================

export interface Guest {
  id: string;
  name: string;
  familySize: number;
  relation: string;
  groupId: string;
  tableId: string | null;
  seatNumber: number | null;
  assigned: boolean;
}

export interface GuestGroup {
  id: string;
  name: string;
  members: Guest[];
  totalSize: number;
  assigned: boolean;
}

export interface Seat {
  id: string;
  number: number;
  guestId: string | null;
}

export interface Table {
  id: string;
  name: string;
  type: "rectangle" | "circle";
  x: number;
  y: number;
  capacity: number;
  seats: Seat[];
}

export interface TableTemplate {
  type: "rectangle" | "circle";
  name: string;
  capacity: number;
}

// ============================================
// Constants
// ============================================

export const TABLE_TEMPLATES: TableTemplate[] = [
  { type: "rectangle", name: "Head Table", capacity: 12 },
  { type: "circle", name: "Round Table", capacity: 8 },
  { type: "circle", name: "Round Table", capacity: 10 },
];

export const STORAGE_KEY = "@table_assignments";

// ============================================
// Guest & Group Utilities
// ============================================

/**
 * Build groups from guests array
 */
export const buildGroups = (guests: Guest[]): GuestGroup[] => {
  const groupMap = new Map<string, Guest[]>();

  guests.forEach((guest) => {
    if (!groupMap.has(guest.groupId)) {
      groupMap.set(guest.groupId, []);
    }
    groupMap.get(guest.groupId)!.push(guest);
  });

  return Array.from(groupMap.entries()).map(([id, members]) => ({
    id,
    name: members[0].relation || "Group",
    members,
    totalSize: members.reduce((sum, m) => sum + m.familySize, 0),
    assigned: members.every((m) => m.assigned),
  }));
};

/**
 * Create a guest lookup map for O(1) access
 */
export const createGuestMap = (guests: Guest[]): Map<string, Guest> => {
  const map = new Map<string, Guest>();
  guests.forEach((g) => map.set(g.id, g));
  return map;
};

// ============================================
// Table & Seat Utilities
// ============================================

/**
 * Assign guests to seats in a table
 */
export const assignGuestsToSeats = (
  table: Table,
  guestIds: string[]
): Table => {
  const availableIds = [...guestIds];
  const newSeats = table.seats.map((s) => {
    if (!s.guestId && availableIds.length > 0) {
      const guestId = availableIds.shift()!;
      return { ...s, guestId };
    }
    return s;
  });
  return { ...table, seats: newSeats };
};

/**
 * Remove specific guests from a table
 */
export const removeGuestsFromTable = (
  table: Table,
  guestIds: string[]
): Table => {
  return {
    ...table,
    seats: table.seats.map((s) =>
      guestIds.includes(s.guestId || "") ? { ...s, guestId: null } : s
    ),
  };
};

/**
 * Remove all guests from a table
 */
export const clearTable = (table: Table): Table => ({
  ...table,
  seats: table.seats.map((s) => ({ ...s, guestId: null })),
});

/**
 * Get available seats in a table
 */
export const getAvailableSeats = (table: Table): Seat[] =>
  table.seats.filter((s) => !s.guestId);

/**
 * Get seated guests count
 */
export const getSeatedCount = (table: Table): number =>
  table.seats.filter((s) => s.guestId).length;

// ============================================
// Guest Update Utilities
// ============================================

/**
 * Update guest assignments
 */
export const updateGuestAssignments = (
  guests: Guest[],
  guestIds: string[],
  tableId: string | null,
  assigned: boolean
): Guest[] =>
  guests.map((g) =>
    guestIds.includes(g.id)
      ? { ...g, tableId, assigned, seatNumber: tableId ? g.seatNumber : null }
      : g
  );

/**
 * Unassign all guests from a specific table
 */
export const unassignTableGuests = (
  guests: Guest[],
  tableId: string
): Guest[] =>
  guests.map((g) =>
    g.tableId === tableId
      ? { ...g, assigned: false, tableId: null, seatNumber: null }
      : g
  );
