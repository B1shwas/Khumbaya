import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../store/AuthContext";

const HERO_IMAGE = {
  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN-FEoQhxG6lP-FQVMe1qUei4T3CxXoHkTHsDyNDxSO_IFRDxGIht5dykZ-3DWt2lTQjhV-KLi5ZFosSjyhDNvvSjWAIJ-Rj_-DCV0Lay0B3xe5CiGhhud3kOCrq8ldLXDGfXq9m4ugIBdM8hiHIJkvBfNupxmLg2F9QRVLPclUHCdercJ4mxzdCGPNtzNhEPNcp2BAWODZQu6lJ7We5CmVKBxfHnDhgj8LVVuHJ2dznCSaFIKkzlmhXCI2q2ANN9IH7wGVenBmGA",
};

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, []);

  const isLoginDisabled = useMemo(
    () => email.trim().length === 0 || password.trim().length === 0,
    [email, password],
  );

  const handleLogin = useCallback(async () => {
    if (isLoginDisabled) return;

    try {
      setLoading(true);

      // Mock login for demo - in real app, this would be an API call
      const mockUser = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: email.includes("vendor")
          ? ("vendor" as const)
          : ("client" as const),
      };

      login(mockUser);

      // Role-based navigation
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
  }, [email, password, login, router]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 w-full max-w-md self-center">
            {/* HERO IMAGE */}
            <View className="h-[35vh] w-full overflow-hidden rounded-b-xl">
              <ImageBackground
                source={HERO_IMAGE}
                className="h-full w-full"
                resizeMode="cover"
              >
                <LinearGradient
                  colors={["rgba(22,33,62,0.6)", "transparent"]}
                  className="absolute inset-0"
                />
                <View className="absolute bottom-6 left-0 right-0 items-center">
                  <Animated.View
                    style={{ transform: [{ scale: pulseScale }] }}
                    className="rounded-full border border-yellow-200/60 bg-white/90 p-3"
                  >
                    <MaterialIcons name="favorite" size={28} color="#ee2b8c" />
                  </Animated.View>
                </View>
              </ImageBackground>
            </View>

            {/* FORM */}
            <View className="px-6 pb-8 pt-6">
              <View className="mb-6 items-center">
                <Text className="text-3xl font-bold text-center">
                  Welcome Back
                </Text>
                <Text className="mt-2 text-sm text-gray-500 text-center">
                  Login to access your dashboard
                </Text>
              </View>

              {/* Email */}
              <View className="mb-5">
                <Text className="mb-1 text-xs font-semibold uppercase">
                  Email
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  className="h-12 rounded-lg border border-gray-200 bg-slate-50 px-4"
                />
              </View>

              {/* Password */}
              <View className="mb-6">
                <Text className="mb-1 text-xs font-semibold uppercase">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    secureTextEntry={!isPasswordVisible}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    className="h-12 rounded-lg border border-gray-200 bg-slate-50 px-4 pr-12"
                  />
                  <Pressable
                    onPress={() => setIsPasswordVisible((prev) => !prev)}
                    className="absolute right-0 h-full items-center justify-center px-3"
                  >
                    <MaterialIcons
                      name={isPasswordVisible ? "visibility-off" : "visibility"}
                      size={20}
                      color="#94A3B8"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Login Button */}
              <Pressable
                onPress={handleLogin}
                disabled={isLoginDisabled || loading}
                className={`h-12 rounded-lg items-center justify-center ${
                  isLoginDisabled || loading ? "bg-gray-400" : "bg-primary"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">Login</Text>
                )}
              </Pressable>

              {/* Sign Up Link */}
              <Pressable
                onPress={() => router.replace("/(onboarding)/(usersignup)")}
                className="mt-4 items-center"
              >
                <Text className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Text className="font-bold text-primary">Sign up</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
