import { Text } from "@/src/components/ui/Text";
import type { TodoColumn } from "@/src/features/todo/type";
import { formatDate, getChecklistDueMeta } from "@/src/utils/helper";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Pressable,
  View
} from "react-native";

export type ChecklistTask = TodoColumn;

type TaskItemProps = {
  task: ChecklistTask;
  onEditPress: () => void;
  onDeletePress: () => void;
  onToggleComplete: () => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
};

const ChecklistTaskItem = ({
  task,
  onEditPress,
  onDeletePress,
  onToggleComplete,
  isUpdating,
  isDeleting,
}: TaskItemProps) => {
  const [showActions, setShowActions] = useState(false);
  const taskDueDate = task.dueDate instanceof Date
    ? task.dueDate.toISOString()
    : (task.dueDate as string | null);

  const dueMeta = getChecklistDueMeta(taskDueDate);
  const isUrgent = Boolean(dueMeta);

  return (
    <Pressable
      className={`${task.isDone
        ? "bg-surface-secondary  flex-row items-start p-5 rounded-xl mb-4"
        : "bg-surface  shadow-sm flex-row items-start p-5 rounded-xl mb-4"
        }`}
      onPress={onToggleComplete}
    >
      <Pressable
        onPress={(event) => {
          event.stopPropagation?.();
          onToggleComplete();
        }}
        className={`mt-0.5 w-6 h-6 rounded-sm border-2 flex items-center justify-center mr-4 ${task.isDone
          ? "bg-success-500 border-success-500"
          : "border-primary/20 active:border-primary active:bg-primary/5"
          }`}
        disabled={isUpdating}
      >
        {task.isDone ? (
          <MaterialIcons name="check" size={18} color="white" />
        ) : null}
      </Pressable>

      <View className="flex-1">
        <Text
          className={`font-jakarta-semibold text-base leading-snug mb-3 ${task.isDone
            ? "text-text-tertiary line-through"
            : "text-text-light"
            }`}
        >
          {task.title ?? task.task ?? "Untitled task"}
        </Text>

        <View className="flex-row flex-wrap items-center gap-x-4 gap-y-2 mb-4">
          {isUrgent ? (
            <View className="flex-row items-center bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
              <MaterialIcons name="schedule" size={14} color="#ea580c" />
              <Text className="text-xs font-jakarta-bold uppercase tracking-wider text-orange-600 ml-1">
                {dueMeta?.label}
              </Text>
            </View>
          ) : (
            <View className={`flex-row items-center ${task.isDone ? "opacity-50" : ""}`}>
              <MaterialIcons
                name="calendar-month"
                size={16}
                color="#9CA3AF"
              />
              <Text
                className={`text-xs font-jakarta-semibold ml-1.5 ${task.isDone
                  ? "text-text-disabled"
                  : "text-text-tertiary"
                  }`}
              >
                {formatDate(taskDueDate ?? undefined)}
              </Text>
            </View>
          )}

          <View className={`flex-row items-center ${task.isDone ? "opacity-50" : ""}`}>
            <View className="w-5 h-5 rounded-full overflow-hidden border border-white shadow-sm bg-surface-tertiary">
              {task.assigned_user?.photo ? (
                <Image
                  source={{ uri: task.assigned_user.photo }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <MaterialIcons name="person" size={12} color="#ee2b8c" />
                </View>
              )}
            </View>
            <Text className="text-xs font-jakarta-bold text-muted-light ml-2">
              {task.assigned_user?.username ?? "Unassigned"}
            </Text>
          </View>
        </View>

        {showActions ? (
          <View className="flex-row flex-wrap items-center gap-4">
            <Pressable
              onPress={(event) => event.stopPropagation?.()}
              className={`flex-row items-center px-2 py-1 -ml-2 rounded-sm ${task.isDone ? "opacity-50" : "active:bg-primary/5"
                }`}
              disabled={task.isDone}
            >
              <MaterialIcons
                name="add"
                size={18}
                color={task.isDone ? "#9CA3AF" : "#ee2b8c"}
              />
              <Text
                className={`text-xs font-jakarta-bold ml-1.5 ${task.isDone ? "text-text-disabled" : "text-primary"
                  }`}
              >
                Add sub-task
              </Text>
            </Pressable>

            <Pressable
              onPress={(event) => {
                event.stopPropagation?.();
                onEditPress();
              }}
              className="flex-row items-center px-2 py-1 rounded-sm active:bg-primary/5"
            >
              <MaterialIcons
                name="more-horiz"
                size={16}
                color="#896175"
              />
              <Text className="text-xs font-jakarta-bold text-[#896175] ml-1.5">
                More details
              </Text>
            </Pressable>

            <Pressable
              onPress={(event) => {
                event.stopPropagation?.();
                onToggleComplete();
              }}
              className="flex-row items-center px-2 py-1 rounded-sm active:bg-primary/5"
              disabled={isUpdating}
            >
              <MaterialIcons
                name={task.isDone ? "radio-button-unchecked" : "check-circle"}
                size={16}
                color="#ee2b8c"
              />
              <Text className="text-xs font-jakarta-bold text-primary ml-1.5">
                {task.isDone ? "Mark incomplete" : "Mark complete"}
              </Text>
            </Pressable>

            <Pressable
              onPress={(event) => {
                event.stopPropagation?.();
                onDeletePress();
              }}
              className="flex-row items-center px-2 py-1 rounded-sm active:bg-red-50"
              disabled={isDeleting}
            >
              <MaterialIcons name="delete" size={16} color="#ef4444" />
              <Text className="text-xs font-jakarta-bold text-red-500 ml-1.5">
                {isDeleting ? "Deleting..." : "Delete"}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <View className="items-center mt-0.5 ml-2">
        <Pressable
          onPress={(event) => {
            event.stopPropagation?.();
            setShowActions((prev) => !prev);
          }}
          className="p-1.5 rounded-md active:bg-primary/5"
        >
          <MaterialIcons
            name={showActions ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={20}
            color="#64748b"
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default ChecklistTaskItem;
