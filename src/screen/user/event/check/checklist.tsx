import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";

import { useDeleteTodo, useTodosByEventId, useUpdateTodo } from "@/src/features/todo/hooks/useTodo";
import { useTodoDraftStore } from "@/src/features/todo/store";
import type { TodoColumn } from "@/src/features/todo/type";
import { useChecklistDraftStore } from "@/src/store/useChecklistDraftStore";
import { formatDate, getChecklistDueMeta } from "@/src/utils/helper";

type ChecklistTask = {
    todoId?: number | null;
    rawTodo?: TodoColumn;
    id: string;
    title: string;
    dueDate?: string | null;
    assigneeName: string;
    assigneeAvatar?: string;
    isDone?: boolean;
    statusDotClassName?: string;
    usePersonIcon?: boolean;
};

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
    const dueMeta = getChecklistDueMeta(task.dueDate);
    const isUrgent = Boolean(dueMeta);
    const showStatusDot = !task.isDone;
    const shouldGlow = task.statusDotClassName === "bg-primary";
    const statusDotClassName = isUrgent
        ? "bg-orange-500"
        : task.statusDotClassName ?? "bg-transparent";

    return (
        <Pressable
            className={`flex-row items-start p-5 rounded-xl mb-4 border ${
                task.isDone
                    ? "bg-surface-secondary border-border"
                    : "bg-surface border-border shadow-sm"
            }`}
            onPress={onToggleComplete}
        >
            <Pressable
                onPress={(event) => {
                    event.stopPropagation?.();
                    onToggleComplete();
                }}
                className={`mt-0.5 w-6 h-6 rounded-sm border-2 flex items-center justify-center mr-4 ${
                    task.isDone
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
                    className={`font-jakarta-semibold text-base leading-snug mb-3 ${
                        task.isDone
                            ? "text-text-tertiary line-through"
                            : "text-text-light"
                    }`}
                >
                    {task.title}
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
                                className={`text-xs font-jakarta-semibold ml-1.5 ${
                                    task.isDone
                                        ? "text-text-disabled"
                                        : "text-text-tertiary"
                                }`}
                            >
                                {formatDate(task.dueDate ?? undefined)}
                            </Text>
                        </View>
                    )}

                    <View className={`flex-row items-center ${task.isDone ? "opacity-50" : ""}`}>
                        <View className="w-5 h-5 rounded-full overflow-hidden border border-white shadow-sm bg-surface-tertiary">
                            {task.assigneeAvatar ? (
                                <Image
                                    source={{ uri: task.assigneeAvatar }}
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
                            {task.assigneeName}
                        </Text>
                    </View>
                </View>

                {showActions ? (
                    <View className="flex-row flex-wrap items-center gap-4">
                        <Pressable
                            onPress={(event) => event.stopPropagation?.()}
                            className={`flex-row items-center px-2 py-1 -ml-2 rounded-sm ${
                                task.isDone ? "opacity-50" : "active:bg-primary/5"
                            }`}
                            disabled={task.isDone}
                        >
                            <MaterialIcons
                                name="add"
                                size={18}
                                color={task.isDone ? "#9CA3AF" : "#ee2b8c"}
                            />
                            <Text
                                className={`text-xs font-jakarta-bold ml-1.5 ${
                                    task.isDone ? "text-text-disabled" : "text-primary"
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

                {showStatusDot ? (
                    <View
                        className={`w-2 h-2 rounded-full mt-2 ${
                            shouldGlow
                                ? "bg-primary shadow-lg shadow-primary/40"
                                : statusDotClassName
                        }`}
                    />
                ) : null}
            </View>
        </Pressable>
    );
};

export default function ChecklistScreen() {
    const router = useRouter();
    const { eventId } = useLocalSearchParams<{ eventId?: string | string[] }>();
    const resolvedEventId = Array.isArray(eventId) ? eventId[0] : eventId;
    const { clearDraft, setDraft } = useChecklistDraftStore();
    const { clearTodoDetail, setTodoDetail } = useTodoDraftStore();
    const parsedEventId = resolvedEventId ? Number(resolvedEventId) : null;
    const eventIdNumber = Number.isFinite(parsedEventId)
        ? (parsedEventId as number)
        : null;

    const { data: todosData, refetch } = useTodosByEventId(eventIdNumber);
    const { mutate: updateTodo, isPending: isUpdatingTodo } = useUpdateTodo();
    const { mutate: deleteTodo, isPending: isDeletingTodo } = useDeleteTodo();
    const todosList = useMemo<TodoColumn[]>(() => {
        if (Array.isArray(todosData)) return todosData as TodoColumn[];
        if (Array.isArray(todosData?.items)) return todosData.items as TodoColumn[];
        if (Array.isArray(todosData?.data)) return todosData.data as TodoColumn[];
        return [];
    }, [todosData]);

    const tasks: ChecklistTask[] = useMemo(
        () =>
            todosList.map((todo: TodoColumn, index: number) => {
                const dueDate = todo.dueDate instanceof Date
                    ? todo.dueDate.toISOString()
                    : todo.dueDate ?? null;

                return {
                    todoId: typeof todo.id === "number" ? todo.id : null,
                    rawTodo: todo,
                    id: String(todo.id ?? index),
                    title: todo.title ?? todo.task ?? "Untitled task",
                    dueDate,
                    assigneeName: todo.assigned_to
                        ? `User #${todo.assigned_to}`
                        : "Unassigned",
                    isDone: Boolean(todo.isDone),
                };
            }),
        [todosList]
    );

    const handleToggleComplete = useCallback(
        (task: ChecklistTask) => {
            if (typeof task.todoId !== "number") return;

            const nextIsDone = !Boolean(task.isDone);
            updateTodo({
                id: task.todoId,
                payload: {
                    isDone: nextIsDone,
                    status: nextIsDone ? "completed" : "pending",
                },
                eventId: eventIdNumber,
            });
        },
        [eventIdNumber, updateTodo]
    );

    const handleDeleteTask = useCallback(
        (task: ChecklistTask) => {
            if (typeof task.todoId !== "number") return;
            const todoId = task.todoId;

            Alert.alert("Delete task", "Are you sure you want to delete this task?", [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteTodo({ id: todoId, eventId: eventIdNumber });
                    },
                },
            ]);
        },
        [deleteTodo, eventIdNumber]
    );

    useEffect(() => {
        clearDraft();
            clearTodoDetail();
        }, [clearDraft, clearTodoDetail]);

    useFocusEffect(
        useCallback(() => {
            if (eventIdNumber) {
                refetch();
            }
        }, [eventIdNumber, refetch])
    );
    const completedCount = useMemo(
        () => tasks.filter((task) => task.isDone).length,
        [tasks]
    );
    const completionPercent = useMemo(() => {
        if (!tasks.length) return 0;
        return Math.round((completedCount / tasks.length) * 100);
    }, [completedCount, tasks.length]);

    return (
    <ScrollView
    showsVerticalScrollIndicator={true}
    className="flex-1 p-1"
    >
    <View className=" gap-4 px-4 mt-2">
        <View className=" relative overflow-hidden rounded-2xl p-8 bg-white shadow-sm">
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
             {/* Buttons Container */}
      <View className="flex-row gap-2 w-full md:w-auto">
        {/* New Task Button - Primary */}
        <Pressable 
          className="flex-row items-center gap-2 bg-primary px-6 py-3 rounded-xl 
                     shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    onPress={() => {
                        setDraft({
                                title: "",
                                dueDate: null,
                                assigneeName: "",
                                isDone: false,
                        });
                        if (resolvedEventId) {
                            router.push({
                                pathname:
                                    "/(protected)/(client-stack)/events/[eventId]/(organizer)/tasklist/create",
                                params: { eventId: resolvedEventId },
                            });
                        }
                    }}
        >
          <MaterialIcons name="add" size={20} color="white" />
          <Text className="text-white font-bold text-base">New Task</Text>
        </Pressable>

      </View>

      
        {tasks.map((task) => (
            <ChecklistTaskItem
                key={task.id}
                task={task}
                isUpdating={isUpdatingTodo}
                isDeleting={isDeletingTodo}
                onToggleComplete={() => handleToggleComplete(task)}
                onDeletePress={() => handleDeleteTask(task)}
                onEditPress={() => {
                    if (!resolvedEventId) {
                        return;
                    }
                    if (task.rawTodo) {
                        setTodoDetail(task.rawTodo);
                    }
                    router.push({
                        pathname:
                            "/(protected)/(client-stack)/events/[eventId]/(organizer)/tasklist/detail",
                        params: { eventId: resolvedEventId, taskId: task.id },
                    });
                }}
            />
        ))}
    </View>
</ScrollView> 
    );
}
