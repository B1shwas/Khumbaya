// TODO: Replave this in the feature type of the guest 
import { Invitation } from "@/src/features/guests/types";
import { create } from "zustand";
import { User } from "./AuthStore";

export type RsvpDraftUser = Pick<
  User,
  "id" | "username" | "photo" | "email" | "phone" | "relation" | "familyId"
>;

export interface RsvpFamilyMemberDraft {
  user: RsvpDraftUser;
  familyId?: Invitation["familyId"];
  eventGuest: Partial<Invitation> | null;
}

export interface RsvpDraft {
  user: RsvpDraftUser;
  familyId?: Invitation["familyId"];
  eventGuest: Partial<Invitation> | null;
  familyMembers?: RsvpFamilyMemberDraft[];
}

interface RsvpState {
  draft: RsvpDraft | null;
  setDraft: (draft: RsvpDraft) => void;
  clearDraft: () => void;
}

export const useRsvpStore = create<RsvpState>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));
