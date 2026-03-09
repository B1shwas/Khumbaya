import { DatePicker } from "@/components/nativewindui/DatePicker";
import { subEventApi } from "@/src/api/subEventApi";
import { Text } from "@/src/components/ui/Text";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateSubEventScreen() {
  const [loading, setLoading] = useState(false);
  const [timelineVisible, setTimelineVisible] = useState(true);

  // Date and time state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const [form, setForm] = useState({
    name: "",
    location: "",
    vendor: "",
    notes: "",
    budget: "",
    theme: "",
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedTime(date);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Please enter a sub-event name");
      return;
    }

    setLoading(true);

    try {
      // Create the sub-event data object
      const subEventData = {
        template: {
          id: `template_${Date.now()}`,
          name: form.name,
          description: form.notes || "",
          icon: "gift" as const,
          category: "General",
          activities: [],
        },
        date: selectedDate.toISOString(),
        theme: form.theme || "Default",
        budget: form.budget || "0",
        activities: [],
      };

      // Save to backend
      await subEventApi.create(subEventData);

      Alert.alert("Success", "Sub-event created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setForm({
              name: "",
              location: "",
              vendor: "",
              notes: "",
              budget: "",
              theme: "",
            });
            setSelectedDate(new Date());
            setSelectedTime(new Date());
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating sub-event:", error);
      Alert.alert("Error", "Failed to create sub-event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* HEADER */}
      {/* <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity className="p-2">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text variant="h2" className="text-slate-900">
          New Sub-Event
        </Text>

        <View className="w-6" />
      </View> */}

      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
        {/* Accent */}
        <View className="items-center mt-3">
          <View className="h-1 w-12 bg-pink-500/30 rounded-full" />
        </View>

        {/* Sub Event Name */}
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
            value={form.name}
            onChangeText={(text) => updateField("name", text)}
          />
        </View>

        {/* DATE + TIME using DatePicker */}
        <View className="mt-6">
          <DatePicker
            mode="date"
            value={selectedDate}
            onChange={handleDateChange}
            materialDateLabel="Date"
            materialDateClassName="mb-2"
          />
        </View>

        <View className="mt-4">
          <DatePicker
            mode="time"
            value={selectedTime}
            onChange={handleTimeChange}
            materialTimeLabel="Time"
            materialTimeClassName="mb-2"
          />
        </View>

        {/* LOCATION */}
        <View className="mt-6">
          <Text variant="caption" className="text-gray-500 uppercase mb-2">
            Location
          </Text>

          <View className="flex-row items-center bg-white rounded-xl px-4 border border-gray-200">
            <Ionicons name="map" size={20} color="#ee2b8c" />

            <TextInput
              placeholder="Search venue or address"
              className="flex-1 py-4 ml-3 text-gray-900"
              value={form.location}
              onChangeText={(text) => updateField("location", text)}
            />
          </View>
        </View>

        {/* TIMELINE TOGGLE */}
        <View className="flex-row items-center justify-between mt-6">
          <View>
            <Text className="text-sm font-medium text-gray-900">
              Show on Timeline
            </Text>

            <Text className="text-xs text-gray-500">
              Visible to guests in schedule
            </Text>
          </View>

          <Switch value={timelineVisible} onValueChange={setTimelineVisible} />
        </View>

        {/* VENDOR SELECT */}
        <View className="mt-6">
          <Text variant="caption" className="text-gray-500 uppercase mb-2">
            Select Vendor
          </Text>

          <View className="flex-row items-center bg-white rounded-xl px-4 border border-gray-200">
            <Ionicons name="storefront" size={20} color="#d4af37" />

            <TextInput
              placeholder="Search or select vendor"
              className="flex-1 py-4 ml-3 text-gray-900"
              value={form.vendor}
              onChangeText={(text) => updateField("vendor", text)}
            />
          </View>
        </View>

        {/* BUDGET */}
        <View className="mt-6">
          <Text variant="caption" className="text-gray-500 uppercase mb-2">
            Budget
          </Text>

          <View className="flex-row items-center bg-white rounded-xl px-4 border border-gray-200">
            <MaterialIcons name="attach-money" size={20} color="#10B981" />

            <TextInput
              placeholder="Enter budget amount"
              className="flex-1 py-4 ml-3 text-gray-900"
              value={form.budget}
              onChangeText={(text) => updateField("budget", text)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* THEME */}
        <View className="mt-6">
          <Text variant="caption" className="text-gray-500 uppercase mb-2">
            Theme
          </Text>

          <View className="flex-row items-center bg-white rounded-xl px-4 border border-gray-200">
            <Ionicons name="color-palette" size={20} color="#8B5CF6" />

            <TextInput
              placeholder="e.g. Rose Gold, Classic, Modern"
              className="flex-1 py-4 ml-3 text-gray-900"
              value={form.theme}
              onChangeText={(text) => updateField("theme", text)}
            />
          </View>
        </View>
        <View className="h-24" />
      </ScrollView>

      {/* FOOTER BUTTON */}
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
    </SafeAreaView>
  );
}
