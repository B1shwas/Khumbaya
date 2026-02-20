import CustomHeader from "@/src/components/ui/profile/CustomHeader";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
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
  placeholder,
  showPassword,
  onTogglePassword,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
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
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        secureTextEntry={!showPassword}
        className={`w-full bg-white rounded-xl shadow-sm border ${error ? "border-red-300" : "border-gray-100"} h-14 px-4 pr-12 text-gray-800 text-base`}
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

// Reusable Card Component (DRY)
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View
    className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </View>
);

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTogglePassword = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader
        title="Change Password"
        showSaveButton
        onSave={handleChangePassword}
        isLoading={isLoading}
      />
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
          <Card className="mb-4">
            <PasswordInput
              label="Current Password"
              value={formData.currentPassword}
              onChangeText={(text) =>
                handleInputChange("currentPassword", text)
              }
              placeholder="Enter current password"
              showPassword={showPassword.current}
              onTogglePassword={() => handleTogglePassword("current")}
              error={errors.currentPassword}
            />

            <PasswordInput
              label="New Password"
              value={formData.newPassword}
              onChangeText={(text) => handleInputChange("newPassword", text)}
              placeholder="Enter new password"
              showPassword={showPassword.new}
              onTogglePassword={() => handleTogglePassword("new")}
              error={errors.newPassword}
            />

            <PasswordInput
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChangeText={(text) =>
                handleInputChange("confirmPassword", text)
              }
              placeholder="Confirm new password"
              showPassword={showPassword.confirm}
              onTogglePassword={() => handleTogglePassword("confirm")}
              error={errors.confirmPassword}
            />
          </Card>

          {/* Tips */}
          <View className="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-6">
            <View className="flex-row items-start gap-3">
              <MaterialIcons name="lightbulb" size={24} color="#f59e0b" />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-amber-800 mb-1">
                  Password Tips
                </Text>
                <Text className="text-xs text-amber-700 leading-relaxed">
                  • Use at least 8 characters{"\n"}• Mix uppercase and lowercase
                  letters{"\n"}• Include numbers and special characters{"\n"}•
                  Avoid using personal information
                </Text>
              </View>
            </View>
          </View>

          {/* Change Password Button */}
          <TouchableOpacity
            onPress={handleChangePassword}
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
