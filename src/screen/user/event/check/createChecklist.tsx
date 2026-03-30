
import { DatePicker } from "@/components/nativewindui/DatePicker";
import { useCreateTodo } from "@/src/features/todo/hooks/useTodo";
import { useChecklistDraftStore } from "@/src/store/useChecklistDraftStore";
import { shadowStyle } from "@/src/utils/helper";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SubTask = {
  id: string;
  title: string;
  completed: boolean;
};

type TaskData = {
  title: string;
  dueDate: string;
  dueTime: string;
  assignee: {
    name: string;
    role: string;
    avatar: string;
    verified: boolean;
  };
  notes: string;
  subTasks: SubTask[];
};

const EditTaskScreen: React.FC = () => {
  const { eventId } = useLocalSearchParams<{ eventId?: string | string[] }>();
  const resolvedEventId = Array.isArray(eventId) ? eventId[0] : eventId;
  const parsedEventId = resolvedEventId ? Number(resolvedEventId) : null;
  const eventIdNumber = Number.isFinite(parsedEventId)
    ? (parsedEventId as number)
    : null;
  const { draft, clearDraft } = useChecklistDraftStore();
  const createTodo = useCreateTodo();

  const initialTitle = draft?.title ?? "";
  const initialDueDate = draft?.dueDate ? String(draft.dueDate) : "";
  const initialDueDateValue = draft?.dueDate ? new Date(draft.dueDate) : null;
  const initialAssigneeName = draft?.assigneeName ?? "Unassigned";

  const [task, setTask] = useState<TaskData>({
    title: initialTitle,
    dueDate: initialDueDate,
    dueTime: "",
    assignee: {
      name: initialAssigneeName,
      role: "",
      avatar:
        "",
      verified: false,
    },
    notes: "",
    subTasks: [],
  });
  const [selectedDueDate, setSelectedDueDate] = useState<Date | null>(
    initialDueDateValue
  );

  useEffect(() => {
    return () => {
      clearDraft();
    };
  }, [clearDraft]);

  const canCreate = useMemo(() => {
    return Boolean(eventIdNumber && task.title.trim());
  }, [eventIdNumber, task.title]);

  const getRandomDueDate = useCallback(() => {
    const today = new Date();
    const offsetDays = Math.floor(Math.random() * 14) + 1;
    const due = new Date(today);
    due.setDate(today.getDate() + offsetDays);
    return due.toISOString();
  }, []);

  const handleSave = useCallback(() => {
    if (!eventIdNumber) {
      Alert.alert("Missing event", "Please open this checklist from an event.");
      return;
    }

    if (!task.title.trim()) {
      Alert.alert("Missing title", "Please add a task title first.");
      return;
    }

    const payload = {
      eventId: eventIdNumber,
      task: task.title.trim(),
      title: task.title.trim(),
      dueDate: task.dueDate ? task.dueDate : getRandomDueDate(),
      parentId: null,
      status: "pending",
    };

    createTodo.mutate(
      payload,
      {
        onSuccess: () => {
          Alert.alert("Success", "Task created successfully!", [
            { text: "OK", onPress: () => router.back() },
          ]);
        },
        onError: () => {
          Alert.alert("Error", "Could not create task. Please try again.");
        },
      }
    );
  }, [createTodo, eventIdNumber, task.title, task.dueDate]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Discard Task",
      "Are you sure you want to discard this task? Your changes will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  }, []);

  const toggleSubTask = useCallback((id: string) => {
    setTask((prev) => ({
      ...prev,
      subTasks: prev.subTasks.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st
      ),
    }));
  }, []);

  const updateField = useCallback(<K extends keyof TaskData>(
    field: K,
    value: TaskData[K]
  ) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <StatusBar style="dark" />

      <View className="absolute top-0 left-0 right-0 z-50">
     
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 space-y-10">
            <View className="space-y-6">
              <View className="space-y-1">
                <Text className=" font-jakarta uppercase tracking-widest text-on-secondary-fixed-variant/70">
                  Task Title
                </Text>
                <TextInput
                  value={task.title}
                  onChangeText={(text) => updateField("title", text)}
                  placeholder="Enter task name..."
                  placeholderTextColor="#d6d3d1"
                  className="bg-transparent text-2xl font-jakarta-extrabold text-on-surface p-0"
                  multiline
                  autoFocus={false}
                  returnKeyType="done"
                  blurOnSubmit
                />
              </View>

              <View className="flex-row flex-wrap gap-6 mt-5">
                <View className="flex-1 min-w-[200px]">
                  <DatePicker
                    mode="date"
                    value={selectedDueDate ?? new Date()}
                    onChange={(_event, date) => {
                      if (!date) return;
                      setSelectedDueDate(date);
                      updateField("dueDate", date.toISOString());
                    }}
                    materialDateLabel="Due Date"
                    materialDateClassName="gap-2"
                    materialDateLabelClassName="text-[10px] font-jakarta-bold uppercase tracking-widest text-on-secondary-fixed-variant/70"
                  />
                </View>

                <View className="flex-1 min-w-[200px] space-y-2 p-2">
                  <Text className="text-[10px] font-jakarta-bold uppercase tracking-widest text-on-secondary-fixed-variant/70">
                    Assignee
                  </Text>
                  <View
                    className="flex-row items-center gap-3 p-4 bg-white rounded-xl border border-border/40"
                    style={shadowStyle}
                  >
                    <View className="relative">
                      {task.assignee.avatar ? (
                        <Image
                          source={{ uri: task.assignee.avatar }}
                          className="w-10 h-10 rounded-full border-2 border-primary"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-10 h-10 rounded-full border-2 border-primary bg-surface-tertiary items-center justify-center">
                          <MaterialIcons name="person" size={18} color="#78716c" />
                        </View>
                      )}
                      {task.assignee.verified && (
                        <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                          <MaterialIcons name="check-circle" size={12} color="#ee2b8c" />
                        </View>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-jakarta-bold text-on-surface">
                        {task.assignee.name}
                      </Text>
                      <Text className="text-[10px] text-text-tertiary">
                        {task.assignee.role}
                      </Text>
                    </View>
                    <Pressable
                      className="w-8 h-8 rounded-full bg-surface-tertiary items-center justify-center"
                      accessibilityLabel="Change assignee"
                    >
                      <MaterialIcons name="swap-horiz" size={18} color="#78716c" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>

            <View className="space-y-2">
              <Text className="text-[10px] font-jakarta-bold uppercase tracking-widest text-on-secondary-fixed-variant/70">
                Notes
              </Text>
              <View className="bg-white p-5 rounded-xl border border-border/30 shadow-sm">
                <TextInput
                  value={task.notes}
                  onChangeText={(text) => updateField("notes", text)}
                  placeholder="Add specific details about the floral vendor and delivery times..."
                  placeholderTextColor="#a8a29e"
                  className="bg-white text-sm text-on-surface-variant p-0 min-h-20 leading-relaxed"
                  multiline
                  textAlignVertical="top"
                  numberOfLines={4}
                />
              </View>
            </View>

            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-[10px] font-jakarta-bold uppercase tracking-widest text-on-secondary-fixed-variant/70">
                  Sub-tasks ({task.subTasks.length})
                </Text>
                <TouchableOpacity
                  className="flex-row items-center gap-1 bg-primary-container px-3 py-1 rounded-full"
                  accessibilityLabel="Add new sub-task"
                  disabled
                >
                  <MaterialIcons name="add" size={12} color="#ee2b8c" />
                  <Text className="text-[10px] font-jakarta-bold text-primary uppercase tracking-wider">
                    Add New
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="rounded-2xl overflow-hidden bg-surface-container-low border border-border/30">
                {task.subTasks.map((subTask, index) => (
                  <View
                    key={subTask.id}
                    className={`flex-row items-center gap-4 p-4 bg-white ${
                      index < task.subTasks.length - 1 ? "border-b border-border/30" : ""
                    }`}
                  >
                    <TouchableOpacity
                      onPress={() => toggleSubTask(subTask.id)}
                      className={`w-5 h-5 rounded-md border-2 items-center justify-center ${
                        subTask.completed
                          ? "border-primary/30 bg-primary"
                          : "border-stone-200"
                      }`}
                      accessibilityLabel={
                        subTask.completed ? "Mark as incomplete" : "Mark as complete"
                      }
                      accessibilityState={{ checked: subTask.completed }}
                    >
                      {subTask.completed && (
                        <MaterialIcons name="check" size={14} color="#fff" />
                      )}
                    </TouchableOpacity>

                    <Text
                      className={`flex-1 text-sm font-jakarta-medium ${
                        subTask.completed
                          ? "text-text-disabled line-through"
                          : "text-on-surface"
                      }`}
                    >
                      {subTask.title}
                    </Text>

                    <TouchableOpacity
                      className="opacity-40"
                      accessibilityLabel="Reorder sub-task"
                    >
                      <MaterialIcons name="drag-indicator" size={20} color="#d6d3d1" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View className="pt-6 items-center gap-4">
              <TouchableOpacity
                onPress={handleSave}
                disabled={!canCreate || createTodo.isPending}
                className={`flex-row items-center gap-2 px-6 py-3 rounded-full active:scale-95 ${
                  !canCreate || createTodo.isPending
                    ? "bg-primary/40"
                    : "bg-primary"
                }`}
                accessibilityLabel="Create this task"
              >
                <MaterialIcons name="add-task" size={16} color="#fff" />
                <Text className="text-white text-xs font-jakarta-bold uppercase tracking-widest">
                  {createTodo.isPending ? "Creating..." : "Create Task"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                className="flex-row items-center gap-2 text-error px-6 py-3 rounded-full active:scale-95"
                accessibilityLabel="Discard this task"
              >
                <MaterialIcons name="delete" size={16} color="#ef4444" />
                <Text className="text-error text-xs font-jakarta-bold uppercase tracking-widest">
                  Discard Task
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20" />
    </SafeAreaView>
  );
};

export default EditTaskScreen;