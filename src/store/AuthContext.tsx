import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type Role = "client" | "vendor";

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

function useProtectedRoute(user: User | null, isLoading: boolean) {
  const router = useRouter();
  const segments = useSegments();
  const navState = useRootNavigationState();

  const inOnboarding = segments[0] === "(onboarding)";
  const inProtected = segments[0] === "(protected)";
  const inClientTabs = segments[1] === "(client-tabs)";
  const inVendorTabs = segments[1] === "(vendor-tabs)";

  const getHomeRoute = (role: Role) =>
    role === "vendor"
      ? "/(protected)/(vendor-tabs)/home"
      : "/(protected)/(client-tabs)/home";

  // Is the current route allowed?
  const isAllowed = React.useMemo(() => {
    if (!navState?.key || isLoading) return false;

    // Guest can only access onboarding
    if (!user) return !inProtected;

    // Logged in user can't access onboarding
    if (inOnboarding) return false;

    // Role-based access
    if (inVendorTabs && user.role !== "vendor") return false;
    if (inClientTabs && user.role !== "client") return false;

    return true;
  }, [user, segments, navState?.key, isLoading]);

  // Redirect if not allowed
  useEffect(() => {
    if (!navState?.key || isLoading) return;

    // Guest trying to access protected → send to onboarding
    if (!user && inProtected) {
      router.replace("/(onboarding)");
      return;
    }

    // Logged in user in onboarding → send to home
    if (user && inOnboarding) {
      router.replace(getHomeRoute(user.role));
      return;
    }

    // Wrong role → send to correct home
    if (user && inVendorTabs && user.role !== "vendor") {
      router.replace(getHomeRoute(user.role));
      return;
    }
    if (user && inClientTabs && user.role !== "client") {
      router.replace(getHomeRoute(user.role));
      return;
    }
  }, [user, segments, navState?.key, isLoading]);

  return { isAllowed, isLoading };
}

function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <ActivityIndicator size="large" color="#ee2b8c" />
    </View>
  );
}

function NavigationHandler({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { isAllowed } = useProtectedRoute(user, isLoading);

  // Show loader while checking auth or redirecting
  if (isLoading || !isAllowed) return <LoadingScreen />;

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // TODO: Set to null for production (currently mocked for testing)
  const [user, setUser] = useState<User | null>({
    id: "1",
    email: "vendor@example.com",
    name: "Vendor User",
    role: "client",
  });

  const [isLoading, setIsLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Replace with real auth check
        // const token = await SecureStore.getItemAsync('auth_token');
        // const data = await SecureStore.getItemAsync('user_data');
        // if (token && data) setUser(JSON.parse(data));

        await new Promise((r) => setTimeout(r, 500)); // Simulate delay
      } catch (e) {
        console.error("Auth check failed:", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // TODO: SecureStore.setItemAsync('user_data', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // TODO: SecureStore.deleteItemAsync('user_data');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      <NavigationHandler>{children}</NavigationHandler>
    </AuthContext.Provider>
  );
}
