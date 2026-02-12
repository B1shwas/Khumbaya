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

export const TABLE_TEMPLATES: TableTemplate[] = [
  { type: "rectangle", name: "Head Table", capacity: 12 },
  { type: "circle", name: "Round Table", capacity: 8 },
  { type: "circle", name: "Round Table", capacity: 10 },
];

export const MOCK_GUESTS: Guest[] = [
  {
    id: "1",
    name: "Eleanor Vance",
    familySize: 4,
    relation: "Family",
    groupId: "group-1",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "2",
    name: "Henry Vance",
    familySize: 4,
    relation: "Family",
    groupId: "group-1",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "3",
    name: "Mrs. Vance",
    familySize: 4,
    relation: "Family",
    groupId: "group-1",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "4",
    name: "Julia Vance",
    familySize: 4,
    relation: "Family",
    groupId: "group-1",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "5",
    name: "Steven Crain",
    familySize: 3,
    relation: "Family",
    groupId: "group-2",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "6",
    name: "Nell Crain",
    familySize: 3,
    relation: "Family",
    groupId: "group-2",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "7",
    name: "Luke Crain",
    familySize: 3,
    relation: "Family",
    groupId: "group-2",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "8",
    name: "Luke S.",
    familySize: 2,
    relation: "Friend",
    groupId: "group-3",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "9",
    name: "Shirley H.",
    familySize: 2,
    relation: "Friend",
    groupId: "group-3",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "10",
    name: "Arthur Vance",
    familySize: 2,
    relation: "Colleague",
    groupId: "group-4",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "11",
    name: "Olivia V.",
    familySize: 2,
    relation: "Colleague",
    groupId: "group-4",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "12",
    name: "Theodora C.",
    familySize: 1,
    relation: "Friend",
    groupId: "group-5",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
];

export const STORAGE_KEY = "@table_assignments";
