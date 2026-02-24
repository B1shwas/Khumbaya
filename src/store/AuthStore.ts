import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { DEBUG_AUTO_LOGIN, TEST_USER } from "../config/env";
import { getUserProfile } from "../features/user/api/user.service";

type User = {
  id: number;
  email: string;
  name?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isLoading: boolean; // ✅ Add loading state
  setAuth: (token: string, user: User | null) => Promise<void>;
  clearAuth: () => Promise<void>;
  isAuthenticated: () => boolean;
  hydrate: () => Promise<void>; // ✅ Manual hydration control
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoading: true, // Start loading until hydrated

  hydrate: async () => {
    try {
      let [token, userString] = await Promise.all([
        SecureStore.getItemAsync("token"),
        AsyncStorage.getItem("user"),
      ]);

      let user = userString ? JSON.parse(userString) : null;

      // ✅ Development Bypass: If no real data, use test user
      if (!token && DEBUG_AUTO_LOGIN) {
        token = TEST_USER.token;
        user = TEST_USER.user;
        console.warn("⚠️ [AuthStore] Using Debug Auto-Login");
      }

      // ✅ If token exists, validate it with backend
      if (token) {
        try {
          // Temporarily set token so axios interceptor can use it
          set({ token, user, isLoading: true });
          
          // Validate token by fetching user profile
          const profileData = await getUserProfile();
          
          // Token is valid! Update with full profile data
          user = {
            id: profileData.id,
            email: profileData.email,
            name: profileData.username,
          };
          
          set({ token, user, isLoading: false });
          console.log("✅ Token validated successfully");
        } catch (validationError) {
          // Token is invalid or expired → clear auth
          console.warn("❌ Token validation failed, clearing auth:", validationError);
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

  clearAuth: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync("token"),
      AsyncStorage.removeItem("user"),
    ]);
    set({ token: null, user: null });
  },

  isAuthenticated: () => Boolean(get().token),
}));
