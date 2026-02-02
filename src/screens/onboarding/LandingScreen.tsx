import { FeaturePill, RoleCard } from "@/src/components/onboarding";
import { features, roles } from "@/src/constants/onboarding";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";

export default function LandingScreen() {
  const router = useRouter();

  // const handleRoleSelect = (role: RoleType) => {
  //   switch (role) {
  //     case "user":
  //       router.push(NAVIGATION_ROUTES.AUTH.USER_LOGIN);
  //       break;
  //     case "vendor":
  //       router.push(NAVIGATION_ROUTES.AUTH.VENDOR_LOGIN);
  //       break;
  //     case "guest":
  //       router.push(NAVIGATION_ROUTES.AUTH.GUEST_LOGIN);
  //       break;
  //   }
  // };

  // const handleSignup = () => {
  //   router.push(NAVIGATION_ROUTES.AUTH.USER_SIGNUP);
  // };

  // const handleVendorSignup = () => {
  //   router.push(NAVIGATION_ROUTES.AUTH.VENDOR_SIGNUP);
  // };

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
            // onPress={() => handleRoleSelect(role.title.toLowerCase())}
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

      {/* Sign Up Section */}
      <View className="px-5 mb-4">
        <View
          className="bg-white rounded-2xl p-6"
          style={{
            borderWidth: 1,
            borderColor: "#E5E7EB",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="text-center text-sm mb-4 text-gray-600">
            New to Khumya?
          </Text>
          <Pressable
            // onPress={handleSignup}
            className="bg-primary-500 rounded-xl py-4 active:opacity-90"
          >
            <Text className="text-white text-center font-bold text-base">
              Create Your Account
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Vendor CTA */}
      <View className="px-5 mb-10">
        <Pressable
          // onPress={handleVendorSignup}
          className="bg-accent-50 rounded-2xl p-5 border border-accent-200"
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <View className="flex-row items-center justify-center">
            <MaterialIcons name="business" size={20} color="#F43F5E" />
            <Text className="ml-2 text-sm text-gray-600">
              Are you a business?{" "}
              <Text className="font-bold text-accent-600">
                Become a Vendor →
              </Text>
            </Text>
          </View>
        </Pressable>
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
