import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function UserSignup() {
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
        <View className="w-20 h-20 rounded-full items-center justify-center mb-4 bg-purple-100">
          <FontAwesome5 name="user-plus" size={32} color="#8B5CF6" />
        </View>
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Create User Account
        </Text>
        <Text className="text-base text-gray-600 text-center">
          Sign up to start exploring events
        </Text>

        <View className="mt-10">
          <Text className="text-gray-500">Coming soon...</Text>
        </View>
      </View>
    </ScrollView>
  );
}
