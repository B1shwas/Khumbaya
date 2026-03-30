import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { useBulkUpdateTodoStatus, useDeleteTodo, useTodosByEventId } from "@/src/features/todo/hooks/useTodo";
import { useTodoDraftStore, useTodoListStore } from "@/src/features/todo/store";
import type { TodoColumn } from "@/src/features/todo/type";
import { useChecklistDraftStore } from "@/src/store/useChecklistDraftStore";
import { useDebounce } from "@/src/utils/helper";
import ChecklistTaskItem from "./ChecklistTaskItem";

export type ChecklistTask = TodoColumn;


export default function ChecklistScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId?: string | string[] }>();

  const { clearDraft } = useChecklistDraftStore();
  const { clearTodoDetail, setTodoDetail } = useTodoDraftStore();
  const { todos, setTodos, toggleTodoStatus } = useTodoListStore();

  const parsedEventId = eventId ? Number(eventId) : null;

  if (parsedEventId && isNaN(parsedEventId)) {
    throw new Error("Invalid eventId");
  }
  const { data: todosList, refetch, isLoading } = useTodosByEventId(parsedEventId);
  const { mutate: deleteTodo, isPending: isDeletingTodo } = useDeleteTodo();
  const { mutateAsync: bulkAsync } = useBulkUpdateTodoStatus();


  useEffect(() => {
    if (todosList && todosList.length > 0) {
      setTodos(todosList);
    }
  }, [todosList]);

  const debouncedTodos = useDebounce(todos, 1000);

  useEffect(() => {
    if (debouncedTodos.length === 0) return;
    const updates = debouncedTodos
      .filter((t) => {
        const original = todosList?.find((o: ChecklistTask) => o.id === t.id);
        return original && Boolean(original.isDone) !== Boolean(t.isDone);
      })
      .map((t) => ({
        todoId: t.id as number,
        isDone: Boolean(t.isDone),
        status: t.isDone ? "completed" : "pending",
      }));

    if (updates.length > 0) {
      bulkAsync(updates)
    }
  }, [debouncedTodos, bulkAsync, todosList]);

  const handleToggleComplete = useCallback(
    (task: ChecklistTask) => {
      if (typeof task.id !== "number") return;
      toggleTodoStatus(task.id);
    },
    [toggleTodoStatus]
  );

  const handleDeleteTask = useCallback(
    (task: ChecklistTask) => {
      if (typeof task.id !== "number") return;
      const todoId = task.id;

      Alert.alert("Delete task", "Are you sure you want to delete this task?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteTodo({ id: todoId, eventId: parsedEventId });
          },
        },
      ]);
    },
    [deleteTodo, parsedEventId]
  );

  useEffect(() => {
    clearDraft();
    clearTodoDetail();
  }, [clearDraft, clearTodoDetail]);


  const completedCount = useMemo(
    () => todos.filter((task) => task.isDone).length,
    [todos]
  );
  const completionPercent = useMemo(() => {
    if (!todos.length) return 0;
    return Math.round((completedCount / todos.length) * 100);
  }, [completedCount, todos.length]);

  if (isLoading) {
    return (

      <View className="gap-4 px-4 mt-2">
        {/* Header skeleton */}
        <View className="rounded-md p-8 bg-white shadow-sm">
          <View className="h-8 w-3/4 bg-surface-container-highest rounded-md mb-3 animate-pulse" />
          <View className="h-4 w-1/2 bg-surface-container-highest rounded mb-6 animate-pulse" />
          <View className="h-3 w-full bg-surface-container-highest rounded-md animate-pulse" />
        </View>

        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="bg-white rounded-md p-4 shadow-sm">
            <View className="flex-row items-center gap-3">
              <View className="w-6 h-6 rounded-md bg-surface-container-highest animate-pulse" />
              <View className="flex-1 h-4 bg-surface-container-highest rounded animate-pulse" />
            </View>
          </View>
        ))}
      </View>

    );
  }
  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      className="flex-1 p-1"
    >
      <View className=" gap-4 px-4 mt-2">
        <View className=" relative overflow-hidden rounded-md p-8 bg-white shadow-sm">
          <View className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20" />
          <View className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <View>
              <Text className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">
                Gala Night Preparation
              </Text>
              <Text className="text-on-surface-variant font-medium">
                Keep track of every detail for the grand opening.
              </Text>
            </View>
            <View className="w-full md:w-80">
              <View className="flex-row justify-between items-end mb-3">
                <Text className="text-sm font-bold text-primary">
                  Task Completion
                </Text>
                <Text className="text-2xl font-extrabold text-on-surface">
                  {completionPercent}%
                </Text>
              </View>
              <View className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(238,43,140,0.4)]"
                  style={{ width: `${completionPercent}%` }}
                />
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row gap-2 w-full md:w-auto">
          <Pressable
            className="flex-row items-center gap-2 bg-primary px-6 py-3 rounded-md 
                     shadow-lg shadow-primary/20 active:scale-95 transition-all"
            onPress={() => {
              if (parsedEventId) {
                router.push({
                  pathname: "/(protected)/(client-stack)/events/[eventId]/(organizer)/tasklist/detail",
                  params: { eventId: parsedEventId }
                });
              }
            }}
          >
            <MaterialIcons name="add" size={20} color="white" />
            <Text className="text-white font-bold text-base">New Task</Text>
          </Pressable>
        </View>


        {todos.map((task) => (
          <ChecklistTaskItem
            key={task.id}
            task={task}
            isDeleting={isDeletingTodo}
            onToggleComplete={() => handleToggleComplete(task)}
            onDeletePress={() => handleDeleteTask(task)}
            onEditPress={() => {
              if (!parsedEventId) {
                return;
              }
              if (task) {
                setTodoDetail(task);
              }
              router.push({
                pathname:
                  "/(protected)/(client-stack)/events/[eventId]/(organizer)/tasklist/detail",
                params: { eventId: parsedEventId, taskId: task.id },
              });
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}
