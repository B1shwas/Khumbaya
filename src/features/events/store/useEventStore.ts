import {create} from "zustand";
import { Event } from "@/src/constants/event";
interface EventStore {
  eventDraft: Event | null;
  setEventDraft: (event: Event) => void;
  clearEventDraft: () => void;
}

export const useEventStore = create<EventStore>((set) => ({
  eventDraft: null,
  setEventDraft: (event) => set({ eventDraft: event }),
  clearEventDraft: () => set({ eventDraft: null }),
}));