export interface RSVPQuestion {
  id: string;
  question: string;
  type: "choice" | "text" | "multi" | "number";
  options?: string[];
  required: boolean;
}

export interface InvitedEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  hostName: string;
  imageUrl: string;
  subEvents?: SubEvent[];
}

export interface SubEvent {
  id: string;
  name: string;
  icon: string;
  date: string;
  time: string;
}

export interface RSVPData {
  attending: boolean | null;
  responses: Record<string, string | string[]>;
  submitted: boolean;
}

export type RSVPStep = "decision" | "questions" | "confirmation";

export const rsvpQuestions: RSVPQuestion[] = [
  {
    id: "attendance",
    question: "Will you be attending?",
    type: "choice",
    options: ["Yes, I'll be there", "No, I can't make it"],
    required: true,
  },
  {
    id: "plus_one",
    question: "Will you be bringing a plus one?",
    type: "choice",
    options: ["Yes", "No"],
    required: false,
  },
  {
    id: "dietary",
    question: "Do you have any dietary restrictions?",
    type: "multi",
    options: [
      "Vegetarian",
      "Vegan",
      "Gluten-free",
      "Dairy-free",
      "Nut allergy",
      "Halal",
      "Kosher",
      "None",
    ],
    required: false,
  },
  {
    id: "song_request",
    question: "Any song requests for the party?",
    type: "text",
    required: false,
  },
  {
    id: "additional_guests",
    question: "How many additional guests (excluding plus one)?",
    type: "number",
    required: false,
  },
];

export const invitedEventData: InvitedEvent = {
  id: "5",
  title: "Friend's Birthday Bash",
  date: "Mar 15, 2024",
  time: "8:00 PM",
  location: "Rooftop Lounge",
  venue: "San Francisco, CA",
  hostName: "John Doe",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDSiNZxjryxVvBt_Qvd2BsU8jmuyGXsbWyZqiGyTJOFCn4I4QdwE-xrJUmE938nQ2sYjA0qbPec911z6qe-blSH_epWVfQJy2W2NwU5R-4dwi1k7uUfEgPutKfIV3RpR1EUutrAFt_7SBxXq5yRfR9EkuQCohSjZJpWgX0eNFvBY3F5rZ-xWmmB8Em-xGg1AvxCRQDlpUPXbLlpkcqBsqbQXGIi5tNUNw3p5WrCahAWFPRTkzEE0B8v47AYzYa8b-aEAMvtdko47AM",
  subEvents: [
    {
      id: "se1",
      name: "Welcome Drinks",
      icon: "wine",
      date: "Mar 15, 2024",
      time: "7:30 PM",
    },
    {
      id: "se2",
      name: "Dinner",
      icon: "restaurant",
      date: "Mar 15, 2024",
      time: "8:30 PM",
    },
    {
      id: "se3",
      name: "Cake Cutting",
      icon: "cake",
      date: "Mar 15, 2024",
      time: "10:00 PM",
    },
  ],
};
