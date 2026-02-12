import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/EventCreate.styles";
import {
    MONTHS,
    getDaysInMonth,
    getFirstDayOfMonth,
} from "../../types/eventCreate";

interface DatePickerProps {
  currentMonth: number;
  currentYear: number;
  selectedDate: Date;
  onMonthChange: (direction: "prev" | "next") => void;
  onDateSelect: (day: number) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  currentMonth,
  currentYear,
  selectedDate,
  onMonthChange,
  onDateSelect,
}) => {
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
          style={[styles.calendarDay, styles.calendarDayInactive]}
        >
          {prevMonthDays - i}
        </Text>,
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

      days.push(
        <TouchableOpacity
          key={`current-${day}`}
          onPress={() => onDateSelect(day)}
          style={[
            styles.calendarDayContainer,
            isSelected && styles.calendarDaySelected,
          ]}
        >
          <Text
            style={[
              styles.calendarDay,
              isSelected && styles.calendarDaySelectedText,
              isToday && !isSelected && styles.calendarDayToday,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>,
      );
    }

    // Next month padding
    const totalCells = firstDay + daysInMonth;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <Text
          key={`next-${i}`}
          style={[styles.calendarDay, styles.calendarDayInactive]}
        >
          {i}
        </Text>,
      );
    }

    return days;
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>When is the big day?</Text>
      <View style={styles.calendarContainer}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarMonth}>
            {MONTHS[currentMonth]} {currentYear}
          </Text>
          <View style={styles.calendarNavigation}>
            <TouchableOpacity
              onPress={() => onMonthChange("prev")}
              style={styles.calendarNavButton}
            >
              <Ionicons name="chevron-back" size={24} color="#ee2b8c" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onMonthChange("next")}
              style={styles.calendarNavButton}
            >
              <Ionicons name="chevron-forward" size={24} color="#ee2b8c" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Day of Week Headers */}
        <View style={styles.calendarWeekHeader}>
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <Text key={day} style={styles.calendarWeekDay}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>{renderCalendarDays()}</View>
      </View>
    </View>
  );
};
