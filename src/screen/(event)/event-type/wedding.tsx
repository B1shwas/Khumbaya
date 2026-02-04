import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const weddingTypes = [
  {
    category: "Traditional / Cultural",
    types: [
      { icon: "flower", label: "Hindu Wedding", iconColor: "#ec4899" },
      { icon: "heart", label: "Buddhist Wedding", iconColor: "#10b981" },
      { icon: "home", label: "Christian Wedding", iconColor: "#6366f1" },
      { icon: "location", label: "Muslim Wedding", iconColor: "#8b5cf6" },
      { icon: "people", label: "Cultural / Ethnic", iconColor: "#f59e0b" },
    ],
  },
  {
    category: "Civil / Legal",
    types: [
      { icon: "gavel", label: "Court Marriage", iconColor: "#374151" },
      { icon: "folder", label: "Registry Office", iconColor: "#6b7280" },
      { icon: "checkmark-shield", label: "Government Registered", iconColor: "#10b981" },
    ],
  },
  {
    category: "Religious",
    types: [
      { icon: "add", label: "Church Wedding", iconColor: "#6366f1" },
      { icon: "home", label: "Temple Wedding", iconColor: "#f59e0b" },
      { icon: "hand", label: "Nikah Ceremony", iconColor: "#8b5cf6" },
    ],
  },
  {
    category: "Modern / Contemporary",
    types: [
      { icon: "airplane", label: "Destination", iconColor: "#3b82f6" },
      { icon: "color-palette", label: "Theme Wedding", iconColor: "#ec4899" },
      { icon: "water", label: "Beach Wedding", iconColor: "#06b6d4" },
      { icon: "leaf", label: "Garden Wedding", iconColor: "#10b981" },
    ],
  },
  {
    category: "Small-Scale",
    types: [
      { icon: "home", label: "Private Wedding", iconColor: "#6b7280" },
      { icon: "people", label: "Family-Only", iconColor: "#6366f1" },
      { icon: "heart-dislike", label: "Elopement", iconColor: "#ec4899" },
    ],
  },
  {
    category: "Large / Grand",
    types: [
      { icon: "business", label: "Royal-Style", iconColor: "#f59e0b" },
      { icon: "star", label: "Celebrity-Style", iconColor: "#8b5cf6" },
      { icon: "calendar", label: "Multi-Day", iconColor: "#3b82f6" },
    ],
  },
  {
    category: "Special-Case",
    types: [
      { icon: "refresh-circle", label: "Second Marriage", iconColor: "#6366f1" },
      { icon: "link", label: "Inter-Caste", iconColor: "#10b981" },
      { icon: "people", label: "Inter-Religion", iconColor: "#ec4899" },
      { icon: "people", label: "Mass Wedding", iconColor: "#f59e0b" },
    ],
  },
];

export default function WeddingEvent() {
  const [selectedType, setSelectedType] = useState<{ label: string; icon: string; iconColor: string } | null>(null);

  const handleTypePress = (type: { label: string; icon: string; iconColor: string }) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      router.push({
        pathname: "/Eventcrud/create-event-datetime",
        params: {
          category: 'wedding',
          eventType: selectedType.label,
          eventTypeIcon: selectedType.icon,
          eventTypeIconColor: selectedType.iconColor,
        },
      } as any);
    }
  };

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
            Wedding
          </Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Text className="text-primary font-semibold">Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-4">
            {/* Page Indicator */}
            <View className="flex-row items-center justify-center gap-2 py-4">
              <View className="h-1.5 w-8 rounded-full bg-primary/30" />
              <View className="h-1.5 w-8 rounded-full bg-primary" />
              <View className="h-1.5 w-2 rounded-full bg-primary/20" />
              <View className="h-1.5 w-2 rounded-full bg-primary/20" />
            </View>

            {/* Headline */}
            <Text className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
              What type of wedding?
            </Text>
            <Text className="text-gray-500 text-base text-center mb-6">
              Select the wedding style for your special day
            </Text>

            {/* Wedding Types by Category */}
            {weddingTypes.map((category, catIndex) => (
              <View key={catIndex} className="mb-6">
                <Text className="text-sm font-semibold text-gray-500 mb-3">
                  {category.category}
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {category.types.map((type, typeIndex) => (
                    <TouchableOpacity
                      key={typeIndex}
                      className={`w-[47%] rounded-xl p-3 bg-white border-2 ${
                        selectedType?.label === type.label
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-100'
                      }`}
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                      }}
                      onPress={() => handleTypePress(type)}
                      activeOpacity={0.8}
                    >
                      <View className="flex-row items-center">
                        <View
                          className="h-10 w-10 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: `${type.iconColor}20` }}
                        >
                          <Ionicons name={type.icon as any} size={20} color={type.iconColor} />
                        </View>
                        <Text className="font-medium text-gray-800 flex-1" numberOfLines={2}>
                          {type.label}
                        </Text>
                        {selectedType?.label === type.label && (
                          <Ionicons name="checkmark-circle" size={20} color="#3713ec" />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <TouchableOpacity
            className={`py-4 rounded-xl shadow-lg ${
              selectedType ? 'bg-primary' : 'bg-gray-300'
            }`}
            style={{
              shadowColor: selectedType ? '#3713ec' : '#9ca3af',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}
            onPress={handleContinue}
            disabled={!selectedType}
            activeOpacity={0.8}
          >
            <Text className={`text-center text-lg font-bold ${
              selectedType ? 'text-white' : 'text-gray-500'
            }`}>
              Continue
            </Text>
          </TouchableOpacity>
          <Text className="text-center text-xs mt-3 text-gray-400">
            Step 2 of 4: Event Type
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
