import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
// import { DEBUG_AUTO_LOGIN, TEST_USER } from "../config/env";
// import { getUserProfile } from "../features/user/api/user.service";
import { API_BASE_URL, DEBUG_AUTO_LOGIN, TEST_USER } from "../config/env";

export type User = {
  id: number;
  email: string;
  name?: string;
  username?: string;
  phone?: string;
  bio?: string;
  photo?: string;
  avatar?: string;
  avatarImage?: string;
  profilePicture?: string;
  foodPreference?: string;
  food_preference?: string;
  identity?: string;
  idType?: string;
  idProof?: string;
  id_proof?: string;
  idNumber?: string;
  dateOfBirth?: string;
  date_of_birth?: string;
  idImage?: string;
  id_image?: string;
  governmentId?: string;
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
      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      const userData = await response.json();
      console.log("✅ [AuthStore] Fetched user profile:", userData);

      // Extract the actual user data from the response (API wraps data in { data: ... })
      const actualUserData = userData.data || userData;
      console.log("✅ [AuthStore] User data extracted:", actualUserData);

      // Update local storage and state
      await AsyncStorage.setItem("user", JSON.stringify(actualUserData));
      set({ user: actualUserData, isProfileLoading: false });
    } catch (error) {
      console.error("❌ [AuthStore] Error fetching user profile:", error);
      set({ isProfileLoading: false });
    }
  },
}));
