import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Storage keys for business profile
const STORAGE_KEYS = {
  BUSINESS_INFO: "business_info",
  SERVICES_PRICING: "services_pricing",
  PORTFOLIO: "portfolio",
  VERIFICATION: "vendor_verification",
};

// Experience options
const EXPERIENCE_OPTIONS = [
  { id: "1", label: "1-2 years" },
  { id: "2", label: "3-5 years" },
  { id: "3", label: "5-10 years" },
  { id: "4", label: "10+ years" },
];

// Reusable Input Field Component (DRY principle)
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  multiline = false,
  required = false,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  multiline?: boolean;
  required?: boolean;
  error?: string;
}) => (
  <View className="mb-5">
    <View className="flex-row items-center mb-2">
      <Text className="text-sm font-semibold text-gray-800">{label}</Text>
      {required && <Text className="text-red-500 ml-1">*</Text>}
    </View>
    <View className={`relative ${multiline ? "" : "items-center"}`}>
      {icon && (
        <View
          className={`absolute ${multiline ? "top-4 left-4" : "left-4"} z-10`}
        >
          <MaterialIcons
            name={icon}
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
        className={`w-full bg-white rounded-xl shadow-sm border ${error ? "border-red-300" : "border-gray-100"} 
          ${multiline ? "p-4 min-h-[120px] text-top" : "h-14"} 
          ${icon ? (multiline ? "pl-12 pr-4" : "pl-12 pr-4") : "px-4"}
          text-gray-800 text-base`}
        style={multiline ? { textAlignVertical: "top" } : {}}
      />
    </View>
    {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
  </View>
);

// Reusable Select Field Component (DRY principle)
const SelectField = ({
  label,
  value,
  onPress,
  placeholder,
  required = false,
  error,
}: {
  label: string;
  value: string;
  onPress: () => void;
  placeholder: string;
  required?: boolean;
  error?: string;
}) => (
  <View className="mb-5">
    <View className="flex-row items-center mb-2">
      <Text className="text-sm font-semibold text-gray-800">{label}</Text>
      {required && <Text className="text-red-500 ml-1">*</Text>}
    </View>
    <TouchableOpacity
      onPress={onPress}
      className={`w-full h-14 px-4 bg-white rounded-xl shadow-sm border flex-row items-center justify-between ${error ? "border-red-300" : "border-gray-100"}`}
    >
      <Text
        className={
          value ? "text-gray-800 text-base" : "text-gray-400 text-base"
        }
      >
        {value || placeholder}
      </Text>
      <MaterialIcons name="expand-more" size={24} color="#9ca3af" />
    </TouchableOpacity>
    {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
  </View>
);

// Reusable Section Header Component
const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <View className="mb-5">
    <Text className="text-lg font-bold text-gray-900">{title}</Text>
    {subtitle && <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>}
  </View>
);

// Reusable Card Component
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

export default function BusinessInformationScreen() {
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [showExperiencePicker, setShowExperiencePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load data from local storage
  useEffect(() => {
    loadBusinessInfo();
  }, []);

  const loadBusinessInfo = async () => {
    try {
      setIsLoading(true);
      const storedInfo = await AsyncStorage.getItem(STORAGE_KEYS.BUSINESS_INFO);
      if (storedInfo) {
        const info = JSON.parse(storedInfo);
        setBusinessName(info.businessName || "");
        setBio(info.bio || "");
        setLocation(info.location || "");
        setExperience(info.experience || "");
      }
    } catch (error) {
      console.error("Error loading business info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!bio.trim()) {
      newErrors.bio = "Description is required";
    } else if (bio.length < 20) {
      newErrors.bio = "Please provide at least 20 characters";
    }

    if (!location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!experience) {
      newErrors.experience = "Please select your experience level";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveBusinessInfo = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const info = {
        businessName: businessName.trim(),
        bio: bio.trim(),
        location: location.trim(),
        experience,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.BUSINESS_INFO,
        JSON.stringify(info),
      );

      // TODO: Backend integration
      // await api.post('/api/business-info', info);

      router.back();
    } catch (error) {
      console.error("Error saving business info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExperienceSelect = (option: { id: string; label: string }) => {
    setExperience(option.label);
    setShowExperiencePicker(false);
    if (errors.experience) {
      setErrors((prev) => ({ ...prev, experience: "" }));
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1">
        {/* Professional Top App Bar */}
        <View className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
          <View className="flex-row items-center justify-between px-4 py-4">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
              accessibilityRole="button"
              onPress={() => router.back()}
            >
              <MaterialIcons
                name="arrow-back-ios-new"
                size={20}
                color="#374151"
              />
            </TouchableOpacity>
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-gray-900">
                Business Profile
              </Text>
            </View>
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-pink-50"
              accessibilityRole="button"
              onPress={saveBusinessInfo}
              disabled={isLoading}
            >
              <MaterialIcons
                name={isLoading ? "hourglass-empty" : "check"}
                size={20}
                color="#ee2b8c"
              />
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 px-4 pt-6 pb-10"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Section */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about your business
              </Text>
              <Text className="text-base text-gray-600 leading-relaxed">
                Help couples get to know you and your services. This information
                will be displayed on your profile.
              </Text>
            </View>

            {/* Business Details Card */}
            <Card className="mb-4">
              <SectionHeader
                title="Business Details"
                subtitle="Basic information about your business"
              />

              <InputField
                label="Business Name"
                value={businessName}
                onChangeText={(text) => {
                  setBusinessName(text);
                  if (errors.businessName)
                    setErrors((prev) => ({ ...prev, businessName: "" }));
                }}
                placeholder="e.g., Dreamy Moments Photography"
                icon="storefront"
                required
                error={errors.businessName}
              />
            </Card>

            {/* Description Card */}
            <Card className="mb-4">
              <SectionHeader
                title="About Your Services"
                subtitle="Describe what makes you unique"
              />

              <InputField
                label="Description"
                value={bio}
                onChangeText={(text) => {
                  setBio(text);
                  if (errors.bio) setErrors((prev) => ({ ...prev, bio: "" }));
                }}
                placeholder="Describe your style, expertise, and what makes your services special for cultural weddings..."
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
                  className={`text-xs ${bio.length >= 20 ? "text-green-500" : "text-gray-400"}`}
                >
                  {bio.length}/500
                </Text>
              </View>
            </Card>

            {/* Location Card */}
            <Card className="mb-4">
              <SectionHeader
                title="Service Area"
                subtitle="Where do you primarily operate?"
              />

              <InputField
                label="Base Location"
                value={location}
                onChangeText={(text) => {
                  setLocation(text);
                  if (errors.location)
                    setErrors((prev) => ({ ...prev, location: "" }));
                }}
                placeholder="City, State or Region"
                icon="location-on"
                required
                error={errors.location}
              />
            </Card>

            {/* Experience Card */}
            <Card className="mb-6">
              <SectionHeader
                title="Experience"
                subtitle="Years of experience in the industry"
              />

              <SelectField
                label="Years of Experience"
                value={experience}
                onPress={() => setShowExperiencePicker(!showExperiencePicker)}
                placeholder="Select your experience level"
                required
                error={errors.experience}
              />

              {/* Experience Options Picker */}
              {showExperiencePicker && (
                <View className="mt-3 bg-gray-50 rounded-xl p-2">
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => handleExperienceSelect(option)}
                      className={`p-3 rounded-lg flex-row items-center justify-between
                        ${experience === option.label ? "bg-pink-50" : "hover:bg-gray-100"}`}
                    >
                      <Text
                        className={`text-base ${
                          experience === option.label
                            ? "text-pink-600 font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </Text>
                      {experience === option.label && (
                        <MaterialIcons
                          name="check-circle"
                          size={20}
                          color="#ee2b8c"
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Card>

            {/* Tips Card */}
            <View className="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-6">
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="lightbulb" size={24} color="#f59e0b" />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-amber-800 mb-1">
                    Pro Tips
                  </Text>
                  <Text className="text-xs text-amber-700 leading-relaxed">
                    • Include your specialty (e.g., cultural weddings,
                    destination events){"\n"}• Mention languages you speak{"\n"}
                    • Highlight any unique services or packages
                  </Text>
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={saveBusinessInfo}
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
                {isLoading ? "Saving..." : "Save & Continue"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
