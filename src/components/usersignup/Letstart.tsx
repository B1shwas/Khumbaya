import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import { useAuthStore } from "@/src/store/AuthStore";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type LetstartData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

type LetstartProps = {
  data: LetstartData;
  onChange: (updates: Partial<LetstartData>) => void;
  // onNext: () => void;
};

export default function Letstart({
  data,
  onChange /*, onNext */,
}: LetstartProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const router = useRouter();
  const { setAuth } = useAuthStore();

  // Validation functions
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!data.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(data.email.trim())) {
      errors.email = "Please enter a valid email";
    }
    if (!data.password.trim()) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!agreedToTerms) {
      errors.terms = "Please agree to the terms";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = () => {
    if (!validateForm()) return;

    // Login and navigate to home - AuthContext will handle redirect
    setAuth("demo-vendor-token", {
      id: `vendor-${Date.now()}`,
      email: data.email,
      name: data.fullName,
    });

    // TODO: Uncomment and configure backend URL when ready
    // const signupPayload = {
    //   fullName: data.fullName,
    //   email: data.email,
    //   phone: data.phone,
    //   password: data.password,
    // };
    //
    // try {
    //   const response = await fetch('https://your-api-domain.com/api/auth/signup', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(signupPayload),
    //   });
    //
    //   if (!response.ok) {
    //     throw new Error(`Signup failed: ${response.status}`);
    //   }
    //
    //   const result = await response.json();
    //   console.log('Signup successful:', result);
    //
    //   // If backend returns token, use it for authentication
    //   // const { token, user } = result;
    //   // login({ ...user, token });
    // } catch (error) {
    //   console.error('Signup error:', error);
    //   // Handle error - show toast/alert to user
    // }

    // Navigation will be handled by AuthContext's NavigationHandler
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingBottom: 24,
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="pt-4">
        <Text className="text-3xl font-jakarta-bold text-text-light">
          Let's get started
        </Text>
        <Text className="text-base text-muted-light mt-2">
          Enter your details to begin planning your dream event.
        </Text>
      </View>

      <View className="gap-6 pt-6">
        <View className="gap-2">
          <Text className="text-xs font-jakarta-semibold uppercase tracking-wider text-text-light">
            User Name
          </Text>
          <TextInput
            value={data.fullName}
            onChangeText={(value) => {
              onChange({ fullName: value });
              if (validationErrors.fullName) {
                setValidationErrors((prev) => ({ ...prev, fullName: "" }));
              }
            }}
            placeholder="Jane Doe"
            placeholderTextColor="#896175"
            className={`h-14 rounded-md border bg-white px-4 text-base text-text-light ${validationErrors.fullName ? "border-red-500" : "border-border"
              }`}
          />
          {validationErrors.fullName && (
            <Text className="text-xs text-red-500">
              {validationErrors.fullName}
            </Text>
          )}
        </View>

        <View className="gap-2">
          <Text className="text-xs font-jakarta-semibold uppercase tracking-wider text-text-light">
            Email Address
          </Text>
          <TextInput
            value={data.email}
            onChangeText={(value) => {
              onChange({ email: value });
              if (validationErrors.email) {
                setValidationErrors((prev) => ({ ...prev, email: "" }));
              }
            }}
            placeholder="jane@example.com"
            placeholderTextColor="#896175"
            keyboardType="email-address"
            autoCapitalize="none"
            className={`h-14 rounded-xl border bg-white px-4 text-base text-text-light ${validationErrors.email ? "border-red-500" : "border-border"
              }`}
          />
          {validationErrors.email && (
            <Text className="text-xs text-red-500">
              {validationErrors.email}
            </Text>
          )}
        </View>

        <View className="gap-2">
          <Text className="text-xs font-jakarta-semibold uppercase tracking-wider text-text-light">
            Phone Number
          </Text>
          <TextInput
            value={data.phone}
            onChangeText={(value) => onChange({ phone: value })}
            placeholder="+1 (234) 567-890"
            placeholderTextColor="#896175"
            keyboardType="phone-pad"
            className="h-14 rounded-xl border border-border bg-white px-4 text-base text-text-light"
          />
        </View>

        <View className="gap-2">
          <Text className="text-xs font-jakarta-semibold uppercase tracking-wider text-text-light">
            Password
          </Text>
          <View
            className={`flex-row items-center rounded-xl border bg-white px-4 ${validationErrors.password ? "border-red-500" : "border-border"
              }`}
          >
            <TextInput
              value={data.password}
              onChangeText={(value) => {
                onChange({ password: value });
                if (validationErrors.password) {
                  setValidationErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
              placeholder="At least 6 characters"
              placeholderTextColor="#896175"
              secureTextEntry={!showPassword}
              className="flex-1 py-4 text-base text-text-light"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              accessibilityRole="button"
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={22}
                color="#896175"
              />
            </TouchableOpacity>
          </View>
          {validationErrors.password && (
            <Text className="text-xs text-red-500">
              {validationErrors.password}
            </Text>
          )}
        </View>

        {/* Terms and Conditions Checkbox */}
        <TouchableOpacity
          onPress={() => setAgreedToTerms(!agreedToTerms)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreedToTerms }}
          className="flex-row items-center gap-2"
        >
          <View
            className={`w-5 h-5 rounded border-2 ${agreedToTerms ? "bg-primary border-primary" : "border-gray-400"} items-center justify-center`}
          >
            {agreedToTerms && (
              <MaterialIcons name="check" size={14} color="white" />
            )}
          </View>
          <Text className="text-sm text-muted-light">
            I agree to the{" "}
            <Text className="text-primary font-bold">Terms of Service</Text> and{" "}
            <Text className="text-primary font-bold">Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-auto gap-4 pt-8">
        <Button
          onPress={handleSignUp}
          disabled={!agreedToTerms}
          className={`rounded-xl ${!agreedToTerms ? "opacity-50" : ""}`}
        >
          Sign Up
        </Button>

        <TouchableOpacity accessibilityRole="button" className="items-center">
          <Link href="/(onboarding)/login" asChild>
            <Pressable>
              <Text className="text-sm text-muted-light">
                Already have an account?{" "}
                <Text className="text-primary">Log in</Text>
              </Text>
            </Pressable>
          </Link>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
