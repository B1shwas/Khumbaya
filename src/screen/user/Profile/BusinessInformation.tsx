import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
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
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
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
        setWebsite(info.website || "");
        setPhone(info.phone || "");
        setEmail(info.email || "");
        setInstagram(info.instagram || "");
        setFacebook(info.facebook || "");
        setTwitter(info.twitter || "");
        setWhatsapp(info.whatsapp || "");
      }
    } catch (error) {
      console.error("Error loading business info:", error);
      Alert.alert("Error", "Failed to load business information");
    } finally {
      setIsLoading(false);
    }
  };

  const saveBusinessInfo = async () => {
    try {
      setIsLoading(true);

      // Validation
      if (!businessName.trim()) {
        Alert.alert("Error", "Business name is required");
        setIsLoading(false);
        return;
      }

      if (!bio.trim()) {
        Alert.alert("Error", "Business description is required");
        setIsLoading(false);
        return;
      }

      if (bio.trim().length < 50) {
        Alert.alert("Error", "Description should be at least 50 characters");
        setIsLoading(false);
        return;
      }

      if (!location.trim()) {
        Alert.alert("Error", "Location is required");
        setIsLoading(false);
        return;
      }

      if (!experience) {
        Alert.alert("Error", "Please select years of experience");
        setIsLoading(false);
        return;
      }

      if (!phone.trim()) {
        Alert.alert("Error", "Phone number is required");
        setIsLoading(false);
        return;
      }

      const info = {
        businessName,
        bio,
        location,
        experience,
        website,
        phone,
        email,
        instagram,
        facebook,
        twitter,
        whatsapp,
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.BUSINESS_INFO,
        JSON.stringify(info),
      );

      // TODO: Backend integration
      // await api.post('/api/business-info', info);

      Alert.alert("Success", "Business information saved successfully", [
        { text: "OK", onPress: () => router.push("/(protected)/(client-tabs)/business") },
      ]);
    } catch (error) {
      console.error("Error saving business info:", error);
      Alert.alert("Error", "Failed to save business information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExperienceSelect = () => {
    // TODO: Implement experience selection (ActionSheet / Picker)
    const experiences = ["1-3 years", "3-5 years", "5-10 years", "10+ years"];
    // For now, just set a default
    setExperience("5+ years");
  };

  const handleClearForm = () => {
    Alert.alert("Clear Form", "Are you sure you want to clear all fields?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          setBusinessName("");
          setBio("");
          setLocation("");
          setExperience("");
          setWebsite("");
          setPhone("");
          setEmail("");
          setInstagram("");
          setFacebook("");
          setTwitter("");
          setWhatsapp("");
        },
      },
    ]);
  };

  const handleResetToDefault = () => {
    Alert.alert(
      "Reset to Default",
      "Are you sure you want to reset to default business information?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            const defaultInfo = {
              businessName: "Dreamy Moments Photography",
              bio: "Professional wedding photography studio specializing in capturing authentic moments and creating timeless memories for cultural weddings. We combine traditional techniques with modern creativity to deliver stunning results.",
              location: "New York, NY",
              experience: "10+ years",
              website: "www.dreamymoments.com",
              phone: "+1 (555) 123-4567",
              email: "info@dreamymoments.com",
              instagram: "@dreamymomentsphoto",
              facebook: "facebook.com/dreamymoments",
              twitter: "@dreamymoments",
              whatsapp: "+1 (555) 123-4567",
            };

            setBusinessName(defaultInfo.businessName);
            setBio(defaultInfo.bio);
            setLocation(defaultInfo.location);
            setExperience(defaultInfo.experience);
            setWebsite(defaultInfo.website);
            setPhone(defaultInfo.phone);
            setEmail(defaultInfo.email);
            setInstagram(defaultInfo.instagram);
            setFacebook(defaultInfo.facebook);
            setTwitter(defaultInfo.twitter);
            setWhatsapp(defaultInfo.whatsapp);
          },
        },
      ],
    );
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
            disabled={isLoading}
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
            disabled={isLoading}
          >
            <MaterialIcons
              name={isLoading ? "hourglass-empty" : "check"}
              size={24}
              color={isLoading ? "#9ca3af" : "#ee2b8c"}
            />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        {isLoading && !businessName ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Loading...</Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4 pt-4 pb-32"
            showsVerticalScrollIndicator={false}
          >
            {/* Business Logo Placeholder */}
            <View className="items-center mb-8">
              <View className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 items-center justify-center shadow-lg">
                <MaterialIcons name="business" size={48} color="white" />
              </View>
              <Text className="mt-2 text-sm text-gray-500">Business Logo</Text>
              <TouchableOpacity className="mt-1">
                <Text className="text-pink-500 text-sm font-semibold">
                  Change
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View className="gap-6">
              {/* Business Name */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-gray-900">
                  Business Name *
                </Text>
                <View className="relative">
                  <TextInput
                    value={businessName}
                    onChangeText={setBusinessName}
                    placeholder="e.g., Dreamy Moments Photography"
                    className="w-full rounded-xl h-14 px-4 shadow-sm bg-white"
                    placeholderTextColor="#9ca3af"
                    editable={!isLoading}
                  />
                  <View className="absolute right-4 top-1/2 -translate-y-1/2">
                    <MaterialIcons
                      name="storefront"
                      size={20}
                      color="#9ca3af"
                    />
                  </View>
                </View>
              </View>

              {/* Short Bio / Description */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-gray-900">
                  About your services *
                </Text>
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Describe your style and what makes you unique for cultural weddings..."
                  className="w-full rounded-xl p-4 min-h-[120px] shadow-sm bg-white"
                  multiline
                  placeholderTextColor="#9ca3af"
                  editable={!isLoading}
                />
                <Text className="text-xs text-gray-500 text-right">
                  {bio.length} characters
                </Text>
              </View>

              {/* Contact Information Section */}
              <View className="bg-pink-50 rounded-xl p-4">
                <Text className="text-lg font-semibold text-pink-900 mb-4">
                  Contact Information
                </Text>

                {/* Phone */}
                <View className="gap-2 mb-4">
                  <Text className="text-sm font-semibold text-gray-900">
                    Phone Number *
                  </Text>
                  <View className="relative">
                    <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <MaterialIcons name="phone" size={20} color="#9ca3af" />
                    </View>
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="+1 (555) 123-4567"
                      className="w-full rounded-xl h-14 pl-12 pr-4 shadow-sm bg-white"
                      placeholderTextColor="#9ca3af"
                      keyboardType="phone-pad"
                      editable={!isLoading}
                    />
                  </View>
                </View>

                {/* Email */}
                <View className="gap-2 mb-4">
                  <Text className="text-sm font-semibold text-gray-900">
                    Email Address
                  </Text>
                  <View className="relative">
                    <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <MaterialIcons name="email" size={20} color="#9ca3af" />
                    </View>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="info@yourbusiness.com"
                      className="w-full rounded-xl h-14 pl-12 pr-4 shadow-sm bg-white"
                      placeholderTextColor="#9ca3af"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                  </View>
                </View>

                {/* Website */}
                <View className="gap-2 mb-4">
                  <Text className="text-sm font-semibold text-gray-900">
                    Website
                  </Text>
                  <View className="relative">
                    <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <MaterialIcons name="link" size={20} color="#9ca3af" />
                    </View>
                    <TextInput
                      value={website}
                      onChangeText={setWebsite}
                      placeholder="www.yourbusiness.com"
                      className="w-full rounded-xl h-14 pl-12 pr-4 shadow-sm bg-white"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                  </View>
                </View>

                {/* Location */}
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-gray-900">
                    Base Location *
                  </Text>
                  <View className="relative">
                    <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <MaterialIcons
                        name="location-on"
                        size={20}
                        color="#9ca3af"
                      />
                    </View>
                    <TextInput
                      value={location}
                      onChangeText={setLocation}
                      placeholder="City, State or Zip Code"
                      className="w-full rounded-xl h-14 pl-12 pr-4 shadow-sm bg-white"
                      placeholderTextColor="#9ca3af"
                      editable={!isLoading}
                    />
                    <View className="absolute right-4 top-1/2 -translate-y-1/2">
                      <MaterialIcons
                        name="my-location"
                        size={20}
                        color="#cbd5e1"
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Experience */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-gray-900">
                  Experience *
                </Text>
                <TouchableOpacity
                  className="w-full rounded-xl h-14 px-4 items-center justify-between flex-row shadow-sm bg-white"
                  onPress={handleExperienceSelect}
                  disabled={isLoading}
                >
                  <Text
                    className={experience ? "text-gray-900" : "text-gray-400"}
                  >
                    {experience || "Select years of experience"}
                  </Text>
                  <MaterialIcons name="expand-more" size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {/* Social Media Section */}
              <View className="bg-blue-50 rounded-xl p-4">
                <Text className="text-lg font-semibold text-blue-900 mb-4">
                  Social Media
                </Text>

                {/* Instagram */}
                <View className="gap-2 mb-3">
                  <Text className="text-sm font-semibold text-gray-900">
                    Instagram
                  </Text>
                  <View className="relative">
                    <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <MaterialIcons
                        name="photo-camera"
                        size={20}
                        color="#9ca3af"
                      />
                    </View>
                    <TextInput
                      value={instagram}
                      onChangeText={setInstagram}
                      placeholder="@yourbusiness"
                      className="w-full rounded-xl h-14 pl-12 pr-4 shadow-sm bg-white"
                      placeholderTextColor="#9ca3af"
                      editable={!isLoading}
                    />
                  </View>
                </View>

                {/* Facebook */}
                <View className="gap-2 mb-3">
                  <Text className="text-sm font-semibold text-gray-900">
                    Facebook
                  </Text>
                  <View className="relative">
                    <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <MaterialIcons
                        name="facebook"
                        size={20}
                        color="#9ca3af"
                      />
                    </View>
                    <TextInput
                      value={facebook}
                      onChangeText={setFacebook}
                      placeholder="facebook.com/yourbusiness"
                      className="w-full rounded-xl h-14 pl-12 pr-4 shadow-sm bg-white"
                      placeholderTextColor="#9ca3af"
                      editable={!isLoading}
                    />
                  </View>
                </View>

                {/* Twitter */}
                <View className="gap-2 mb-3">
                  <Text className="text-sm font-semibold text-gray-900">
                    Twitter
                  </Text>
                  <View className="relative">
                    <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <MaterialIcons
                        name="chat-bubble"
                        size={20}
                        color="#9ca3af"
                      />
                    </View>
                    <TextInput
                      value={twitter}
                      onChangeText={setTwitter}
                      placeholder="@yourbusiness"
                      className="w-full rounded-xl h-14 pl-12 pr-4 shadow-sm bg-white"
                      placeholderTextColor="#9ca3af"
                      editable={!isLoading}
                    />
                  </View>
                </View>

                {/* WhatsApp */}
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-gray-900">
                    WhatsApp
                  </Text>
                  <View className="relative">
                    <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <MaterialIcons name="chat" size={20} color="#9ca3af" />
                    </View>
                    <TextInput
                      value={whatsapp}
                      onChangeText={setWhatsapp}
                      placeholder="+1 (555) 123-4567"
                      className="w-full rounded-xl h-14 pl-12 pr-4 shadow-sm bg-white"
                      placeholderTextColor="#9ca3af"
                      keyboardType="phone-pad"
                      editable={!isLoading}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="gap-3 mt-8">
              <TouchableOpacity
                className="w-full rounded-xl py-4 bg-pink-500 items-center justify-center shadow-md"
                onPress={saveBusinessInfo}
                disabled={isLoading}
              >
                <Text className="text-white font-semibold text-lg">
                  {isLoading ? "Saving..." : "Save Business Information"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-full rounded-xl py-4 bg-gray-200 items-center justify-center"
                onPress={handleClearForm}
                disabled={isLoading}
              >
                <Text className="text-gray-700 font-semibold text-lg">
                  Clear Form
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-full rounded-xl py-4 bg-gray-100 items-center justify-center"
                onPress={handleResetToDefault}
                disabled={isLoading}
              >
                <Text className="text-gray-600 font-semibold text-lg">
                  Reset to Default
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
