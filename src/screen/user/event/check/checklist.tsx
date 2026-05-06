import { TODO_ALL_CATEGORY, type TodoCategoryFilter } from "@/src/constants/todo";
import { useBulkUpdateTodoStatus, useDeleteTodo, useTodosByEventId } from "@/src/features/todo/hooks/useTodo";
import { useTodoDraftStore, useTodoListStore } from "@/src/features/todo/store";
import type { TodoColumn } from "@/src/features/todo/type";
import { useAuthStore } from "@/src/store/AuthStore";
import { filterTaskByDueDate, type DueDateFilter } from "@/src/utils/dateFilters";
import { useDebounce } from "@/src/utils/helper";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";
import ChecklistTaskItem from "./ChecklistTaskItem";
import { DueDateFilterModal } from "./DueDateFilterModal";

export type ChecklistTask = TodoColumn;


export default function ChecklistScreen() {
  const router = useRouter();
  const { eventId: eventId, isGuest
  } = useLocalSearchParams<{ eventId?: string | string[]; isGuestview?: string; isGuest?: string }>();

  if (Number(eventId) && isNaN(Number(eventId))) {
    throw new Error("Invalid eventId");
  }
  const [selectedCategory, setSelectedCategory] = useState<TodoCategoryFilter>(TODO_ALL_CATEGORY);
  const [selectedDueDate, setSelectedDueDate] = useState<DueDateFilter>(null);
  const [showAssignedToMe, setShowAssignedToMe] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const isGuestView = isGuest === "true";
  const { user } = useAuthStore();
  
  const { clearTodoDetail, setTodoDetail } = useTodoDraftStore();
  const { todos, setTodos, toggleTodoStatus , clearTodos } = useTodoListStore();

  const { data: todosList, refetch, isLoading, isFetching } = useTodosByEventId(eventId as string);
  const { mutate: deleteTodo, isPending: isDeletingTodo } = useDeleteTodo();
  const { mutateAsync: bulkAsync } = useBulkUpdateTodoStatus();


  const debouncedTodos = useDebounce(todos, 1000);

  useEffect(() => {
    if (debouncedTodos.length === 0) return;
    const updates = debouncedTodos
      .filter((t) => {
        const original = todosList?.find((task: ChecklistTask) => task.id === t.id);
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
            deleteTodo({ id: todoId, eventId: eventId as string });
          },
        },
      ]);
    },
    [deleteTodo, eventId]
  );


  const filteredTodos = useMemo(() => {
    return todos.filter((todo: any) => {
      // Filter by category
      if (selectedCategory !== TODO_ALL_CATEGORY && todo.category !== selectedCategory) {
        return false;
      }

      // Filter by due date
      if (!filterTaskByDueDate(todo.dueDate, selectedDueDate)) {
        return false;
      }

      // Filter by assigned to me
      if (showAssignedToMe && user?.id && todo.assignedTo !== user.id) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, selectedDueDate, showAssignedToMe, todos, user?.id]);

  const handleCreateTask = useCallback(() => {
    if (eventId && !isGuestView) {

      clearTodoDetail();
      clearTodos();
      router.push({
        pathname: "../tasklist/detail",
        params: { eventId: eventId },
      });
    }
  }, [clearTodos, clearTodoDetail, eventId, router, isGuestView]);

  if (isLoading || isFetching) {
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
  return (<>
    <Stack.Screen
      options={{
        title: "Checklist",
        headerRight: () => (
          <View className="flex-row items-center mr-1 rounded-full overflow-hidden border border-border bg-white">
            <Pressable
              onPress={() => setShowFilterModal(true)}
              className="w-20 h-10 items-center justify-center"
            >
              <MaterialIcons
                name="tune"
                size={18}
                color={(selectedDueDate || showAssignedToMe) ? "#C2185B" : "#64748b"}
              />
            </Pressable>
            {/* GUESTVIEW */}
            {!isGuestView && (
              <>
                <View className="w-px h-5 bg-border" />
                <Pressable
                  onPress={handleCreateTask}
                  className="w-12 h-10 items-center justify-center"
                >
                  <MaterialIcons name="add" size={22} color="#E91E8C" />
                </Pressable>
              </>
            )}
          </View>
        ),
      }}
    />
    <ScrollView
      showsVerticalScrollIndicator={true}
      className="flex-1 p-1"
    >
      <View className=" gap-4 px-4 mt-2">

        {filteredTodos.length === 0 ? (
          <View className="bg-white rounded-xl p-6 items-center border border-border">
            <MaterialIcons name="playlist-add-check-circle" size={40} color="#cbd5e1" />
            <Text className="text-base font-semibold text-text-secondary mt-3">
              {selectedCategory === TODO_ALL_CATEGORY
                ? "No tasks yet"
                : `No tasks in ${selectedCategory}`}
            </Text>
            <Text className="text-sm text-text-tertiary mt-1 text-center">
              Start by creating your first todo for this event.
            </Text>

            {!isGuestView && (
              <Pressable
                onPress={handleCreateTask}
                className="mt-4 flex-row items-center gap-2 bg-primary px-4 py-2.5 rounded-md"
              >
                <MaterialIcons name="add" size={16} color="white" />
                <Text className="text-white font-semibold">Create Todo</Text>
              </Pressable>
            )}
          </View>
        ) : (
          filteredTodos.map((task: any) => (
            <ChecklistTaskItem
              key={task.id}
              task={task}
              isDeleting={isDeletingTodo}
              onToggleComplete={() => {
                if (isGuestView) return;
                handleToggleComplete(task);
              }}
              onDeletePress={() => {
                if (isGuestView) return;
                handleDeleteTask(task);
              }}
              onEditPress={() => {
                if (!eventId) {
                  return;
                }
                if (task) {
                  console.log('Setting todo detail for task:', task);
                  setTodoDetail(task);
                }
                router.push({
                  pathname: "../tasklist/detail",
                  params: { eventId: eventId, taskId: task.id, isGuestview: isGuestView ? "true" : undefined },
                });
              }}
            />
          ))
        )}
      </View>
    </ScrollView>

    <Modal
      visible={showFilterModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={() => setShowFilterModal(false)}
      />
      <DueDateFilterModal
        selectedFilter={selectedDueDate}
        onSelectFilter={setSelectedDueDate}
        showAssignedToMe={showAssignedToMe}
        onToggleAssignedToMe={() => setShowAssignedToMe(!showAssignedToMe)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onClose={() => setShowFilterModal(false)}
      />
    </Modal>
  </>
  );
}
