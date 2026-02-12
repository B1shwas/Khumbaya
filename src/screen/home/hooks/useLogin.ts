import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Alert, Animated } from "react-native";
import { useAuth } from "../../../store/AuthContext";
import type { MockUser } from "../types/login";

export const useLogin = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const pulseScale = useRef(new Animated.Value(1)).current;

  const isLoginDisabled = useMemo(
    () => email.trim().length === 0 || password.trim().length === 0,
    [email, password],
  );

  const handleLogin = useCallback(async () => {
    if (isLoginDisabled) return;

    try {
      setLoading(true);

      const mockUser: MockUser = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: email.includes("vendor") ? "vendor" : "client",
      };

      login(mockUser);

      if (mockUser.role === "vendor") {
        router.replace("/(protected)/(vendor-tabs)/home");
      } else {
        router.replace("/(protected)/(client-tabs)/home");
      }
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error?.response?.data?.message || "Invalid credentials",
      );
    } finally {
      setLoading(false);
    }
  }, [email, password, login, router, isLoginDisabled]);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    isPasswordVisible,
    loading,
    isLoginDisabled,
    pulseScale,
    handleLogin,
    togglePasswordVisibility,
  };
};
