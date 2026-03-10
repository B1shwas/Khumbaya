import { useChangePassword } from "@/src/features/user/api/use-user";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Reusable Password Input Component (DRY)
const PasswordInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  showPassword,
  onTogglePassword,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  error?: string;
}) => (
  <View className="mb-5">
    <View className="flex-row items-center mb-2">
      <Text className="text-sm font-semibold text-gray-800">{label}</Text>
    </View>
    <View className="relative">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        secureTextEntry={!showPassword}
        className={`w-full bg-gray-200 rounded-md shadow-sm border ${error ? "border-red-300" : "border-gray-100"} h-14 px-4 pr-12 text-gray-800 text-base`}
      />
      <TouchableOpacity
        className="absolute right-4 top-1/2 -translate-y-1/2"
        onPress={onTogglePassword}
      >
        <MaterialIcons
          name={showPassword ? "visibility-off" : "visibility"}
          size={20}
          color="#9ca3af"
        />
      </TouchableOpacity>
    </View>
    {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
  </View>
);

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const getApiErrorMessage = (error: unknown): string | null => {
  if (!error || typeof error !== "object") {
    return null;
  }

  const maybeError = error as {
    response?: {
      data?: {
        message?: string | string[];
      };
    };
    message?: string;
  };

  const message = maybeError.response?.data?.message;
  if (Array.isArray(message) && message.length > 0) {
    return message[0];
  }
  if (typeof message === "string" && message.trim()) {
    return message;
  }
  if (typeof maybeError.message === "string" && maybeError.message.trim()) {
    return maybeError.message;
  }

  return null;
};

export default function ChangePasswordScreen() {
  const {
    mutate: changePassword,
    isPending,
    error: mutationError,
  } = useChangePassword();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleTogglePassword = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const apiErrorMessage =
    getApiErrorMessage(mutationError) ||
    "Invalid credentials. Please verify your current password and try again.";

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Password changed successfully!");
          reset();
        },
      }
    );
  };

  const isLoading = isPending || isSubmitting;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4 pt-6 pb-10"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Change Password
            </Text>
            <Text className="text-base text-gray-600 leading-relaxed">
              Update your password to keep your account secure.
            </Text>
          </View>

          {/* Password Form */}
          <View className="mb-4 p-5">
            <Controller
              control={control}
              name="currentPassword"
              rules={{
                required: "Current password is required",
                minLength: {
                  value: 5,
                  message: "Password must be at least 5 characters",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="Current Password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter current password"
                  showPassword={showPassword.current}
                  onTogglePassword={() => handleTogglePassword("current")}
                  error={errors.currentPassword?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="newPassword"
              rules={{
                required: "New password is required",
                minLength: {
                  value: 5,
                  message: "Password must be at least 5 characters",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="New Password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter new password"
                  showPassword={showPassword.new}
                  onTogglePassword={() => handleTogglePassword("new")}
                  error={errors.newPassword?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                minLength: {
                  value: 5,
                  message: "Password must be at least 5 characters",
                },
                validate: (value) =>
                  value === getValues("newPassword") ||
                  "Passwords do not match",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="Confirm New Password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Confirm new password"
                  showPassword={showPassword.confirm}
                  onTogglePassword={() => handleTogglePassword("confirm")}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            {mutationError && (
              <View className="rounded-lg bg-red-50 p-3 mt-1">
                <Text className="text-sm text-red-600 text-center">
                  {apiErrorMessage}
                </Text>
              </View>
            )}
          </View>

          {/* Change Password Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`w-full h-14 bg-pink-500 rounded-xl flex-row items-center justify-center shadow-lg shadow-pink-200 
              ${isLoading ? "opacity-70" : ""}`}
            activeOpacity={0.9}
          >
            <MaterialIcons
              name="lock"
              size={20}
              color="#ffffff"
              className="mr-2"
            />
            <Text className="text-white font-bold text-lg">
              {isLoading ? "Changing..." : "Change Password"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
