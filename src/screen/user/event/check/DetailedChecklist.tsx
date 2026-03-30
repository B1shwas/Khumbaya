
import { DatePicker } from "@/components/nativewindui/DatePicker";
import { useUpdateTodo } from "@/src/features/todo/hooks/useTodo";
import { useTodoDraftStore } from "@/src/features/todo/store";
import { shadowStyle } from "@/src/utils/helper";
import { MaterialIcons } from "@expo/vector-icons";
import { useGetEventOwner } from "@/src/features/events/hooks/use-event";
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
  const params = useLocalSearchParams<{ taskId?: string | string[] }>();
  const rawTaskId = Array.isArray(params.taskId) ? params.taskId[0] : params.taskId;
  const parsedTaskId = Number(rawTaskId)
  const taskId = Number.isFinite(parsedTaskId) ? parsedTaskId : null;
  const { todoDraft } = useTodoDraftStore();
  const { mutate: updateTodo, isPending: isUpdating } = useUpdateTodo();

  const initialTitle = useMemo(
    () => todoDraft?.title ?? todoDraft?.task ?? "",
    [todoDraft]
  );

  const initialNotes = useMemo(() => todoDraft?.task ?? "", [todoDraft]);

  const initialDueDate = useMemo(() => {
    if (!todoDraft?.dueDate) return "";
    const date = todoDraft.dueDate instanceof Date
      ? todoDraft.dueDate
      : new Date(todoDraft.dueDate);
    return Number.isNaN(date.getTime()) ? "" : date.toDateString();
  }, [todoDraft]);

  const initialDueValue = useMemo(() => {
    if (!todoDraft?.dueDate) return null;
    const date = todoDraft.dueDate instanceof Date
      ? todoDraft.dueDate
      : new Date(todoDraft.dueDate);
    return Number.isNaN(date.getTime()) ? null : date;
  }, [todoDraft]);

  const [selectedDueDateTime, setSelectedDueDateTime] = useState<Date | null>(
    initialDueValue
  );


  if (!todoDraft?.eventId) return null;
  const eventOwner = useGetEventOwner(todoDraft?.eventId);
  const [task, setTask] = useState<TaskData>({
    title: initialTitle,
    dueDate: initialDueDate,
    dueTime: "04:00 PM",
    assignee: {
      name: "Assignee Name",
      role: "Organizer",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAfmF-fDRZPXgVfKKzR8xlRKeQe-AbtrVoAY94UZqBTUVAd6N5fMWqb5wGRKpya_9ar8WRmvkcUbTUihSerOH4gPZuo_oqZUCrGjskCE-cYdDqgRcxd--gG4aJ8ANTP5hcG3_llM0xnhh7HoDSW-LwUCqI_pRPGf1zXrvWQ5e0CZEgQ1uL07-LdmK8hNKtLK49Qk3C7yJlrFHYLFUmJfBgtxIStsojUEhFEkZCmsfCNRDMPK5_-qxZ9mdIfszEnSz8KcTXr7I9zthM",
      verified: true,
    },
    notes:
      initialNotes,
    subTasks: [
      { id: "1", title: "Confirm guest count for centerpieces", completed: true },
      { id: "2", title: "Order 20 yards of velvet ribbon", completed: false },
      { id: "3", title: "Send color swatches to Bloom Co.", completed: false },
      { id: "4", title: "Final venue walkthrough", completed: false },
    ],
  });

  useEffect(() => {
    setTask((prev) => ({
      ...prev,
      title: initialTitle,
      notes: initialNotes,
      dueDate: initialDueDate,
    }));
  }, [initialDueDate, initialNotes, initialTitle]);

  useEffect(() => {
    if (!initialDueValue) return;
    setSelectedDueDateTime(initialDueValue);
    setTask((prev) => ({
      ...prev,
      dueDate: initialDueValue.toDateString(),
      dueTime: new Intl.DateTimeFormat("en-US", {
        timeStyle: "short",
      }).format(initialDueValue),
    }));
  }, [initialDueValue]);

  const handleSave = useCallback(() => {
    const todoId = typeof todoDraft?.id === "number" ? todoDraft.id : taskId;
    if (!todoId) {
      Alert.alert("Missing task", "Task id not found for update.");
      return;
    }

    if (!task.title.trim()) {
      Alert.alert("Missing title", "Please add a task title first.");
      return;
    }

    let dueDateIso: string | undefined;
    if (selectedDueDateTime) {
      dueDateIso = selectedDueDateTime.toISOString();
    } else if (todoDraft?.dueDate) {
      const parsed =
        todoDraft.dueDate instanceof Date
          ? todoDraft.dueDate
          : new Date(todoDraft.dueDate);
      if (!Number.isNaN(parsed.getTime())) {
        dueDateIso = parsed.toISOString();
      }
    }
    updateTodo(
      {
        id: todoId,
        payload: {
          title: task.title.trim(),
          task: task.notes.trim() || task.title.trim(),
          dueDate: dueDateIso ?? null,
        },
        eventId: todoDraft?.eventId ?? null,
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Task updated successfully!", [
            { text: "OK", onPress: () => router.back() },
          ]);
        },
        onError: () => {
          Alert.alert("Error", "Could not update task. Please try again.");
        },
      }
    );
  }, [
    selectedDueDateTime,
    task.title,
    task.notes,
    todoDraft?.id,
    todoDraft?.eventId,
    todoDraft?.dueDate,
    taskId,
    updateTodo,
  ]);


  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
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
                    mode="datetime"
                    value={selectedDueDateTime ?? new Date()}
                    onChange={(_event, date) => {
                      if (!date) return;
                      setSelectedDueDateTime(date);
                      const dueTimeLabel = new Intl.DateTimeFormat("en-US", {
                        timeStyle: "short",
                      }).format(date);
                      setTask((prev) => ({
                        ...prev,
                        dueDate: date.toDateString(),
                        dueTime: dueTimeLabel,
                      }));
                    }}
                    materialDateLabel="Due Date"
                    materialTimeLabel="Due Time"
                    materialDateClassName="gap-2"
                    materialTimeClassName="gap-2"
                    materialDateLabelClassName="text-[10px] font-jakarta-bold uppercase tracking-widest text-on-secondary-fixed-variant/70"
                    materialTimeLabelClassName="text-[10px] font-jakarta-bold uppercase tracking-widest text-on-secondary-fixed-variant/70"
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
                      <Image
                        source={{ uri: task.assignee.avatar }}
                        className="w-10 h-10 rounded-full border-2 border-primary"
                        resizeMode="cover"
                      />
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
                    className={`flex-row items-center gap-4 p-4 bg-white ${index < task.subTasks.length - 1 ? "border-b border-border/30" : ""
                      }`}
                  >
                    <TouchableOpacity
                      onPress={() => toggleSubTask(subTask.id)}
                      className={`w-5 h-5 rounded-md border-2 items-center justify-center ${subTask.completed
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
                      className={`flex-1 text-sm font-jakarta-medium ${subTask.completed
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
                disabled={isUpdating}
                className={`flex-row items-center gap-2 px-6 py-3 rounded-full active:scale-95 ${isUpdating ? "bg-primary/40" : "bg-primary"
                  }`}
                accessibilityLabel="Update this task"
              >
                <MaterialIcons name="edit" size={16} color="#fff" />
                <Text className="text-white text-xs font-jakarta-bold uppercase tracking-widest">
                  {isUpdating ? "Updating..." : "Update Task"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                className="flex-row items-center gap-2 text-error px-6 py-3 rounded-full active:scale-95"
                accessibilityLabel="Delete this task"
              >
                <MaterialIcons name="delete" size={16} color="#ef4444" />
                <Text className="text-error text-xs font-jakarta-bold uppercase tracking-widest">
                  Delete Task
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
