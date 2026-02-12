// ============================================
// Types
// ============================================

export type ViewMode = "success" | "events" | "subevent";

export interface Vendor {
  id: string;
  name: string;
  category: string;
  status: "Booked" | "Pending";
}

export interface SubEvent {
  id: string;
  name: string;
  vendors: Vendor[];
}

export interface Event {
  id: string;
  name: string;
  date: string;
  image: string;
  subEvents: SubEvent[];
}

// Mock data for events
export const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    name: "Emma & James Wedding",
    date: "2024-12-15",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDBTMpF5OGVFMpt0SFd1YYHvT0dbWhsJ1OiXWYAZtZHva3uRWvfDLTe0o9wji8CCfff_spyNbGa1EqMQAzU8TSgsZHHZyZczilaJjXsgkwdrHYtnhNzzELEAqjVUidiCPT2fu982NW88FUu6OLV-YHywILAwdx8LLdR69ManJPsqTJW1tjKuLVKnk4MgCSOSRbFhMOSEYIzSWmW-zWQIRd6Gn2odEDu-GJKhVcxGiy5nXwWuauIW5Hx3EfnwvPUTBI8LDijYJeRSk",
    subEvents: [
      {
        id: "s1",
        name: "Sangeet Ceremony",
        vendors: [
          { id: "v1", name: "DJ Beats", category: "Music", status: "Booked" },
          {
            id: "v2",
            name: "Flower Decor",
            category: "Decoration",
            status: "Pending",
          },
        ],
      },
      {
        id: "s2",
        name: "Mehendi Ceremony",
        vendors: [],
      },
    ],
  },
  {
    id: "2",
    name: "Sarah & John Reception",
    date: "2025-01-20",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDBTMpF5OGVFMpt0SFd1YYHvT0dbWhsJ1OiXWYAZtZHva3uRWvfDLTe0o9wji8CCfff_spyNbGa1EqMQAzU8TSgsZHHZyZczilaJjXsgkwdrHYtnhNzzELEAqjVUidiCPT2fu982NW88FUu6OLV-YHywILAwdx8LLdR69ManJPsqTJW1tjKuLVKnk4MgCSOSRbFhMOSEYIzSWmW-zWQIRd6Gn2odEDu-GJKhVcxGiy5nXwWuauIW5Hx3EfnwvPUTBI8LDijYJeRSk",
    subEvents: [],
  },
];
