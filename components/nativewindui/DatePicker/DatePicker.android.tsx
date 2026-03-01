import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as React from "react";
import { Text, View } from "react-native";

import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/utils/cn";

export function DatePicker(
  props: Omit<React.ComponentProps<typeof DateTimePicker>, "onChange"> & {
    mode: "date" | "time" | "datetime";
    onChange?: (event: DateTimePickerEvent, date?: Date) => void;
    materialDateClassName?: string;
    materialDateLabel?: string;
    materialDateLabelClassName?: string;
    materialTimeClassName?: string;
    materialTimeLabel?: string;
    materialTimeLabelClassName?: string;
  }
) {
  const show = (currentMode: "time" | "date") => () => {
    DateTimePickerAndroid.open({
      value: props.value,
      onChange: props.onChange,
      mode: currentMode,
      minimumDate: props.minimumDate,
      maximumDate: props.maximumDate,
    });
  };

  return (
    <View className="flex-row gap-3 px-4 py-2">
      {props.mode.includes("date") && (
        <View className={cn("flex-1 gap-1", props.materialDateClassName)}>
          <Text
            className={cn(
              "text-xs font-medium text-muted-foreground tracking-wide uppercase pl-1 text-center",
              props.materialDateLabelClassName
            )}
          >
            {props.materialDateLabel ?? "Date"}
          </Text>
          <Button
            variant="outline"
            onPress={show("date")}
            className="w-full  borderpx-4  px-5 py-2.5 rounded-full bg-white border border-border"
          >
            <Text className="font-plusjakartasans-medium text-sm text-gray-600">
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
              }).format(props.value)}
            </Text>
          </Button>
        </View>
      )}

      {props.mode.includes("time") && (
        <View
          className={cn(
            "flex-1 gap-1 drop-shadow-md  ",
            props.materialTimeClassName
          )}
        >
          <Text
            className={cn(
              "text-xs font-medium text-muted-foreground tracking-wide uppercase pl-1 text-center ",
              props.materialTimeLabelClassName
            )}
          >
            {props.materialTimeLabel ?? "Time"}
          </Text>

          <Button
            variant="outline"
            onPress={show("time")}
            className="w-full  borderpx-4  px-5 py-2.5 rounded-full bg-white border border-border"
          >
            <Text className="font-plusjakartasans-medium text-sm text-gray-600">
              {new Intl.DateTimeFormat("en-US", {
                timeStyle: "short",
              }).format(props.value)}
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
}
