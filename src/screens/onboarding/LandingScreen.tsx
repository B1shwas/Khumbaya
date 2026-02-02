import { FeaturePill, RoleCard } from "@/src/components/onboarding";
import { features, roles } from "@/src/constants/onboarding";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";

export default function LandingScreen() {
  const router = useRouter();

  const handleRoleSelect = (roleTitle: string) => {
    const role = roleTitle.toLowerCase();
    if (role === "user" || role === "vendor") {
      // Both user and vendor go to the same login page
      router.push("/(auth)/login" as any);
    } else if (role === "guest") {
      // Navigate directly to home for guest exploration
      router.replace("/" as any);
    }
  };

  const handleExplore = () => {
    // Allow users to explore without signing up
    router.replace("/" as any);
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View className="items-center pt-16 pb-8">
        {/* Logo */}
        <View
          className="w-20 h-20 rounded-3xl items-center justify-center mb-4 bg-primary-500"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <FontAwesome5 name="calendar-alt" size={36} color="white" />
        </View>

        {/* App Name */}
        <Text className="text-4xl font-bold tracking-tight mb-1 text-gray-900">
          Khumya
        </Text>

        {/* Accent Line */}
        <View className="w-16 h-1 rounded-full mt-2 bg-primary-500" />
      </View>

      {/* Hero Section */}
      <View className="px-6 mb-10">
        <Text className="text-3xl font-bold text-center mb-3 leading-tight text-gray-900">
          Events, Redefined.
        </Text>
        <Text className="text-base text-center leading-relaxed px-4 text-gray-600">
          The ultimate platform for seamless event planning and vendor
          discovery.
        </Text>
      </View>

      {/* Role Selection Cards */}
      <View className="px-5 mb-8">
        <View className="mb-6">
          <Text className="text-xl font-bold mb-1 text-gray-900">
            Choose Your Experience
          </Text>
          <Text className="text-sm text-gray-500">
            Select how you want to use Khumya
          </Text>
        </View>

        {roles.map((role, index) => (
          <RoleCard
            key={index}
            icon={role.icon}
            title={role.title}
            subtitle={role.subtitle}
            bgColor={role.bgColor}
            iconBg={role.iconBg}
            onPress={() => handleRoleSelect(role.title)}
          />
        ))}
      </View>

      {/* Quick Features */}
      <View className="px-5 mb-8">
        <View className="flex-row">
          {features.map((feature, index) => (
            <FeaturePill
              key={index}
              icon={feature.icon}
              text={feature.text}
              color={feature.color}
            />
          ))}
        </View>
      </View>

      {/* Explore as Guest */}
      <View className="px-5 mb-4">
        <Pressable
          onPress={handleExplore}
          className="bg-teal-50 rounded-2xl p-6 border border-teal-200 active:opacity-80"
        >
          <View className="flex-row items-center justify-center mb-2">
            <FontAwesome5 name="eye" size={20} color="#14B8A6" />
            <Text className="ml-2 text-lg font-bold text-gray-900">
              Explore Without Login
            </Text>
          </View>
          <Text className="text-center text-sm text-gray-600">
            Browse events and vendors as a guest
          </Text>
        </Pressable>
      </View>

      {/* Sign In Reminder */}
      <View className="px-5 mb-10">
        <View className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
          <Text className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Text
              className="font-bold text-purple-600"
              onPress={() => router.push("/(auth)/login" as any)}
            >
              Sign In →
            </Text>
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View className="px-8 pb-4">
        <Text className="text-center text-xs leading-5 text-gray-500">
          By continuing, you agree to our{" "}
          <Text
            className="text-primary-600"
            onPress={() => Linking.openURL("#")}
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            className="text-primary-600"
            onPress={() => Linking.openURL("#")}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
