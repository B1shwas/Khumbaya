import { DatePicker } from '@/components/nativewindui/DatePicker';
import { CREATEEVENT } from "@/src/features/events/api/events.service";
import { useCreateEvent } from "@/src/features/events/hooks/use-event";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import React, { useState } from "react";
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
import {
  useSharedValue,
} from "react-native-reanimated";

interface EventFormData {
  name: string;
  eventType: string;
  date: Date | null;
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

// Calendar helper functions
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function EventCreate() {
  const router = useRouter();
  const { mutate: createEvent, isPending: isCreatingEvent } = useCreateEvent();

  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    name: "Aisha & Omar's Wedding",
    eventType: "Wedding" as EventType,
    date: new Date(2024, 5, 16), // June 16, 2024
    coverImage: null,
  });

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(5); // June 2024
  const [currentYear, setCurrentYear] = useState(2024);
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 5, 16));
  // Animation values
  const scale = useSharedValue(1);

  const handleNextStep = async () => {
    //validaton in the event creation in this
    if (!formData.name.trim()) {
      Alert.alert("Missing event name", "Please enter your event name.");
      return;
    }

    if (!formData.date) {
      Alert.alert("Missing event date", "Please select your event date.");
      return;
    }

    const selectedDate = formData.date;
    const startDate = new Date(selectedDate);
    startDate.setHours(10, 0, 0, 0);
    const endDate = new Date(selectedDate);
    endDate.setHours(22, 0, 0, 0);

    const payload: CREATEEVENT = {
      title: formData.name.trim(),
      description: `${formData.eventType} event`,
      type: EVENT_TYPE_TO_BACKEND[formData.eventType as EventType],
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      date: selectedDate.toDateString(),
      budget: 0,
      theme: "Classic",
      parentId: 1,
      role: "Organizer",
      location: "TBD",
      imageUrl:
        formData.coverImage ??
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    };

    createEvent(payload, {
      onSuccess: () => {
        router.push("/(protected)/(client-tabs)/events");
      },
      onError: () => {
        Alert.alert(
          "Event creation failed",
          "Please check your details and try again."
        );
      },
    });
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

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    setFormData((prev) => ({ ...prev, date: newDate }));
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    }
  };

  const handleCoverPress = () => {
    // TODO: Backend Integration - Image picker
    console.log("Open image picker for cover image");
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: React.ReactNode[] = [];

    // Previous month padding
    const prevMonthDays =
      currentMonth === 0
        ? getDaysInMonth(currentYear - 1, 11)
        : getDaysInMonth(currentYear, currentMonth - 1);

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <Text
          key={`prev-${i}`}
          className="w-10 text-center leading-10 text-sm font-medium text-gray-300"
        >
          {prevMonthDays - i}
        </Text>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear;

      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentMonth &&
        new Date().getFullYear() === currentYear;

      const dayContainerClass = isSelected
        ? "w-10 h-10 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30"
        : "w-10 h-10 items-center justify-center rounded-full";

      const dayTextClass = isSelected
        ? "text-sm font-semibold text-white"
        : isToday
          ? "text-sm font-semibold text-primary"
          : "text-sm font-medium text-gray-900";

      days.push(
        <TouchableOpacity
          key={`current-${day}`}
          onPress={() => handleDateSelect(day)}
          className={dayContainerClass}
        >
          <Text className={dayTextClass}>{day}</Text>
        </TouchableOpacity>
      );
    }

    // Next month padding
    const totalCells = firstDay + daysInMonth;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <Text
          key={`next-${i}`}
          className="w-10 text-center leading-10 text-sm font-medium text-gray-300"
        >
          {i}
        </Text>
      );
    }

    return days;
  };

  return (
    <View className="flex-1 bg-[#f8f6f7]">
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
          {/* Cover Image Upload */}
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

                  
          <View className='mt-7'>
            <DatePicker
              value={selectedDate}
              mode="datetime"
              onChange={(ev:any) => {
                  setSelectedDate(new Date(ev.nativeEvent.timestamp));
              }}
              />
          </View>


          {/* Bottom spacing for footer */}
          <View className="h-[100px]" />
        </ScrollView>

        {/* Sticky Footer */}
        <View className="absolute bottom-0 left-0 right-0 p-6 pb-8  max-w-[480px] self-center w-full">
          <TouchableOpacity
            onPress={handleNextStep}
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
    </View>
  );
}
