
import api from "@/src/api/axios";
import type { CreateTodoPayload, TodoColumn } from "../type";

export const getTodosApi = async () => {
  const response = await api.get("/todo");
  console.log("getTodosApi response:", response.data);
  return response.data?.data ?? response.data;
};

export const getTodosByEventIdApi = async (eventId: number) => {
  const response = await api.get(`/todo/event/${eventId}`);
  return response.data?.data ?? response.data;
};

export const getTodoByIdApi = async (id: number) => {
  const response = await api.get(`/todo/${id}`);
  return response.data?.data ?? response.data;
};

export const createTodoApi = async (payload: CreateTodoPayload) => {
  const response = await api.post("/todo", payload);
  return response.data?.data ?? response.data;
};
export const deleteTodoApi = async (id: number) => {
  const response = await api.delete(`/todo/${id}`);
  return response.data?.data ?? response.data;
}

export const updateTodoApi = async (
  id: number,
  payload: Partial<TodoColumn>
) => {
  const response = await api.patch(`/todo/${id}`, payload);
  return response.data?.data ?? response.data;
};
