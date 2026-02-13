import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
type Role = "client" | "vendor"
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

const USER_STORAGE_KEY = "auth_user";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser) as User;
            setUser(parsedUser);
          } catch (parseError) {
            console.warn("Failed to parse stored user, clearing.", parseError);
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
          }
        }
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
    void AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    void AsyncStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
