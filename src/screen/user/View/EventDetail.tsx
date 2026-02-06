import { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { type RelativePathString } from "expo-router";

const EventDetail = () => {
  const event = {
    id: "1",
    title: "Sarah & Mike's Wedding",
    date: "August 24, 2024",
    location: "San Francisco, CA",
    venue: "Grand Plaza Hotel",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeW7ylSiob80ww9XoAOOV3fReuakm7CdifvgqSXNruTM_9zAafkSATg54Dmx3H7FAZ5KXTRd39NLDkX59Y3q3sxo1tkE7A7izp0iVgffzw7wQD1ZGNTwh0GVaKomwXQ9aAgwXmkYiHuyLVXHjwPa43pqfUwcXAnj00ohS22F1JIFaI0gqlP4ljcXEqU0-A1ZjuQLfYmk0FeUhi3kPIuFPTGwNPv_HTUqTqGaOGf9I_Hr5lb4N45xrwpUyAvH3ZVxD2I2QRXr3HmhQ",
    status: "Upcoming",
    days: 124,
    hours: 8,
    minutes: 45,
    guests: { confirmed: 150, total: 200 },
    budget: { spent: 12000, total: 30000 },
    tasks: { pending: 12 },
    vendors: { booked: 6, pending: 2 },
    nextTask: "Cake Tasting @ 2 PM",
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="relative w-full h-[38vh] min-h-[300px]">
          <Image
            source={{ uri: event.imageUrl }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
          
          {/* Top Navigation */}
          <View className="absolute top-0 left-0 w-full p-4 pt-12 flex-row justify-between items-center z-10">
            <TouchableOpacity
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View className="flex-row gap-3">
              <TouchableOpacity className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                <Ionicons name="notifications" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                <Ionicons name="ellipsis-vertical" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Content */}
          <View className="absolute bottom-16 left-0 w-full px-6 z-10">
            <View className="flex-col gap-1">
              <Text className="px-2 py-1 bg-primary/90 text-white text-xs font-bold rounded w-fit mb-2 backdrop-blur-md">
                {event.status}
              </Text>
              <Text className="text-3xl font-extrabold text-white leading-tight tracking-tight">
                {event.title}
              </Text>
              <View className="flex-row items-center gap-2 text-white/90 mt-1">
                <Ionicons name="calendar" size={18} color="white" />
                <Text className="text-sm font-medium">{event.date}</Text>
                <Text className="mx-1 opacity-50">•</Text>
                <Ionicons name="location" size={18} color="white" />
                <Text className="text-sm font-medium">{event.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Countdown Timer */}
        <View className="px-4 -mt-10 z-20">
          <View className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl p-5 flex-row justify-between items-center border border-gray-100 dark:border-gray-800">
            <View className="flex-col items-center flex-1">
              <Text className="text-2xl font-black text-primary">{event.days}</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Days</Text>
            </View>
            <View className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700" />
            <View className="flex-col items-center flex-1">
              <Text className="text-2xl font-black text-primary">{String(event.hours).padStart(2, '0')}</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Hrs</Text>
            </View>
            <View className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700" />
            <View className="flex-col items-center flex-1">
              <Text className="text-2xl font-black text-primary">{String(event.minutes).padStart(2, '0')}</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Mins</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Row */}
        <View className="mt-6 px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold dark:text-white">Quick Stats</Text>
            <TouchableOpacity>
              <Text className="text-sm font-semibold text-primary">View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {/* Guests Card */}
            <View className="min-w-[160px] flex-1 bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-50 dark:border-gray-800 flex-col items-center justify-center gap-2">
              <View className="relative w-16 h-16">
                <View className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-gray-700" />
                <View 
                  className="absolute inset-0 rounded-full border-4 border-primary" 
                  style={{ borderBottomColor: 'transparent', borderRightColor: 'transparent', transform: [{ rotate: '270deg' }] }} 
                />
                <View className="absolute inset-0 flex items-center justify-center">
                  <Text className="text-xs font-bold text-gray-700 dark:text-white">75%</Text>
                </View>
              </View>
              <View className="text-center">
                <Text className="text-sm font-bold text-gray-900 dark:text-white">Guests</Text>
                <Text className="text-xs text-gray-500">150/200 Yes</Text>
              </View>
            </View>

            {/* Budget Card */}
            <View className="min-w-[160px] flex-1 bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-50 dark:border-gray-800 flex-col justify-between">
              <View>
                <View className="p-1.5 bg-green-100 text-green-600 rounded-lg w-fit dark:bg-green-900/30 dark:text-green-400">
                  <Ionicons name="pricetag" size={20} color="#16A34A" />
                </View>
                <Text className="text-sm font-bold mt-2 text-gray-900 dark:text-white">Budget</Text>
                <Text className="text-xs text-gray-500">$12k / $30k</Text>
              </View>
              <View className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                <View className="bg-primary h-1.5 rounded-full" style={{ width: '40%' }} />
              </View>
            </View>

            {/* Tasks Card */}
            <View className="min-w-[160px] flex-1 bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-50 dark:border-gray-800 flex-col justify-between">
              <View>
                <View className="p-1.5 bg-orange-100 text-orange-600 rounded-lg w-fit dark:bg-orange-900/30 dark:text-orange-400">
                  <Ionicons name="checkmark-circle" size={20} color="#EA580C" />
                </View>
                <Text className="text-sm font-bold mt-2 text-gray-900 dark:text-white">Tasks</Text>
                <Text className="text-xs text-gray-500">12 Pending</Text>
              </View>
              <View className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                <View className="bg-orange-500 h-1.5 rounded-full" style={{ width: '65%' }} />
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Main Navigation Grid */}
        <View className="mt-6 px-4 pb-4">
          <Text className="text-lg font-bold mb-3 dark:text-white">Manage Event</Text>
          <View className="flex-row flex-wrap gap-3">
            {/* Timeline */}
            <TouchableOpacity 
              className="w-[calc(50%-6px)] bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
              onPress={() => router.push("/events/timeline" as RelativePathString)}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="p-2.5 bg-purple-50 rounded-full">
                  <Ionicons name="calendar" size={20} color="#9333EA" />
                </View>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </View>
              <Text className="font-bold text-gray-900 text-base">Timeline</Text>
              <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>Next: Cake Tasting @ 2 PM</Text>
            </TouchableOpacity>

            {/* Guest List */}
            <TouchableOpacity 
              className="w-[calc(50%-6px)] bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
              onPress={() => router.push("/events/guests" as RelativePathString)}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="p-2.5 bg-blue-50 rounded-full">
                  <Ionicons name="people" size={20} color="#2563EB" />
                </View>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </View>
              <Text className="font-bold text-gray-900 text-base">Guest List</Text>
              <Text className="text-xs text-gray-500 mt-1">Manage RSVPs</Text>
            </TouchableOpacity>

            {/* Vendors */}
            <TouchableOpacity 
              className="w-[calc(50%-6px)] bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
              onPress={() => router.push("/events/vendors" as RelativePathString)}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="p-2.5 bg-rose-50 rounded-full">
                  <Ionicons name="storefront" size={20} color="#E11D48" />
                </View>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </View>
              <Text className="font-bold text-gray-900 text-base">Vendors</Text>
              <Text className="text-xs text-gray-500 mt-1">6 Booked, 2 Pending</Text>
            </TouchableOpacity>

            {/* Budget */}
            <TouchableOpacity 
              className="w-[calc(50%-6px)] bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
              onPress={() => router.push("/events/budget" as RelativePathString)}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="p-2.5 bg-emerald-50 rounded-full">
                  <Ionicons name="wallet" size={20} color="#059669" />
                </View>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </View>
              <Text className="font-bold text-gray-900 text-base">Budget</Text>
              <Text className="text-xs text-gray-500 mt-1">$18k Remaining</Text>
            </TouchableOpacity>

            {/* Gallery - Full Width */}
            <TouchableOpacity 
              className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform flex-row items-center gap-4"
              onPress={() => router.push("/events/gallery" as RelativePathString)}
            >
              <View className="p-2.5 bg-primary/10 rounded-full shrink-0">
                <Ionicons name="images" size={20} color="#ee2b8c" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-900 text-base">Gallery</Text>
                <Text className="text-xs text-gray-500">Upload & Share Photos</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

     

        {/* Bottom spacer */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventDetail;
