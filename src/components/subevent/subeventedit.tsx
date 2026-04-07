import { DatePicker } from "@/components/nativewindui/DatePicker";
import { Text } from "@/src/components/ui/Text";
import { UpdateSubEventPayload } from "@/src/features/subevent/api/subEvent.service";
import {
//   useDeleteSubEvent,
  useSubEventById,
  useUpdateSubEvent,
} from "@/src/features/subevent/hooks/useSubEvent";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#ee2b8c";

export default function SubEventEditScreen() {
  const router = useRouter();
  const { subEventId } = useLocalSearchParams<{
    subEventId: string;
  }>();

  const parsedId = Number(subEventId);
  const { data: subEvent, isLoading } = useSubEventById(parsedId);
  const updateSubEvent = useUpdateSubEvent();
//   const deleteSubEvent = useDeleteSubEvent();
  const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [theme, setTheme] = useState("");
  const [budget, setBudget] = useState("");
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());

  useEffect(() => {
    if (!subEvent) return;

    setTitle(subEvent.title ?? "");
    setDescription(subEvent.description ?? "");
    setLocation(subEvent.location ?? "");
    setTheme(subEvent.theme ?? "");
    setBudget(subEvent.budget ? String(subEvent.budget) : "");
    setStartDateTime(
      subEvent.startDateTime ? new Date(subEvent.startDateTime) : new Date()
    );
    setEndDateTime(
      subEvent.endDateTime ? new Date(subEvent.endDateTime) : new Date()
    );
  }, [subEvent]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a sub-event name.");
      return;
    }

    const payload: UpdateSubEventPayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      theme: theme.trim() || undefined,
      budget: budget ? Number(budget) : undefined,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
    };

    try {
      setSaving(true);
      await updateSubEvent.mutateAsync({
        subEventId: parsedId,
        data: payload,
      });

      Alert.alert("Success", "Sub-event updated successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error updating sub-event:", error);
      Alert.alert("Error", "Unable to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

//   const handleDelete = () => {
//     Alert.alert(
//       "Delete Sub-Event",
//       "Are you sure you want to delete this sub-event? This action cannot be undone.",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               setDeleting(true);
//               await deleteSubEvent.mutateAsync(parsedId);
//               Alert.alert("Success", "Sub-event deleted successfully.", [
//                 { text: "OK", onPress: () => router.back() },
//               ]);
//             } catch (error: any) {
//               console.error("Error deleting sub-event:", error);
//               const errorMessage =
//                 error?.response?.data?.message ||
//                 error?.message ||
//                 "Unable to delete. Please try again.";
//               Alert.alert("Error", errorMessage);
//             } finally {
//               setDeleting(false);
//             }
//           },
//         },
//       ]
//     );
//   };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text className="mt-3 text-gray-500">Loading sub-event...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 py-4"
      >
        <Text variant="h2" className="text-2xl font-bold text-slate-900 mb-4">
          Edit Sub Event
        </Text>

        <View className="space-y-5">
          <View>
            <Text
              variant="caption"
              className="text-gray-500 uppercase tracking-widest mb-2"
            >
              Name
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Sub-event title"
              className="bg-white rounded-2xl px-4 py-4 border border-gray-200"
            />
          </View>

          <View>
            <Text
              variant="caption"
              className="text-gray-500 uppercase tracking-widest mb-2"
            >
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the sub-event"
              multiline
              numberOfLines={4}
              className="bg-white rounded-2xl px-4 py-4 border border-gray-200 text-base"
            />
          </View>

          <View>
            <Text
              variant="caption"
              className="text-gray-500 uppercase tracking-widest mb-2"
            >
              Location
            </Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Venue or location"
              className="bg-white rounded-2xl px-4 py-4 border border-gray-200"
            />
          </View>

          <View>
            <Text
              variant="caption"
              className="text-gray-500 uppercase tracking-widest mb-2"
            >
              Theme
            </Text>
            <TextInput
              value={theme}
              onChangeText={setTheme}
              placeholder="Theme"
              className="bg-white rounded-2xl px-4 py-4 border border-gray-200"
            />
          </View>

          <View>
            <Text
              variant="caption"
              className="text-gray-500 uppercase tracking-widest mb-2"
            >
              Budget
            </Text>
            <TextInput
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
              placeholder="Budget amount"
              className="bg-white rounded-2xl px-4 py-4 border border-gray-200"
            />
          </View>

          <View>
            <DatePicker
              mode="datetime"
              value={startDateTime}
              onChange={(_, date) => date && setStartDateTime(date)}
              materialDateLabel="Start Date"
              materialTimeLabel="Start Time"
              materialDateClassName="mb-2"
            />
          </View>

          <View>
            <DatePicker
              mode="datetime"
              value={endDateTime}
              onChange={(_, date) => date && setEndDateTime(date)}
              materialDateLabel="End Date"
              materialTimeLabel="End Time"
              materialDateClassName="mb-2"
            />
          </View>
        </View>
      </ScrollView>

      <View className="px-6 py-4 border-t border-gray-200 bg-white">
        <TouchableOpacity
          className="bg-pink-500 py-4 rounded-xl items-center justify-center"
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text variant="h2" className="text-white">
              Save Changes
            </Text>
          )}
        </TouchableOpacity>

        {/* Delete button temporarily disabled */}
        {/* <TouchableOpacity
          className="bg-red-500 py-4 rounded-xl items-center justify-center mt-3"
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text variant="h2" className="text-white">
              Delete Sub-Event
            </Text>
          )}
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}
