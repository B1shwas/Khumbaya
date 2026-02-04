import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const eventTypes = [
  { icon: "mic", label: "Concert", iconColor: "#8b5cf6" },
  { icon: "musical-notes", label: "Festival", iconColor: "#ec4899" },
  { icon: "microphone", label: "Gig", iconColor: "#6366f1" },
  { icon: "disc-outline", label: "DJ Night", iconColor: "#3b82f6" },
  { icon: "radio", label: "Live", iconColor: "#10b981" },
  { icon: "headphones", label: "Listening", iconColor: "#f59e0b" },
];

export default function MusicEvent() {
  const [selectedType, setSelectedType] = useState<{ label: string; icon: string; iconColor: string } | null>(null);

  const handleTypePress = (type: { label: string; icon: string; iconColor: string }) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      router.push({
        pathname: "/Eventcrud/create-event-datetime",
        params: {
          category: 'music',
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
            Music
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
              What type of music event?
            </Text>
            <Text className="text-gray-500 text-base text-center mb-6">
              Help us understand your needs better
            </Text>

            {/* Event Type Grid */}
            <View className="flex-row flex-wrap gap-3">
              {eventTypes.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className={`w-[47%] rounded-xl p-4 bg-white border-2 ${
                    selectedType?.label === item.label
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-100'
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                  }}
                  onPress={() => handleTypePress(item)}
                  activeOpacity={0.8}
                >
                  <View className="items-center">
                    <View 
                      className="h-14 w-14 rounded-full items-center justify-center mb-2"
                      style={{ backgroundColor: `${item.iconColor}20` }}
                    >
                      <Ionicons name={item.icon as any} size={28} color={item.iconColor} />
                    </View>
                    <Text className="font-semibold text-gray-900 text-center">{item.label}</Text>
                    {selectedType?.label === item.label && (
                      <View className="absolute top-1 right-1">
                        <Ionicons name="checkmark-circle" size={20} color="#3713ec" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
