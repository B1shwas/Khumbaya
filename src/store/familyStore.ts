import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export type FamilyMember = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  relation: string;
  foodPreference?: string;
  idImage?: string;
  isAdult?: boolean;
  dob?: string;
  height?: string;
  idNumber?: string;
  isSelf?: boolean;
};

type FamilyState = {
  familyName: string;
  members: FamilyMember[];
  isLoading: boolean;

  // Actions
  setFamilyName: (name: string) => void;
  setMembers: (members: FamilyMember[]) => void;
  setMembersDirect: (
    updater: ((members: FamilyMember[]) => FamilyMember[]) | FamilyMember[]
  ) => void;
  addMember: (member: FamilyMember) => void;
  updateMember: (id: string, data: Partial<FamilyMember>) => void;
  removeMember: (id: string) => void;
  resetFamily: () => Promise<void>;
  loadFamily: () => Promise<void>;
};

export const useFamilyStore = create<FamilyState>((set, get) => ({
  familyName: "",
  members: [],
  isLoading: false,

  setFamilyName: (name) => set({ familyName: name }),

  setMembers: (members) => set({ members }),

  setMembersDirect: (updater) =>
    set((state) => ({
      members: typeof updater === "function" ? updater(state.members) : updater,
    })),
  addMember: (member) =>
    set((state) => ({
      members: [...state.members, member],
    })),

  updateMember: (id, data) =>
    set((state) => ({
      members: state.members.map((m) => (m.id === id ? { ...m, ...data } : m)),
    })),

  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
    })),

  resetFamily: async () => {
    await AsyncStorage.removeItem("familyData");
    set({ familyName: "", members: [] });
  },

  loadFamily: async () => {
    set({ isLoading: true });
    try {
      const familyData = await AsyncStorage.getItem("familyData");
      if (familyData) {
        const parsed = JSON.parse(familyData);
        set({
          familyName: parsed.familyName || "",
          members: parsed.members || [],
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error loading family:", error);
      set({ isLoading: false });
    }
  },
}));

// Helper to save family data to storage
export const saveFamilyToStorage = async () => {
  const { familyName, members } = useFamilyStore.getState();
  await AsyncStorage.setItem(
    "familyData",
    JSON.stringify({ familyName, members })
  );
};
