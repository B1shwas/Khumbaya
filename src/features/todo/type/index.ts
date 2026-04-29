import type { TodoCategory } from "@/src/constants/todo";
import { User } from "@/src/store/AuthStore";

export interface TodoColumn {
  id?: number;
  eventId: number | null;
  task: string | null;
  isDone: boolean | null;
  category: TodoCategory | string | null;
  assignedTo: number;
  assignedUser: User;
  title: string | null;
  parentId: number | null;
  dueDate: Date | string | null;
  status: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}

export interface TODOListResponse {
  data: TodoColumn[];

}

export type CreateTodoPayload = Omit<TodoColumn, "id" | "createdAt" | "updatedAt">;  
