import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function CreateEventLocation() {
  const { category, eventType, eventTypeIcon, eventTypeIconColor, date, startTime, endTime, isAllDay, isRepeat, repeatFrequency, eventTitle, eventDescription, attendees } = useLocalSearchParams();

  const [location, setLocation] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [allowGuestListSharing, setAllowGuestListSharing] = useState(true);

  const handleCreate = () => {
    router.push({
      pathname: "/Eventcrud/create-event-success",
      params: {
        category,
        eventType,
        eventTypeIcon,
        eventTypeIconColor,
        date,
        startTime,
        endTime,
        isAllDay,
        isRepeat,
        repeatFrequency,
        eventTitle,
        eventDescription,
        attendees,
        location,
        isPublic: isPublic.toString(),
        allowGuestListSharing: allowGuestListSharing.toString(),
      },
    } as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-pink-50">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-pink-100">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-pink-100"
          >
            <Ionicons name="arrow-back" size={24} color="#ec4899" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-bold text-gray-900 pr-12">
            Location & Privacy
          </Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-4">
            {/* Progress Bar */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-medium text-gray-900">
                  Step 3 of 3
                </Text>
                <Text className="text-sm font-bold text-primary">100%</Text>
              </View>
              <View className="h-1.5 rounded-full bg-pink-200 overflow-hidden">
                <View className="h-full rounded-full bg-primary" style={{ width: "100%" }} />
              </View>
            </View>

            {/* Location Input */}
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Event Location
            </Text>
            <View className="flex-row items-center bg-white rounded-xl border border-pink-200 shadow-sm px-4 mb-4">
              <Ionicons name="location-outline" size={20} color="#ec4899" />
              <TextInput
                className="flex-1 py-3 ml-2 text-gray-700"
                placeholder="Enter or search location"
                placeholderTextColor="#9CA3AF"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {/* Privacy Section */}
            <Text className="text-lg font-bold text-gray-900 mb-3 mt-6">
              Privacy Settings
            </Text>

            <View className="flex-row gap-4 mb-4">
              {/* public Option */}
              <TouchableOpacity
                className={`flex-1 p-4 rounded-xl border-2 ${
                  isPublic
                    ? "border-primary bg-pink-50"
                    : "border-pink-200 bg-white"
                }`}
                onPress={() => setIsPublic(true)}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <Ionicons
                    name="earth"
                    size={24}
                    color={isPublic ? "#3713ec" : "#6B7280"}
                  />
                  {isPublic && (
                    <Ionicons name="checkmark-circle" size={20} color="#3713ec" />
                  )}
                </View>
                <Text className="font-bold text-gray-900">Public</Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Visible to everyone
                </Text>
              </TouchableOpacity>

              {/* Private Option */}
              <TouchableOpacity
                className={`flex-1 p-4 rounded-xl border-2 ${
                  !isPublic
                    ? "border-primary bg-pink-50"
                    : "border-pink-200 bg-white"
                }`}
                onPress={() => setIsPublic(false)}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <Ionicons
                    name="lock-closed"
                    size={24}
                    color={!isPublic ? "#3713ec" : "#6B7280"}
                  />
                </View>
                <Text className="font-bold text-gray-900">Private</Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Invite only
                </Text>
              </TouchableOpacity>
            </View>

            {/* Guest List Sharing Toggle */}
            <View className="mt-4 bg-white rounded-xl border border-pink-200 p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-semibold text-gray-900">
                  Allow Guest List Sharing
                </Text>
                <Switch
                  value={allowGuestListSharing}
                  onValueChange={setAllowGuestListSharing}
                  trackColor={{ false: "#E5E7EB", true: "#ec4899" }}
                  thumbColor="white"
                />
              </View>
              <Text className="text-xs text-gray-500">
                Guests can see who else is attending the event.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer Spacer */}
        <View className="h-32" />

        {/* Create Event Button */}
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-pink-100">
          <TouchableOpacity
            className="w-full bg-primary py-4 rounded-xl shadow-lg"
            style={{
              shadowColor: "#ec4899",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
            onPress={handleCreate}
            activeOpacity={0.8}
          >
            <Text className="text-center text-lg font-bold text-white flex-row items-center justify-center gap-2">
              Create Event
              <Ionicons name="checkmark-circle" size={20} color="white" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
