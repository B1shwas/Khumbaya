import { DatePicker } from "@/components/nativewindui/DatePicker";
import { Text } from "@/src/components/ui/Text";
import { useCreateEvent } from "@/src/features/events/hooks/use-event";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateSubEventScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { mutateAsync: createEvent } = useCreateEvent();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const [selectedStartDateTime, setSelectedStartDateTime] = useState(
    new Date()
  );
  const [selectedEndDateTime, setSelectedEndDateTime] = useState(new Date());

  const handleStartDateChange = (_event: any, date?: Date) => {
    if (date) setSelectedStartDateTime(date);
  };

  const handleEndDateChange = (_event: any, date?: Date) => {
    if (date) setSelectedEndDateTime(date);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a sub-event name");
      return;
    }

    setLoading(true);

    const startDateTime = new Date(selectedStartDateTime);
    const endDateTime = new Date(selectedEndDateTime);

    try {
      await createEvent({
        title: name.trim(),
        startDateTime,
        endDateTime,
        parentId: Number(eventId),
        type: "Subevent -1 (Edit it later)",
      });

      await queryClient.invalidateQueries({
        queryKey: ["sub-events", Number(eventId)],
      });

      Alert.alert("Success", "Sub-event created successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error creating sub-event:", error);
      Alert.alert("Error", "Failed to create sub-event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
        <View className="items-center mt-3">
          <View className="h-1 w-12 bg-pink-500/30 rounded-full" />
        </View>

        {/* Name */}
        <View className="mt-8">
          <Text
            variant="caption"
            className="text-gray-500 uppercase tracking-widest mb-2"
          >
            Sub-event Name
          </Text>
          <TextInput
            placeholder="e.g. Champagne Toast"
            className="bg-white rounded-xl px-4 py-4 text-base border border-gray-200"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Date */}
        <View className="mt-6">
          <DatePicker
            mode="datetime"
            value={selectedStartDateTime}
            onChange={handleStartDateChange}
            materialDateLabel="Start Date"
            materialTimeLabel="Start Time"
            materialDateClassName="mb-2"
          />
        </View>
        <View className="mt-6">
          <DatePicker
            mode="datetime"
            value={selectedEndDateTime}
            onChange={handleEndDateChange}
            materialDateLabel="End Date"
            materialTimeLabel="End Time"
            materialDateClassName="mb-2"
          />
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Footer */}
      <View className="px-6 py-4 border-t border-gray-200 bg-white">
        <TouchableOpacity
          className="bg-pink-500 py-4 rounded-xl flex-row items-center justify-center"
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Text variant="h2" className="text-white mr-2">
                Save Sub-Event
              </Text>
              <Ionicons name="checkmark-circle" size={22} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
