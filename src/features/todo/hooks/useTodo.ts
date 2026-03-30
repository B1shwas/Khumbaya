import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTodoApi,
  deleteTodoApi,
  getTodoByIdApi,
  getTodosApi,
  getTodosByEventIdApi,
  updateTodoApi,
} from "../api/todo.service";
import type { CreateTodoPayload, TodoColumn } from "../type";

export const useTodos = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: getTodosApi,
  });
};

export const useTodosByEventId = (eventId: number | null) => {
  return useQuery({
    queryKey: ["todos", "event", eventId],
    queryFn: () => getTodosByEventIdApi(eventId as number),
    enabled: typeof eventId === "number",
  });
};

export const useTodoById = (id: number | null) => {
  return useQuery({
    queryKey: ["todo", id],
    queryFn: () => getTodoByIdApi(id as number),
    enabled: typeof id === "number",
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTodoPayload) => createTodoApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({
        queryKey: ["todos", "event", variables.eventId],
      });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<TodoColumn>;
      eventId?: number | null;
    }) => updateTodoApi(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["todo", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      if (typeof variables.eventId === "number") {
        queryClient.invalidateQueries({
          queryKey: ["todos", "event", variables.eventId],
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["todos", "event"] });
    },
  });
};
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: number;
      eventId?: number | null;
    }) => deleteTodoApi(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["todo", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      if (typeof variables.eventId === "number") {
        queryClient.invalidateQueries({
          queryKey: ["todos", "event", variables.eventId],
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["todos", "event"] });
    },
  });
}