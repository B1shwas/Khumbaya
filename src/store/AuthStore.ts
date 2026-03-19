import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import axios from "../api/axios";
import { getUserProfile } from "../features/user/api/user.service";

export type User = {
  id: number;
  username: string;
  info: any | null;
  dob: Date | null;
  email: string;
  city: string | null;
  zip: string | null;
  address: string | null;
  coverPhoto: string | null;
  photo: string | null;
  familyId: number | null;
  relation: string | null;
  foodPreference: string | null;
  country: string | null;
  bio: string | null;
  location: string | null;
  phone: string;
  accountStatus: boolean | null;
  createdAt: Date | null;
  isActivated: boolean;
  updatedAt: Date | null;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  setAuth: (token: string, user: User | null) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearAuth: () => Promise<void>;
  isAuthenticated: () => boolean;
  hydrate: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoading: true,
  isProfileLoading: false,

  hydrate: async () => {
    try {
      let [token, userString] = await Promise.all([
        SecureStore.getItemAsync("token"),
        AsyncStorage.getItem("user"),
      ]);
      let user = userString ? JSON.parse(userString) : null;
      // ✅ If token exists, validate it with backend
      if (token) {
        try {

          set({ token, user, isLoading: true });
          const profileData = await getUserProfile();

          user = {
            id: profileData.id,
            email: profileData.email,
            name: profileData.username,
          };

          set({ token, user, isLoading: false });
          console.log("✅ Token validated successfully");
        } catch (validationError) {
          // Token is invalid or expired → clear auth
          console.warn(
            "❌ Token validation failed, clearing auth:",
            validationError
          );
          await SecureStore.deleteItemAsync("token");
          await AsyncStorage.removeItem("user");
          set({ token: null, user: null, isLoading: false });
        }
      } else {
        // No token, just finish hydration
        set({ token, user, isLoading: false });
      }
    } catch (error) {
      console.error("Auth hydration failed:", error);
      set({ isLoading: false });
    }
  },

  setAuth: async (token, user) => {
    await Promise.all([
      SecureStore.setItemAsync("token", token),
      AsyncStorage.setItem("user", JSON.stringify(user)),
    ]);
    set({ token, user });
  },

  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      ...userData,
      id: userData.id ?? currentUser.id,
    };

    // Persist to AsyncStorage
    AsyncStorage.setItem("user", JSON.stringify(updatedUser)).catch(
      console.error
    );

    set({ user: updatedUser });
  },

  clearAuth: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync("token"),
      AsyncStorage.removeItem("user"),
    ]);
    set({ token: null, user: null });
  },

  isAuthenticated: () => Boolean(get().token),

  fetchUserProfile: async () => {
    const { token } = get();
    if (!token) {
      console.warn("⚠️ [AuthStore] No token found, cannot fetch profile");
      return;
    }
    set({ isProfileLoading: true });
    try {
      const response = await axios.get(`/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);

      const userData = response.data
      const actualUserData = userData.data || userData;
      await AsyncStorage.setItem("user", JSON.stringify(actualUserData));
      set({ user: actualUserData, isProfileLoading: false });
    } catch (error) {
      console.error("❌ [AuthStore] Error fetching user profile:", error);
      set({ isProfileLoading: false });
    }
  },
}));
