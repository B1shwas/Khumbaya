import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

import { formatDate, formatTime } from "@/src/utils/helper";

type DateTimeRangeValue = {
  startDateTime: Date;
  endDateTime: Date;
};

type DateTimeRangePickerProps = {
  value: DateTimeRangeValue;
  onChange: (value: DateTimeRangeValue) => void;
  startLabel?: string;
  endLabel?: string;
};

export function DateTimeRangePicker({
  value,
  onChange,
  startLabel = "Start",
  endLabel = "End",
}: DateTimeRangePickerProps) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

  const onStartChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "dismissed") {
      setShowStartPicker(false);
      setPickerMode("date");
      return;
    }

    if (!date) return;

    const nextStart = new Date(value.startDateTime);

    if (pickerMode === "date") {
      nextStart.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      onChange({ startDateTime: nextStart, endDateTime: value.endDateTime });

      if (Platform.OS === "android") {
        setShowStartPicker(false);
        setTimeout(() => {
          setPickerMode("time");
          setShowStartPicker(true);
        }, 0);
      } else {
        setPickerMode("time");
      }
    } else {
      nextStart.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), 0);
      onChange({ startDateTime: nextStart, endDateTime: value.endDateTime });
      setShowStartPicker(false);
      setPickerMode("date");
    }
  };

  const onEndChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "dismissed") {
      setShowEndPicker(false);
      setPickerMode("date");
      return;
    }

    if (!date) return;

    const nextEnd = new Date(value.endDateTime);

    if (pickerMode === "date") {
      nextEnd.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      onChange({ startDateTime: value.startDateTime, endDateTime: nextEnd });

      if (Platform.OS === "android") {
        setShowEndPicker(false);
        setTimeout(() => {
          setPickerMode("time");
          setShowEndPicker(true);
        }, 0);
      } else {
        setPickerMode("time");
      }
    } else {
      nextEnd.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), 0);
      onChange({ startDateTime: value.startDateTime, endDateTime: nextEnd });
      setShowEndPicker(false);
      setPickerMode("date");
    }
  };

  return (
    <View className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
      <View className="flex-row items-center justify-between w-full mb-4">
        <View className="flex-row items-center gap-4">
          <View className="w-3 h-3 rounded-full bg-primary ring-4 ring-white z-10 shadow-sm" />
          <Text className="text-base text-zinc-600 font-medium">{startLabel}</Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => {
              setPickerMode("date");
              setShowStartPicker(true);
            }}
            className="px-4 py-2 bg-zinc-100 rounded-full"
          >
            <Text className="text-zinc-700 text-sm font-medium">
              {formatDate(value.startDateTime.toISOString())}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPickerMode("time");
              setShowStartPicker(true);
            }}
            className="px-4 py-2 bg-zinc-100 rounded-full"
          >
            <Text className="text-zinc-700 text-sm font-medium">
              {formatTime(value.startDateTime.toISOString())}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="w-full h-[1px] bg-zinc-100 ml-7 mb-4" />

      <View className="flex-row items-center justify-between w-full">
        <View className="flex-row items-center gap-4">
          <View className="w-3 h-3 rounded-full border-2 border-primary bg-white ring-4 ring-white z-10 shadow-sm" />
          <Text className="text-base text-zinc-600 font-medium">{endLabel}</Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => {
              setPickerMode("date");
              setShowEndPicker(true);
            }}
            className="px-4 py-2 bg-zinc-100 rounded-full"
          >
            <Text className="text-zinc-700 text-sm font-medium">
              {formatDate(value.endDateTime.toISOString())}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPickerMode("time");
              setShowEndPicker(true);
            }}
            className="px-4 py-2 bg-zinc-100 rounded-full"
          >
            <Text className="text-zinc-700 text-sm font-medium">
              {formatTime(value.endDateTime.toISOString())}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={value.startDateTime}
          mode={pickerMode}
          is24Hour={false}
          onChange={onStartChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={value.endDateTime}
          mode={pickerMode}
          is24Hour={false}
          onChange={onEndChange}
        />
      )}
    </View>
  );
}
