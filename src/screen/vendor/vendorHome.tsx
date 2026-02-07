import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { type RelativePathString } from "expo-router";

export default function VendorHomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-surface-light border-b border-gray-100">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="relative">
            <View className="w-10 h-10 rounded-full bg-cover bg-center ring-2 ring-primary/20" style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDtl7IUwAI91iyDWykWrOtd9l0BBUbhhMy29F6orSVgFuBdztzvl6KZq4BMRao1fMnQcGC5DPVr9MfFyU-ObuXudfCML10ixySRdQ3xhQs8PwI18-aF53_ZEODz231aqzmJRtiY-ol3-hNzGpyiYIYPYaVQF1Mfl6Hv33vDFwbA4itR7rb7VbcXy_BOO5hh5NndyAtkJRHkjO6PP7CU2VNbKVqio9kVLTagelGQOsG_dNUHUEM2ks9eYdK6asH8ac23CUoDrfocMrs")'
            }} />
            <View className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-surface-light" />
          </View>
          <View className="flex-col">
            <Text className="text-xs font-medium text-secondary-content">Good Morning,</Text>
            <Text className="text-lg font-bold text-gray-900">Vendor Dashboard 👋</Text>
          </View>
        </View>
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100"
          onPress={() => router.push("/notifications" as RelativePathString)}
        >
          <Ionicons name="notifications" size={24} color="#181114" />
          <View className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View className="px-4 py-4 gap-3">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mb-2">
                <Ionicons name="calendar" size={20} color="#ee2b8c" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">12</Text>
              <Text className="text-xs text-gray-500">Upcoming Events</Text>
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">8</Text>
              <Text className="text-xs text-gray-500">Confirmed</Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <View className="w-10 h-10 rounded-full bg-yellow-100 items-center justify-center mb-2">
                <Ionicons name="time" size={20} color="#eab308" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">3</Text>
              <Text className="text-xs text-gray-500">Pending</Text>
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mb-2">
                <Ionicons name="star" size={20} color="#3b82f6" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">4.8</Text>
              <Text className="text-xs text-gray-500">Avg Rating</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Events Section */}
        <View className="py-4">
          <View className="flex-row items-center justify-between px-4 pb-3">
            <Text className="text-lg font-bold text-gray-900">Upcoming Events</Text>
            <TouchableOpacity onPress={() => router.push("/events")}>
              <Text className="text-primary text-sm font-semibold">See All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="px-4 gap-3">
            {/* Event Card 1 */}
            <View className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <View className="h-32 relative">
                <Image
                  source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlIo5Riz1lkFJ_RuteTIAm2y3rd8oBoiVd--YgiDKI9SWNtoi02gv4vVl6fF4ejDrBnqe5q72BQ6qsui1DP8huSDdLBTOvwigwdmaucm_GrOMrgc4yjcmy8CsD_Az3WzzyNPaGpOZrYyGNSAxa2sH-m8BdLINT7oSjw_l1pkV0bByvZ71qrWJ7qoCgghqUkxlmX0xolbydQwkG0DZ8NqGNtsgIhVT7GnsgccuFXXYoZaXORufx25ptCi9XnUyFfJTKHtk7fddTY8s" }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute top-3 right-3 bg-primary px-2 py-1 rounded">
                  <Text className="text-xs font-bold text-white">Confirmed</Text>
                </View>
              </View>
              <View className="p-4">
                <Text className="font-bold text-base text-gray-900 mb-1">Rahul & Simran's Wedding</Text>
                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="calendar" size={14} color="#896175" />
                    <Text className="text-xs text-secondary-content">Dec 15, 2024</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="location" size={14} color="#896175" />
                    <Text className="text-xs text-secondary-content">Mumbai, India</Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="mt-3 h-9 rounded-lg items-center justify-center bg-primary"
                  onPress={() => router.push("/event-details" as RelativePathString)}
                >
                  <Text className="text-white text-sm font-semibold">View Details</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Event Card 2 */}
            <View className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <View className="h-32 relative">
                <Image
                  source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSiNZxjryxVvBt_Qvd2BsU8jmuyGXsbWyZqiGyTJOFCn4I4QdwE-xrJUmE938nQ2sYjA0qbPec911z6qe-blSH_epWVfQJy2W2NwU5R-4dwi1k7uUfEgPutKfIV3RpR1EUutrAFt_7SBxXq5yRfR9EkuQCohSjZJpWgX0eNFvBY3F5rZ-xWmmB8Em-xGg1AvxCRQDlpUPXbLlpkcqBsqbQXGIi5tNUNw3p5WrCahAWFPRTkzEE0B8v47AYzYa8b-aEAMvtdko47AM" }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute top-3 right-3 bg-yellow-100 px-2 py-1 rounded">
                  <Text className="text-xs font-bold text-yellow-700">Pending</Text>
                </View>
              </View>
              <View className="p-4">
                <Text className="font-bold text-base text-gray-900 mb-1">Annual Corporate Gala</Text>
                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="calendar" size={14} color="#896175" />
                    <Text className="text-xs text-secondary-content">Jan 20, 2025</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="location" size={14} color="#896175" />
                    <Text className="text-xs text-secondary-content">New York, USA</Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="mt-3 h-9 rounded-lg items-center justify-center border border-primary"
                  onPress={() => router.push("/event-details" as RelativePathString)}
                >
                  <Text className="text-primary text-sm font-semibold">Respond</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 py-4 pb-8">
          <Text className="text-lg font-bold text-gray-900 mb-3">Quick Actions</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 h-20 bg-primary rounded-xl items-center justify-center gap-2"
              onPress={() => router.push("/(protected)/(vendor-tabs)/form/vendorform")}
            >
              <Ionicons name="create" size={24} color="white" />
              <Text className="text-white text-xs font-semibold">Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 h-20 bg-white rounded-xl items-center justify-center gap-2 border border-gray-100"
              onPress={() => router.push("/calendar")}
            >
              <Ionicons name="calendar-outline" size={24} color="#ee2b8c" />
              <Text className="text-gray-700 text-xs font-semibold">View Calendar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
