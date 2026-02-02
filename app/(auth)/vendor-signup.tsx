import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function VendorSignup() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white">
      <Pressable
        onPress={() => router.back()}
        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mt-12 ml-6 active:opacity-70"
      >
        <FontAwesome5 name="arrow-left" size={18} color="#1F2937" />
      </Pressable>

      <View className="items-center px-6 mt-16">
        <View className="w-20 h-20 rounded-full items-center justify-center mb-4 bg-rose-100">
          <FontAwesome5 name="store" size={32} color="#F43F5E" />
        </View>
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Create Vendor Account
        </Text>
        <Text className="text-base text-gray-600 text-center">
          Join us to grow your business
        </Text>

        <View className="mt-10">
          <Text className="text-gray-500">Coming soon...</Text>
        </View>
      </View>
    </ScrollView>
  );
}
