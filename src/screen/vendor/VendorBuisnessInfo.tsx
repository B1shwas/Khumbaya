import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Progress value (percent)
const PROGRESS = 40; // TODO: derive from onboarding state

export default function VendorBusinessInfoScreen() {
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        {/* Top App Bar */}
        <View className="sticky top-0 z-10 flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity
            className="size-10 items-center justify-center rounded-full"
            accessibilityRole="button"
          >
            <MaterialIcons name="arrow-back-ios-new" size={24} color="#0f172a" />
            {/* text-slate-900 = #0f172a; dark text is white */}
          </TouchableOpacity>
          <Text className="text-sm font-medium" style={{ color: "#6b7280" }}>
            {/* slate-500 = #6b7280; dark slate-400 = #9ca3af */}
            Step 2 of 5
          </Text>
        </View>
        {/* Progress Bar */}
        <View className="px-4 pb-2">
          <View className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "#e5e7eb" }}>
            {/* slate-200 = #e5e7eb; dark slate-700 = #374151 */}
            <View className="h-full rounded-full bg-primary" style={{ width: `${PROGRESS}%` }} />
            {/* primary = #ee2b8c */}
          </View>
        </View>

        {/* Main Content */}
        <ScrollView className="flex-1 px-4 pt-4 pb-32" showsVerticalScrollIndicator={false}>
          {/* Headline & Subheading */}
          <View className="mb-8">
            <Text className="text-[32px] font-bold leading-tight tracking-tight mb-2 text-white" style={{ color: "#0f172a" }}>
              Business Details
            </Text>
            <Text className="text-base font-normal leading-relaxed" style={{ color: "#64748b" }}>
              {/* slate-500 approx = #64748b (tailwind slate palette) */}
              Let's start with the basics so couples can easily find and book you for their special day.
            </Text>
          </View>

          {/* Form Fields */}
          <View className="gap-6">
            {/* Business Name */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-white" style={{ color: "#0f172a" }}>Business Name</Text>
              <View className="relative">
                <TextInput
                  value={businessName}
                  onChangeText={setBusinessName}
                  placeholder="e.g., Dreamy Moments Photography"
                  className="w-full rounded-xl h-14 px-4 shadow-sm"
                  // light bg white; dark bg slate-800 = #1f2937
                  style={{ backgroundColor: "#ffffff", color: "#0f172a", borderWidth: 1, borderColor: "#e5e7eb" }}
                  placeholderTextColor="#9ca3af" // dark: #9ca3af
                />
                <View className="absolute right-4 top-1/2 -translate-y-1/2">
                  <MaterialIcons name="storefront" size={20} color="#9ca3af" />
                </View>
              </View>
            </View>

            {/* Short Bio / Description */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-white" style={{ color: "#0f172a" }}>About your services</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Describe your style and what makes you unique for cultural weddings..."
                className="w-full rounded-xl p-4 min-h-[120px] shadow-sm"
                multiline
                // light bg white; dark bg slate-800 = #1f2937
                style={{ backgroundColor: "#ffffff", color: "#0f172a", borderWidth: 1, borderColor: "#e5e7eb" }}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* City / Location */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-white" style={{ color: "#0f172a" }}>Base Location</Text>
              <View className="relative">
                <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <MaterialIcons name="location-on" size={20} color="#9ca3af" />
                </View>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City, State or Zip Code"
                  className="w-full rounded-xl h-14 pl-12 pr-4 shadow-sm"
                  style={{ backgroundColor: "#ffffff", color: "#0f172a", borderWidth: 1, borderColor: "#e5e7eb" }}
                  placeholderTextColor="#9ca3af"
                />
                {/* Simulated autocomplete icon on the right */}
                <View className="absolute right-4 top-1/2 -translate-y-1/2">
                  <MaterialIcons name="my-location" size={20} color="#cbd5e1" />
                  {/* slate-300 = #cbd5e1; dark slate-600 = #475569 */}
                </View>
              </View>
            </View>

            {/* Years of Experience (static for now) */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-white" style={{ color: "#0f172a" }}>Experience</Text>
              <TouchableOpacity
                className="w-full rounded-xl h-14 px-4 items-center justify-between flex-row shadow-sm"
                style={{ backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#e5e7eb" }}
                onPress={() => {
                  // TODO: present options (ActionSheet / Picker) and setExperience
                }}
              >
                <Text className="text-white" style={{ color: experience ? "#0f172a" : "#9ca3af" }}>
                  {experience || "Select years of experience"}
                </Text>
                <MaterialIcons name="expand-more" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Bar (Sticky) */}
        <View
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ backgroundColor: "rgba(248, 246, 247, 0.8)", borderTopWidth: 1, borderTopColor: "rgba(229, 231, 235, 0.5)" }}
        >
          {/* background-light = #f8f6f7; border slate-200 ~ #e5e7eb */}
          <View className="max-w-md w-full self-center">
            <TouchableOpacity
              className="w-full h-14 bg-primary rounded-xl flex-row items-center justify-center gap-2"
              activeOpacity={0.9}
              onPress={() => {
                // TODO: Navigate to next step
              }}
            >
              <Text className="text-white font-bold text-lg">Next Step</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
