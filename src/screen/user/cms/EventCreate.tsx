import { DatePicker } from "@/components/nativewindui/DatePicker";
import { CREATEEVENT } from "@/src/features/events/api/events.service";
import { useCreateEvent } from "@/src/features/events/hooks/use-event";
import { Ionicons } from "@expo/vector-icons";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";

import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface EventFormData {
  name: string;
  eventType: string;
  startdateTime: Date | undefined;
  coverImage: string | null;
}

type EventType = "Wedding" | "Engagement" | "Reception" | "Nikkah" | "Other";

const EVENT_TYPES: EventType[] = [
  "Wedding",
  "Engagement",
  "Reception",
  "Nikkah",
  "Other",
];

const EVENT_TYPE_TO_BACKEND: Record<EventType, string> = {
  Wedding: "WEDDING",
  Engagement: "ENGAGEMENT",
  Reception: "RECEPTION",
  Nikkah: "NIKKAH",
  Other: "OTHER",
};

export default function EventCreate() {
  const router = useRouter();
  const { mutateAsync: createEvent, isPending: isCreatingEvent } = useCreateEvent();

  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date()); // make the date in the thing
  const [formData, setFormData] = useState<EventFormData>({
    name: "Aisha & Omar's Wedding",
    eventType: "Wedding" as EventType,
    startdateTime: selectedDateTime, // June 16, 2024
    coverImage: null, // handle the image uplaoding logic
  });

  const scale = useSharedValue(1);

  const updateSelectedDateTime = (nextDateTime: Date) => {
    setSelectedDateTime(nextDateTime);
    setFormData((prev) => ({ ...prev, date: nextDateTime }));
  };

  const handleDateChange = (event: DateTimePickerEvent, pickedDate?: Date) => {
    if (event.type === "dismissed" || !pickedDate) return;
    const next = new Date(selectedDateTime);
    next.setFullYear(
      pickedDate.getFullYear(),
      pickedDate.getMonth(),
      pickedDate.getDate()
    );
    next.setHours(
      pickedDate.getHours(),
      pickedDate.getMinutes(),
      pickedDate.getSeconds(),
      0
    )
    updateSelectedDateTime(next);
  };


  const handleSubmit = async () => {
    //validaton in the event creation in this
    if (!formData.name.trim()) {
      Alert.alert("Missing event name", "Please enter your event name.");
      return;
    }

    if (!formData.startdateTime) {
      Alert.alert("Missing event date", "Please select your event date.");
      return;
    }

    const payload: CREATEEVENT = {
      title: formData.name.trim(),
      description: `${formData.eventType} event`,
      type: EVENT_TYPE_TO_BACKEND[formData.eventType as EventType],
      startDateTime: selectedDateTime,
      endDateTime: new Date(),
      budget: 0,
      theme: "Classic",
      parentId: 1,
      role: "Organizer",
      location: "TBD",
      imageUrl:
        formData.coverImage ??
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    };

    console.log(
      `This is the payload in the on success in the backend ${payload.startDateTime}`
    );
    try {
      await createEvent(payload);
      router.push("/(protected)/(client-tabs)/events");
    } catch {
      Alert.alert(
        "Event creation failed",
        "Please check your details and try again."
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleEventNameChange = (text: string) => {
    setFormData((prev) => ({ ...prev, name: text }));
  };

  const handleEventTypeSelect = (type: EventType) => {
    setFormData((prev) => ({ ...prev, eventType: type }));
  };

  const handleCoverPress = () => {
    // TODO: Backend Integration - Image picker
    console.log("Open image picker for cover image");
  };
  return (
    <SafeAreaView className="flex-1 bg-[#f8f6f7]">
      <KeyboardAvoidingView
        className="flex-1 max-w-[480px] self-center w-full"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-2 pb-2 bg-[#f8f6f7]">
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 rounded-full bg-black/5 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="#181114" />
          </TouchableOpacity>
          <Text className="font-plusjakartasans-bold text-lg text-[#181114] flex-1 text-center">
            Create New Event
          </Text>
          <View className="w-10" />
        </View>
        <ScrollView
          className="flex-1 mb-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cover Image Upload , make the image uploading in the application*/}
          <View className="px-4 pt-3">
            <TouchableOpacity
              onPress={handleCoverPress}
              className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-gray-200"
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4baplBpAzVE_Kbv7m5jmbgfKEsZdzJcLTblHvHyn_CNxgGJ-spHw_-lcr1J_eQJK_onSfJPDupULCeQLMZd-cLvKBMgzzViLvDItg2ng1UIiZVvbQ5CwFEo-lqmLVbH5gyK4fkgRNsiRz8-wcyZYDzkYCmyI3K2pgzYajYnxOThBEL1RbDkAhjz-hv9j9fNN8MKdGjJ7oqMlN1vqSDKRDlWWbxdNT1jniUPXUy5mcnJ7XsOCE2Qz6WO5pgIHRrOKlvu-5NrxRhU8",
                }}
                className="w-full h-full absolute"
                resizeMode="cover"
              />
              <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 items-center justify-center">
                <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-2">
                  <Ionicons name="camera" size={24} color="white" />
                </View>
                <Text className="font-plusjakartasans-medium text-base text-white">
                  Add Event Cover
                </Text>
                <Text className="font-plusjakartasans-regular text-xs text-white/70 mt-1">
                  High quality JPG or PNG
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Event Name Input */}
          <View className="px-4 pt-3">
            <Text className="font-plusjakartasans-bold text-base text-[#181114] mb-3">
              Event Name
            </Text>
            <TextInput
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base font-plusjakartasans-regular text-[#181114]"
              placeholder="e.g., Aisha & Omar's Wedding"
              placeholderTextColor="#9CA3AF"
              value={formData.name}
              onChangeText={handleEventNameChange}
            />
          </View>

          {/* Event Type Selection */}
          <View className="px-4 pt-3">
            <Text className="font-plusjakartasans-bold text-base text-[#181114] mb-3">
              What type of event is it?
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {EVENT_TYPES.map((type) => {
                const isSelected = formData.eventType === type;
                const chipClassName = isSelected
                  ? "px-5 py-2.5 rounded-full bg-[#ee2b8c] border border-[#ee2b8c]"
                  : "px-5 py-2.5 rounded-full bg-white border border-gray-200";
                const textClassName = isSelected
                  ? "font-plusjakartasans-medium text-sm text-white"
                  : "font-plusjakartasans-medium text-sm text-gray-600";

                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => handleEventTypeSelect(type)}
                    className={chipClassName}
                  >
                    <Text className={textClassName}>{type}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="mt-7">
            <DatePicker
              value={selectedDateTime}
              mode="datetime"
              onChange={handleDateChange}
              materialDateLabel="Event date"
            />
          </View>

          {/* Bottom spacing for footer */}
          <View className="h-[100px]" />
        </ScrollView>

        {/* Sticky Footer */}
        <View className="absolute bottom-0 left-0 right-0 p-6 pb-8  max-w-[480px] self-center w-full">
          <TouchableOpacity
            onPress={handleSubmit}
            className="w-full bg-[#ee2b8c] flex-row items-center justify-center gap-2 py-4 rounded-2xl shadow-lg shadow-[#ee2b8c]/25"
            activeOpacity={0.8}
            disabled={isCreatingEvent}
            onPressIn={() => {
              scale.value = 0.98;
            }}
            onPressOut={() => {
              scale.value = 1;
            }}
          >
            <Text className="font-plusjakartasans-bold text-base text-white">
              {isCreatingEvent ? "Creating..." : "Create Event"}
            </Text>
            {/* <Ionicons name="arrow-forward" size={20} color="white" /> */}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
