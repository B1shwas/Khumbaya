// ============================================
// Types
// ============================================

export interface CardItem {
  id: string;
  title: string;
  image: string | null;
  prompt: string;
  category:
    | "invitation"
    | "thankyou"
    | "save-the-date"
    | "bride-book"
    | "other";
}

export interface ImageOption {
  id: string;
  uri: string;
  category: string;
}

export interface CardCategory {
  id: string;
  name: string;
  icon: string;
}

// Mock image gallery for selection
export const MOCK_IMAGES: ImageOption[] = [
  {
    id: "img1",
    uri: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400",
    category: "wedding",
  },
  {
    id: "img2",
    uri: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400",
    category: "wedding",
  },
  {
    id: "img3",
    uri: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=400",
    category: "decoration",
  },
  {
    id: "img4",
    uri: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400",
    category: "flowers",
  },
  {
    id: "img5",
    uri: "https://images.unsplash.com/photo-1520854221256-17451cc330e7?w=400",
    category: "wedding",
  },
  {
    id: "img6",
    uri: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400",
    category: "rings",
  },
  {
    id: "img7",
    uri: "https://images.unsplash.com/photo-1591604466107-ec6de0cf4239?w=400",
    category: "couple",
  },
  {
    id: "img8",
    uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    category: "bride",
  },
];

export const CARD_CATEGORIES: CardCategory[] = [
  { id: "invitation", name: "Wedding Invitation", icon: "mail" },
  { id: "thankyou", name: "Thank You Card", icon: "heart" },
  { id: "save-the-date", name: "Save the Date", icon: "calendar" },
  { id: "bride-book", name: "Bridal Book", icon: "book" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    invitation: "#ee2b8c",
    thankyou: "#10B981",
    "save-the-date": "#F59E0B",
    "bride-book": "#8B5CF6",
    other: "#6B7280",
  };
  return colors[category] || "#6B7280";
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    invitation: "mail",
    thankyou: "heart",
    "save-the-date": "calendar",
    "bride-book": "book",
    other: "ellipsis-horizontal",
  };
  return icons[category] || "ellipsis-horizontal";
};
