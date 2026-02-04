import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "client" | "vendor";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    role: "vendor",
    id: "1",
    email: "client@example.com",
    name: "Client User",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Check stored auth token/session on mount
    // Example: Load from AsyncStorage
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // TODO: Implement actual auth check
      // const token = await AsyncStorage.getItem('auth_token');
      // if (token) {
      //   const userData = await validateToken(token);
      //   setUser(userData);
      // }

      // For now, simulate check
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    // TODO: Store token in AsyncStorage
  };

  const logout = () => {
    setUser(null);
    // TODO: Clear token from AsyncStorage
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: true,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
