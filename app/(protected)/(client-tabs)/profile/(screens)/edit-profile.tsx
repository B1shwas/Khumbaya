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

// Reusable InputField Component (DRY)
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  multiline = false,
  required = false,
  error,
  keyboardType = "default",
  autoCapitalize = "sentences",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon?: string;
  multiline?: boolean;
  required?: boolean;
  error?: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) => (
  <View className="mb-5">
    <View className="flex-row items-center mb-2">
      <Text className="text-sm font-semibold text-gray-800">{label}</Text>
      {required && <Text className="text-red-500 ml-1">*</Text>}
    </View>
    <View className="relative">
      {icon && (
        <View
          className={`absolute ${multiline ? "top-4 left-4" : "left-4"} z-10`}
        >
          <MaterialIcons
            name={icon as any}
            size={20}
            color={error ? "#ef4444" : "#9ca3af"}
          />
        </View>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        className={`w-full bg-white rounded-xl shadow-sm border ${error ? "border-red-300" : "border-gray-100"} 
          ${multiline ? "p-4 min-h-[100px] text-top" : "h-14"} 
          ${icon ? (multiline ? "pl-12 pr-4" : "pl-12 pr-4") : "px-4"}
          text-gray-800 text-base`}
        style={multiline ? { textAlignVertical: "top" } : {}}
      />
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

export default function EditProfileScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "Sarah Mitchell",
    email: "sarah.mitchell@example.com",
    phone: "+1 234 567 8900",
    bio: "Professional wedding planner with 5+ years of experience creating unforgettable events.",
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.length < 20) {
      newErrors.bio = "Please write at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Profile updated successfully!");
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader
        title="Edit Profile"
        showSaveButton
        onSave={handleSave}
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
              Your Profile
            </Text>
            <Text className="text-base text-gray-600 leading-relaxed">
              Update your personal information and how you appear to others.
            </Text>
          </View>

          {/* Profile Form */}
          <Card className="mb-4">
            <InputField
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="Enter your full name"
              icon="person"
              required
              error={errors.name}
            />

            <InputField
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Enter your email"
              icon="email"
              required
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <InputField
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              placeholder="Enter your phone number"
              icon="phone"
              required
              error={errors.phone}
              keyboardType="phone-pad"
            />

            <InputField
              label="Bio"
              value={formData.bio}
              onChangeText={(text) => handleInputChange("bio", text)}
              placeholder="Tell others about yourself..."
              icon="description"
              multiline
              required
              error={errors.bio}
            />

            <View className="flex-row justify-between mt-2">
              <Text className="text-xs text-gray-400">
                Minimum 20 characters
              </Text>
              <Text
                className={`text-xs ${formData.bio.length >= 20 ? "text-green-500" : "text-gray-400"}`}
              >
                {formData.bio.length}/500
              </Text>
            </View>
          </Card>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            className={`w-full h-14 bg-pink-500 rounded-xl flex-row items-center justify-center shadow-lg shadow-pink-200 
              ${isLoading ? "opacity-70" : ""}`}
            activeOpacity={0.9}
          >
            <MaterialIcons
              name="save"
              size={20}
              color="#ffffff"
              className="mr-2"
            />
            <Text className="text-white font-bold text-lg">
              {isLoading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
