import { Text } from "@/src/components/ui/Text";
import { isTodoCategory, TODO_CATEGORY_OPTIONS, type TodoCategory } from "@/src/constants/todo";
import { useGetEventOwner } from "@/src/features/events/hooks/use-event";
import { useCreateTodo, useDeleteTodo, useTodoById, useUpdateTodo } from "@/src/features/todo/hooks/useTodo";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function DetailedChecklist() {
  const router = useRouter();
  const { eventId, taskId } = useLocalSearchParams<{ eventId: string; taskId?: string }>();

  const parsedEventId = Number(eventId);
  const parsedTaskId = taskId ? Number(taskId) : null;
  const isEditMode = !!parsedTaskId;

  // Hooks
  const { data: todoData, isLoading: isLoadingTodo } = useTodoById(parsedTaskId);
  const { mutate: createTodo, isPending: isCreating } = useCreateTodo();
  const { mutate: updateTodo, isPending: isUpdating } = useUpdateTodo();
  const { mutate: deleteTodo, isPending: isDeleting } = useDeleteTodo();
  const { data: eventOwners } = useGetEventOwner(parsedEventId);

  // Form State
  const [title, setTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [category, setCategory] = useState<TodoCategory | "">("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [assignedTo, setAssignedTo] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

  // Sync data in edit mode
  useEffect(() => {
    if (isEditMode && todoData) {
      setTitle(todoData.title || "");
      setTaskDetails(todoData.task || "");
      const existingCategory = todoData.category
      setCategory(existingCategory && isTodoCategory(existingCategory) ? existingCategory : "");
      setDueDate(todoData.dueDate ? new Date(todoData.dueDate) : null);
      setAssignedTo(todoData.assigned_to || null);
    }
  }, [isEditMode, todoData]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    const payload = {
      eventId: parsedEventId,
      title: title.trim(),
      task: taskDetails.trim(),
      category: category || null,
      dueDate: dueDate ? dueDate.toISOString() : null,
      assignedTo: assignedTo ?? undefined,
    };

    if (isEditMode && parsedTaskId) {
      updateTodo(
        { id: parsedTaskId, payload, eventId: parsedEventId },
        {
          onSuccess: () => {
            // Alert.alert("Success", "Task updated successfully");
            router.back();
          },
          onError: (error) => {
            Alert.alert("Error", "Failed to update task");
          }
        }
      );
    } else {
      createTodo(
        payload ,
        {
          onSuccess: () => {
            // Alert.alert("Success", "Task created successfully");
            router.back();
          },
          onError: (error) => {
            Alert.alert("Error", "Failed to create task");
          }
        }
      );
    }
  };

  const handleDelete = () => {
    if (!parsedTaskId) return;

    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteTodo(
            { id: parsedTaskId, eventId: parsedEventId },
            {
              onSuccess: () => {
                router.back();
              },
            }
          );
        },
      },
    ]);
  };

  if (isEditMode && isLoadingTodo) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#ee2b8c" />
      </View>
    );
  }

  const assigneeData = (eventOwners || []).map((owner) => ({
    label: owner.user.username,
    value: owner.user.id,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-surface">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-8 pb-32"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="mb-8">
            <Text className="text-3xl font-jakarta-bold text-text-primary">
              {isEditMode ? "Task Details" : "New Task"}
            </Text>
            <Text className="text-text-tertiary mt-2">
              {isEditMode ? "View and manage your task details." : "Create a new task for your event."}
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-md p-6 shadow-sm border border-border gap-6 mb-8">
            {/* Title Input */}
            <View className="gap-2">
              <Text className="text-sm font-jakarta-semibold text-text-secondary ml-1">
                Task Title
              </Text>
              <TextInput
                className="w-full h-14 bg-surface-secondary px-4 rounded-md text-text-primary border border-border focus:border-primary"
                placeholder="e.g., Book the caterer"
                placeholderTextColor="#94a3b8"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Description/Task Details */}
            <View className="gap-2">
              <Text className="text-sm font-jakarta-semibold text-text-secondary ml-1">
                Description
              </Text>
              <TextInput
                className="w-full bg-surface-secondary px-4 py-3 rounded-md text-text-primary border border-border focus:border-primary"
                placeholder="Add more details about this task..."
                placeholderTextColor="#94a3b8"
                value={taskDetails}
                onChangeText={setTaskDetails}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Category Dropdown */}
            <View className="gap-2">
              <Text className="text-sm font-jakarta-semibold text-text-secondary ml-1">
                Category
              </Text>
              <Dropdown
                style={{
                  height: 56,
                  backgroundColor: "#f8fafc",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                }}
                placeholderStyle={{ color: "#94a3b8", fontSize: 14 }}
                selectedTextStyle={{ color: "#1e293b", fontSize: 14, fontWeight: "600" }}
                data={TODO_CATEGORY_OPTIONS}
                labelField="label"
                valueField="value"
                placeholder="Select category"
                value={category || null}
                onChange={(item: { value: TodoCategory }) => setCategory(item.value)}
                renderLeftIcon={() => (
                  <MaterialIcons name="label-outline" size={20} color="#64748b" style={{ marginRight: 8 }} />
                )}
              />
            </View>

            {/* Assignee Dropdown */}
            <View className="gap-2">
              <Text className="text-sm font-jakarta-semibold text-text-secondary ml-1">
                Assigned To
              </Text>
              <Dropdown
                style={{
                  height: 56,
                  backgroundColor: "#f8fafc",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                }}
                placeholderStyle={{ color: "#94a3b8", fontSize: 14 }}
                selectedTextStyle={{ color: "#1e293b", fontSize: 14, fontWeight: "600" }}
                data={assigneeData}
                labelField="label"
                valueField="value"
                placeholder="Select an assignee"
                value={assignedTo}
                onChange={(item: any) => setAssignedTo(item.value)}
                renderLeftIcon={() => (
                  <MaterialIcons name="person-outline" size={20} color="#64748b" style={{ marginRight: 8 }} />
                )}
              />
            </View>

            {/* Due Date & Time Picker */}
            <View className="gap-2">
              <Text className="text-sm font-jakarta-semibold text-text-secondary ml-1">
                Due Date & Time
              </Text>
              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => {
                    setPickerMode("date");
                    setShowDatePicker(true);
                  }}
                  className="flex-1 h-14 bg-surface-secondary px-4 rounded-md border border-border flex-row items-center justify-between"
                >
                  <View className="flex-row items-center">
                    <MaterialIcons name="calendar-today" size={20} color="#64748b" />
                    <Text className="ml-3 text-text-primary font-jakarta-semibold">
                      {dueDate ? dueDate.toLocaleDateString() : "Set date"}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setPickerMode("time");
                    setShowDatePicker(true);
                  }}
                  className="flex-1 h-14 bg-surface-secondary px-4 rounded-md border border-border flex-row items-center justify-between"
                >
                  <View className="flex-row items-center">
                    <MaterialIcons name="access-time" size={20} color="#64748b" />
                    <Text className="ml-3 text-text-primary font-jakarta-semibold">
                      {dueDate ? dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Set time"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode={pickerMode}
                  is24Hour={false}
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      if (pickerMode === "date") {
                        const newDate = new Date(dueDate || new Date());
                        newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                        setDueDate(newDate);
                      } else {
                        const newDate = new Date(dueDate || new Date());
                        newDate.setHours(date.getHours(), date.getMinutes());
                        setDueDate(newDate);
                      }
                    }
                  }}
                  minimumDate={new Date()}
                />
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-4">
            <TouchableOpacity
              onPress={handleSave}
              disabled={isCreating || isUpdating || isDeleting}
              className="h-14 bg-primary rounded-xl flex-row items-center justify-center shadow-lg shadow-primary/25"
              activeOpacity={0.8}
            >
              {(isCreating || isUpdating) ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialIcons name="check" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text className="text-white font-jakarta-bold text-base">
                    {isEditMode ? "Update Task" : "Create Task"}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {isEditMode && (
              <TouchableOpacity
                onPress={handleDelete}
                disabled={isCreating || isUpdating || isDeleting}
                className="h-14 border border-red-100 bg-red-50 rounded-xl flex-row items-center justify-center"
                activeOpacity={0.8}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#ef4444" />
                ) : (
                  <>
                    <MaterialIcons name="delete-outline" size={20} color="#ef4444" style={{ marginRight: 8 }} />
                    <Text className="text-red-500 font-jakarta-bold text-base">
                      Delete Task
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
