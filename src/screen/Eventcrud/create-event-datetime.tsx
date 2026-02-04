import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];

export default function CreateEventDateTime() {
  const { category, eventType, eventTypeIcon, eventTypeIconColor } = useLocalSearchParams();

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Current month
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // 2026
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [isAllDay, setIsAllDay] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState("Weekly");

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleContinue = () => {
    const selectedDay = selectedDate || new Date().getDate();
    const formattedDate = `${selectedDay} ${MONTHS[currentMonth]} ${currentYear}`;
    
    router.push({
      pathname: "/Eventcrud/create-event-form",
      params: {
        category,
        eventType,
        eventTypeIcon,
        eventTypeIconColor,
        date: formattedDate,
        startTime: startTime || "09:00 AM",
        endTime: endTime || "10:00 AM",
        isAllDay: isAllDay.toString(),
        isRepeat: isRepeat.toString(),
        repeatFrequency,
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
            <Ionicons name="chevron-back" size={24} color="#ec4899" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-bold text-gray-900">
            Select Date
          </Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Text className="text-primary font-semibold">Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-4">
            {/* Page Indicator */}
            <View className="flex-row items-center justify-center gap-2 py-4">
              <View className="h-1.5 w-8 rounded-full bg-primary" />
              <View className="h-1.5 w-8 rounded-full bg-primary" />
              <View className="h-1.5 w-8 rounded-full bg-pink-300" />
              <View className="h-1.5 w-8 rounded-full bg-pink-100" />
            </View>

            {/* Calendar Section */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              {/* Month Navigation */}
              <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity
                  onPress={handlePrevMonth}
                  className="p-2 rounded-full hover:bg-pink-50"
                >
                  <Ionicons name="chevron-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-900">
                  {MONTHS[currentMonth]} {currentYear}
                </Text>
                <TouchableOpacity
                  onPress={handleNextMonth}
                  className="p-2 rounded-full hover:bg-pink-50"
                >
                  <Ionicons name="chevron-forward" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              {/* Day Headers - Vertical Layout */}
              <View className="flex-row justify-between mb-2 px-1">
                {DAYS.map((day, index) => (
                  <Text
                    key={index}
                    className="text-xs font-semibold text-gray-400 text-center"
                    style={{ width: "14%" }}
                  >
                    {day}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid - Vertical Layout */}
              <View className="flex-row flex-wrap justify-between">
                {Array.from({ length: Math.ceil((daysInMonth + firstDay) / 7) * 7 }).map((_, i) => {
                  const dayNumber = i - firstDay + 1;
                  const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
                  const isSelected = dayNumber === selectedDate;
                  const isToday = dayNumber === new Date().getDate() && 
                                  currentMonth === new Date().getMonth() && 
                                  currentYear === new Date().getFullYear();

                  return (
                    <TouchableOpacity
                      key={i}
                      className={`items-center justify-center rounded-full ${
                        isSelected ? "bg-primary" : isToday ? "border-2 border-primary" : ""
                      }`}
                      style={{ width: "14%", aspectRatio: 1 }}
                      onPress={() => isCurrentMonth && setSelectedDate(dayNumber)}
                      disabled={!isCurrentMonth}
                    >
                      {isSelected ? (
                        <View className="w-full h-full rounded-full items-center justify-center">
                          <Text className="text-white text-sm font-semibold">{dayNumber}</Text>
                        </View>
                      ) : isToday ? (
                        <Text className="text-sm font-medium text-primary">{dayNumber}</Text>
                      ) : (
                        <Text
                          className={`text-sm font-medium ${
                            !isCurrentMonth ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {dayNumber > 0 ? dayNumber : ""}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Time Slots */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">Time</Text>
              
              {/* Start Time */}
              <Text className="text-sm font-semibold text-gray-500 mb-2">Start Time</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row gap-3">
                  {TIME_SLOTS.map((time, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`px-4 py-2 rounded-full ${
                        startTime === time
                          ? "bg-primary"
                          : "bg-white border border-pink-200"
                      }`}
                      onPress={() => setStartTime(time)}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          startTime === time ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* End Time */}
              <Text className="text-sm font-semibold text-gray-500 mb-2">End Time</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                  {TIME_SLOTS.map((time, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`px-4 py-2 rounded-full ${
                        endTime === time
                          ? "bg-primary"
                          : "bg-white border border-pink-200"
                      }`}
                      onPress={() => setEndTime(time)}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          endTime === time ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Options */}
            <View className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* All Day Toggle */}
              <View className="flex-row items-center justify-between px-4 py-4 border-b border-pink-100">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="calendar-outline" size={22} color="#ec4899" />
                  <Text className="text-base font-medium text-gray-900">All Day</Text>
                </View>
                <Switch
                  value={isAllDay}
                  onValueChange={setIsAllDay}
                  trackColor={{ false: "#E5E7EB", true: "#ec4899" }}
                  thumbColor="white"
                />
              </View>

              {/* Repeat Toggle */}
              <View className="flex-row items-center justify-between px-4 py-4">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="repeat-outline" size={22} color="#ec4899" />
                  <Text className="text-base font-medium text-gray-900">Repeat Event</Text>
                </View>
                <Switch
                  value={isRepeat}
                  onValueChange={setIsRepeat}
                  trackColor={{ false: "#E5E7EB", true: "#ec4899" }}
                  thumbColor="white"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer Spacer */}
        <View className="h-24" />

        {/* Continue Button */}
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-pink-100">
          <TouchableOpacity
            className="w-full bg-primary py-4 rounded-xl shadow-lg"
            style={{
              shadowColor: "#ec4899",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text className="text-center text-lg font-bold text-white">
              Continue
            </Text>
          </TouchableOpacity>
          <Text className="text-center text-xs mt-2 text-gray-400">
            Step 2 of 4
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
