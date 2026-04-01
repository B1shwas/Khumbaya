import { create } from "zustand";
import { Business } from "../types";

interface BusinessDraftStore {
  business: Business | null;
  setBusiness: (business: Business) => void;
  clearBusiness: () => void;
}

export const useBusinessDraftStore = create<BusinessDraftStore>((set) => ({
  business: null,
  setBusiness: (business) => set({ business }),
  clearBusiness: () => set({ business: null }),
}));


