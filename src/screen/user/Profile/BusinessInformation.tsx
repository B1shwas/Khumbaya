import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
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

export default function BusinessInformationScreen() {
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const router = useRouter();

  // Load data from local storage
  useEffect(() => {
    loadBusinessInfo();
  }, []);

  const loadBusinessInfo = async () => {
    try {
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
    }
  };

  const saveBusinessInfo = async () => {
    try {
      const info = {
        businessName,
        bio,
        location,
        experience,
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
    }
  };

  const handleExperienceSelect = () => {
    // TODO: Implement experience selection (ActionSheet / Picker)
    setExperience("5+ years");
  };

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1">
        {/* Top App Bar */}
        <View className="sticky top-0 z-10 flex-row items-center justify-between px-4 py-4 bg-white shadow-sm">
          <TouchableOpacity
            className="size-10 items-center justify-center rounded-full"
            accessibilityRole="button"
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="arrow-back-ios-new"
              size={24}
              color="#0f172a"
            />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">
            Business Information
          </Text>
          <TouchableOpacity
            className="size-10 items-center justify-center rounded-full"
            accessibilityRole="button"
            onPress={saveBusinessInfo}
          >
            <MaterialIcons name="check" size={24} color="#ee2b8c" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView
          className="flex-1 px-4 pt-4 pb-32"
          showsVerticalScrollIndicator={false}
        >
          {/* Form Fields */}
          <View className="gap-6">
            {/* Business Name */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-gray-900">
                Business Name
              </Text>
              <View className="relative">
                <TextInput
                  value={businessName}
                  onChangeText={setBusinessName}
                  placeholder="e.g., Dreamy Moments Photography"
                  className="w-full rounded-xl h-14 px-4 shadow-sm bg-white"
                  placeholderTextColor="#9ca3af"
                />
                <View className="absolute right-4 top-1/2 -translate-y-1/2">
                  <MaterialIcons name="storefront" size={20} color="#9ca3af" />
                </View>
              </View>
            </View>

            {/* Short Bio / Description */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-gray-900">
                About your services
              </Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Describe your style and what makes you unique for cultural weddings..."
                className="w-full rounded-xl p-4 min-h-[120px] shadow-sm bg-white"
                multiline
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* City / Location */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-gray-900">
                Base Location
              </Text>
              <View className="relative">
                <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <MaterialIcons name="location-on" size={20} color="#9ca3af" />
                </View>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City, State or Zip Code"
                  className="w-full rounded-xl h-14 pl-12 pr-4 shadow-sm bg-white"
                  placeholderTextColor="#9ca3af"
                />
                <View className="absolute right-4 top-1/2 -translate-y-1/2">
                  <MaterialIcons name="my-location" size={20} color="#cbd5e1" />
                </View>
              </View>
            </View>

            {/* Years of Experience */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-gray-900">
                Experience
              </Text>
              <TouchableOpacity
                className="w-full rounded-xl h-14 px-4 items-center justify-between flex-row shadow-sm bg-white"
                onPress={handleExperienceSelect}
              >
                <Text
                  className={experience ? "text-gray-900" : "text-gray-400"}
                >
                  {experience || "Select years of experience"}
                </Text>
                <MaterialIcons name="expand-more" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
