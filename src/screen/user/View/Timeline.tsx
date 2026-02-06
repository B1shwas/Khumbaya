import { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { type RelativePathString } from "expo-router";

interface TimelineItem {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  icon: string;
  iconColor: string;
  isActive: boolean;
  isPast: boolean;
  hasAction?: boolean;
}

const timelineData: TimelineItem[] = [
  {
    id: "1",
    time: "10:00 AM",
    title: "Mehendi Ceremony",
    location: "The Rose Garden",
    description: "Traditional henna application with music and dance. Join us for light refreshments.",
    icon: "brush",
    iconColor: "#ee2b8c",
    isActive: true,
    isPast: false,
    hasAction: true,
  },
  {
    id: "2",
    time: "4:00 PM",
    title: "Wedding Vows",
    location: "Grand Ballroom A",
    description: "The main ceremony. Please be seated by 3:45 PM.",
    icon: "heart",
    iconColor: "#6B7280",
    isActive: false,
    isPast: false,
    hasAction: true,
  },
  {
    id: "3",
    time: "7:00 PM",
    title: "Reception Dinner",
    location: "Sunset Terrace",
    description: "Dinner, drinks, and dancing under the stars to celebrate the newlyweds.",
    icon: "wine-bar",
    iconColor: "#6B7280",
    isActive: false,
    isPast: false,
    hasAction: false,
  },
];

const TimelineItemComponent = ({ item, isLast }: { item: TimelineItem; isLast: boolean }) => {
  const getIconColor = () => {
    if (item.isActive) return "#ee2b8c";
    return item.isPast ? "#9CA3AF" : "#6B7280";
  };

  return (
    <View className="group relative flex gap-4 pb-8">
      {/* Line and Connector */}
      <View className="flex flex-col items-center pt-1.5">
        {item.isActive ? (
          <View className="relative flex items-center justify-center size-4">
            <View className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <View className="relative inline-flex size-4 rounded-full bg-primary" />
          </View>
        ) : (
          <View
            className={`size-3 rounded-full ring-4 ${item.isPast ? "bg-gray-300" : "bg-gray-300"}`}
            style={{ backgroundColor: getIconColor() }}
          />
        )}
        {!isLast && (
          <View
            className={`w-[2px] h-full mt-1 rounded-full ${item.isActive ? "bg-primary/30" : "bg-gray-200"}`}
          />
        )}
      </View>

      {/* Content Card */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-2">
          <Text
            className={`font-bold text-sm ${
              item.isActive ? "text-primary bg-primary/10 px-2 py-0.5 rounded-full" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {item.time}
          </Text>
          {item.hasAction && (
            <TouchableOpacity className="p-1 rounded-full active:bg-gray-100">
              <Ionicons name="create" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        <View className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <View className="flex-row items-start gap-3">
            <View
              className="shrink-0 size-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: item.isActive ? "#fceaf4" : "#f3f4f6" }}
            >
              <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 dark:text-white text-lg font-bold leading-snug">
                {item.title}
              </Text>
              <View className="flex-row items-center gap-1 text-gray-500 dark:text-gray-400 text-xs font-medium mt-1 mb-2">
                <Ionicons name="location" size={14} color="#6B7280" />
                <Text>{item.location}</Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {item.description}
              </Text>
            </View>
          </View>

          {/* Add to Calendar Button */}
          {item.hasAction && !item.isPast && (
            <TouchableOpacity
              className="w-full mt-3 py-2 px-4 rounded-lg border border-primary/30 flex-row items-center justify-center gap-2"
              onPress={() => router.push("/calendar" as RelativePathString)}
            >
              <Ionicons name="calendar" size={18} color="#ee2b8c" />
              <Text className="text-primary text-sm font-semibold">Add to Calendar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default function TimelinePage() {
  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Top App Bar */}
      <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#181114" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">
          Anita & Rahul's Wedding
        </Text>
        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
          <Ionicons name="calendar" size={24} color="#181114" />
        </TouchableOpacity>
      </View>

      {/* Date Header */}
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">
          Saturday, Oct 24th
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Day 2 of 3 • The Big Day
        </Text>
      </View>

      {/* Timeline Container */}
      <ScrollView
        className="flex-1 px-6 py-4 pb-24"
        showsVerticalScrollIndicator={false}
      >
        {timelineData.map((item, index) => (
          <TimelineItemComponent
            key={item.id}
            item={item}
            isLast={index === timelineData.length - 1}
          />
        ))}

        {/* End of Schedule */}
        <View className="group relative flex gap-4">
          <View className="flex flex-col items-center pt-1.5">
            <View className="size-2 rounded-full bg-gray-200 dark:bg-gray-700" />
          </View>
          <View className="flex-1 py-2">
            <Text className="text-xs text-gray-400 italic">End of schedule for today</Text>
          </View>
        </View>

        {/* Bottom spacer for FAB */}
        <View className="h-24" />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 z-30 w-14 h-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 active:opacity-90"
        onPress={() => router.push("/create-event" as RelativePathString)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
