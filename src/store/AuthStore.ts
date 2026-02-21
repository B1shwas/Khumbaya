import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { create } from "zustand";
import { DEBUG_AUTO_LOGIN, TEST_USER } from "../config/env";

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
        SecureStore.getItemAsync('token'),
        AsyncStorage.getItem('user'),
      ]);

      let user = userString ? JSON.parse(userString) : null;

      // ✅ Development Bypass: If no real data, use test user
      if (!token && DEBUG_AUTO_LOGIN) {
        token = TEST_USER.token;
        user = TEST_USER.user;
        console.warn("⚠️ [AuthStore] Using Debug Auto-Login");
      }

      set({ token, user, isLoading: false });
    } catch (error) {
      console.error('Auth hydration failed:', error);
      set({ isLoading: false });
    }
  },

  setAuth: async (token, user) => {
    await Promise.all([
      SecureStore.setItemAsync('token', token),
      AsyncStorage.setItem('user', JSON.stringify(user)),
    ]);
    set({ token, user });
  },

  clearAuth: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync('token'),
      AsyncStorage.removeItem('user'),
    ]);
    set({ token: null, user: null });
  },

  isAuthenticated: () => Boolean(get().token),
}));
