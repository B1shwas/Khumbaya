import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type EventCategory = {
  id: string;
  title: string;
  icon: string;
  gradient: string;
  iconColor: string;
  page: string;
};

const eventCategories: EventCategory[] = [
  {
    id: "wedding",
    title: "Wedding",
    icon: "heart",
    gradient: "from-pink-100 to-pink-200",
    iconColor: "#ec4899",
    page: "/(event)/event-type/wedding",
  },
  {
    id: "corporate",
    title: "Corporate",
    icon: "briefcase",
    gradient: "from-indigo-100 to-indigo-200",
    iconColor: "#6366f1",
    page: "/(event)/event-type/corporate",
  },
  {
    id: "birthday",
    title: "Birthday",
    icon: "cake",
    gradient: "from-amber-100 to-amber-200",
    iconColor: "#f59e0b",
    page: "/(event)/event-type/birthday",
  },
  {
    id: "workshop",
    title: "Workshop",
    icon: "school",
    gradient: "from-emerald-100 to-emerald-200",
    iconColor: "#10b981",
    page: "/(event)/event-type/workshop",
  },
  {
    id: "music",
    title: "Music",
    icon: "musical-notes",
    gradient: "from-purple-100 to-purple-200",
    iconColor: "#8b5cf6",
    page: "/(event)/event-type/music",
  },
  {
    id: "other",
    title: "Other",
    icon: "ellipsis-horizontal",
    gradient: "from-gray-100 to-gray-200",
    iconColor: "#6b7280",
    page: "/Eventcrud/create-event-form",
  },
];

export default function SelectEventType() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      const category = eventCategories.find((c) => c.id === selectedCategory);
      if (category) {
        router.push(category.page as any);
      }
    }
  };

  const isSelected = (id: string) => selectedCategory === id;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-bold text-gray-900">
            New Event
          </Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Text className="text-primary font-semibold">Help</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-4">
            {/* Page Indicator */}
            <View className="flex-row items-center justify-center gap-2 py-4">
              <View className="h-1.5 w-8 rounded-full bg-primary" />
              <View className="h-1.5 w-2 rounded-full bg-primary/20" />
              <View className="h-1.5 w-2 rounded-full bg-primary/20" />
              <View className="h-1.5 w-2 rounded-full bg-primary/20" />
            </View>

            {/* Headline */}
            <Text className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
              Choose Event Type
            </Text>
            <Text className="text-gray-500 text-base text-center mb-6">
              Select a category to customize your experience
            </Text>

            {/* Category Grid */}
            <View className="flex-row flex-wrap gap-3">
              {eventCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`w-[47%] rounded-xl p-4 border-2 ${
                    isSelected(category.id)
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-white"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isSelected(category.id) ? 0.1 : 0.05,
                    shadowRadius: 4,
                  }}
                  onPress={() => handleCategoryPress(category.id)}
                  activeOpacity={0.8}
                >
                  <View
                    className={`h-16 w-16 rounded-full items-center justify-center mb-3 bg-gradient-to-br ${category.gradient}`}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={28}
                      color={category.iconColor}
                    />
                  </View>
                  <Text className="font-bold text-center text-gray-900">
                    {category.title}
                  </Text>
                  {isSelected(category.id) && (
                    <View className="absolute top-2 right-2">
                      <Ionicons name="checkmark-circle" size={20} color="#3713ec" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <TouchableOpacity
            className={`py-4 rounded-xl shadow-lg ${
              selectedCategory ? "bg-primary" : "bg-gray-300"
            }`}
            style={
              selectedCategory
                ? { shadowColor: "#3713ec", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 }
                : {}
            }
            onPress={handleContinue}
            disabled={!selectedCategory}
            activeOpacity={0.8}
          >
            <Text
              className={`text-center text-lg font-bold ${
                selectedCategory ? "text-white" : "text-gray-500"
              }`}
            >
              Continue
            </Text>
          </TouchableOpacity>
          <Text className="text-center text-xs mt-3 text-gray-400">
            Step 1 of 4: Categories
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
