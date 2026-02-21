import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLogin } from "@/src/features/user/api/use-user";
import {
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "@/src/store/AuthContext";

const HERO_IMAGE = {
  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN-FEoQhxG6lP-FQVMe1qUei4T3CxXoHkTHsDyNDxSO_IFRDxGIht5dykZ-3DWt2lTQjhV-KLi5ZFosSjyhDNvvSjWAIJ-Rj_-DCV0Lay0B3xe5CiGhhud3kOCrq8ldLXDGfXq9m4ugIBdM8hiHIJkvBfNupxmLg2F9QRVLPclUHCdercJ4mxzdCGPNtzNhEPNcp2BAWODZQu6lJ7We5CmVKBxfHnDhgj8LVVuHJ2dznCSaFIKkzlmhXCI2q2ANN9IH7wGVenBmGA",
};

const COPY = {
  title: "Plan Your Perfect Day",
  subtitle: "Get Started with Your Account",
  usernameLabel: "Username or Email",
  usernamePlaceholder: "Emma@wedding.com",
  passwordLabel: "Password",
  passwordPlaceholder: "••••••••",
  login: "Login",
  signupPrompt: "Don't have an account?",
  signupCta: "Sign up",
  // vendorPrompt: "I am a vendor",
  // vendorCta: "Sign up as Vendor",
  socialDivider: "Or continue with",
  google: "Google",
  apple: "Apple",
  trustA: "SSL Secured",
  trustB: "Privacy Protected",
  terms: "Terms of Service",
  privacy: "Privacy Policy",
} as const;

export default function LoginPage() {
  // const { mutate: login, isPending } = useLogin();
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation

  const isValidEmail = true;
  const isValidPassword = password.length >= 6;
  const emailError =
    username.trim().length > 0 && !isValidEmail
      ? "Please enter a valid email"
      : null;
  const passwordError =
    password.length > 0 && !isValidPassword
      ? "Password must be at least 6 characters"
      : null;

  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Quirky touch: a gentle pulse on the heart badge to make the hero feel alive.
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
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulseScale]);

  const isLoginDisabled = useMemo(
    () =>
      username.trim().length === 0 ||
      password.trim().length === 0 ||
      !isValidEmail ||
      !isValidPassword,
    [username, password, isValidEmail, isValidPassword]
  );

  const handleLogin = useCallback(async () => {
    if (isLoginDisabled || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulated API call - replace with actual auth logic
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Uncomment and configure backend URL when ready
      const loginPayload = {
        email: username,
        password: password,
      };
      // login(loginPayload, {
      //   onSuccess: (data) => {
      //     console.log("Login successful:", data);
      //     // login function will handle setting auth state and redirecting
      //   },
      // });

      // try {

      //
      //   const result = await response.json();
      //   console.log('Login successful:', result);
      //
      //   // If backend returns token and user data
      //   // const { token, user } = result;
      //   // login({ ...user, token });
      // } catch (apiError) {
      //   setError("Invalid credentials. Please try again.");
      //   setIsLoading(false);
      //   return;
      // }

      // Set user in AuthContext for client role - AuthContext will handle redirect
      login({
        id: "1",
        email: username,
        name: username.split("@")[0],
        role: "client",
      });

      // Navigation will be handled by AuthContext's NavigationHandler
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [router, isLoginDisabled, isLoading, login]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Section */}
        <View className="h-[35vh] w-full overflow-hidden rounded-b-xl">
          <ImageBackground
            source={HERO_IMAGE}
            className="w-full h-[35vh]"
            resizeMode="cover"
            accessibilityLabel="Wedding venue hero image"
          />

          <View className="absolute bottom-6 left-0 right-0 items-center">
            <Animated.View
              style={{ transform: [{ scale: pulseScale }] }}
              className="rounded-full border border-yellow-200/60 bg-white/90 p-3"
            >
              <MaterialIcons name="favorite" size={28} color="#ee2b8c" />
            </Animated.View>
          </View>
        </View>

        {/* Content Section */}
        <View className="px-6 pb-8 pt-6">
          <View className="mb-6 items-center">
            <Text variant="h1" className="text-center text-3xl text-text-light">
              {COPY.title}
            </Text>
            <Text
              variant="body"
              className="mt-2 text-center text-sm font-medium text-muted-light px-2"
            >
              {COPY.subtitle}
            </Text>
          </View>

          <View className="gap-5">
            <View>
              <Text className="mb-1 ml-1 text-xs font-semibold uppercase tracking-wider text-text-light">
                {COPY.usernameLabel}
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder={COPY.usernamePlaceholder}
                placeholderTextColor="text-muted-light"
                autoCapitalize="none"
                keyboardType="email-address"
                className={`h-14 rounded-md border bg-white px-4 text-base text-text-light ${
                  emailError ? "border-red-500" : "border-gray-200"
                }`}
              />
              {emailError && (
                <Text className="ml-1 mt-1 text-xs text-red-500">
                  {emailError}
                </Text>
              )}
            </View>

            <View>
              <Text className="mb-1 ml-1 text-xs font-semibold uppercase tracking-wider text-text-light">
                {COPY.passwordLabel}
              </Text>
              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder={COPY.passwordPlaceholder}
                  placeholderTextColor="text-muted-light"
                  secureTextEntry={!isPasswordVisible}
                  className={`h-14 rounded-md border bg-white px-4 text-base text-text-light ${
                    passwordError ? "border-red-500" : "border-gray-200"
                  }`}
                />
                <Pressable
                  onPress={() => setIsPasswordVisible((prev) => !prev)}
                  className="absolute right-0 h-full items-center justify-center px-3"
                  accessibilityRole="button"
                  accessibilityLabel={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                >
                  <MaterialIcons
                    name={isPasswordVisible ? "visibility-off" : "visibility"}
                    size={20}
                    color="text-muted-light"
                  />
                </Pressable>
              </View>
              {passwordError && (
                <Text className="ml-1 mt-1 text-xs text-red-500">
                  {passwordError}
                </Text>
              )}
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={isLoginDisabled || isLoading}
              className={`h-14 flex-row items-center justify-center gap-2 rounded-md bg-primary shadow-md shadow-primary/20 ${
                isLoginDisabled || isLoading ? "opacity-60" : ""
              }`}
              accessibilityRole="button"
              accessibilityLabel="Login"
            >
              {isLoading ? (
                <Animated.View className="h-5 w-5 items-center justify-center rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Text className="font-bold text-white">{COPY.login}</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="white" />
                </>
              )}
            </Pressable>

            {error && (
              <View className="rounded-lg bg-red-50 p-3">
                <Text className="text-center text-sm text-red-600">
                  {error}
                </Text>
              </View>
            )}

            <View className="items-center gap-3 pt-1">
              <Link href="/(onboarding)/user-signup" asChild>
                <Pressable accessibilityRole="link">
                  <Text className="text-sm text-muted-light">
                    {COPY.signupPrompt}{" "}
                    <Text className=" underline text-black font-bold">
                      {COPY.signupCta}
                    </Text>
                  </Text>
                </Pressable>
              </Link>

              {/* Vendor sign up temporarily disabled
              <Link href="/(onboarding)/vendor-signup" asChild>
                <Pressable accessibilityRole="link">
                  <Text className="text-sm text-muted-light">
                    {COPY.vendorPrompt}{" "}
                    <Text className=" underline text-primary font-bold">
                      {COPY.vendorCta}
                    </Text>
                  </Text>
                </Pressable>
              </Link>
              */}
            </View>
          </View>

          <View className="mt-8 flex-row justify-center gap-6">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="verified-user" size={16} color="#c5a059" />
              <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {COPY.trustA}
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="lock" size={16} color="#c5a059" />
              <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {COPY.trustB}
              </Text>
            </View>
          </View>

          <View className=" self-end mt-6 px-4">
            <Text className="text-center text-xs leading-relaxed text-gray-400">
              By continuing, you agree to our{" "}
              <Text className="underline text-text-light text-xs  font-medium">
                {COPY.terms}
              </Text>
              {"  "}
              and {"  "}
              <Text className="underline text-text-light text-xs  font-medium">
                {COPY.privacy}
              </Text>
              .
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
