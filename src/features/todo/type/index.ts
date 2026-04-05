import type { TodoCategory } from "@/src/constants/todo";
import { User } from "@/src/store/AuthStore";

export interface TodoColumn {
  id?: number;
  eventId: number | null;
  task: string | null;
  isDone: boolean | null;
  category: TodoCategory | string | null;
  assigned_to: number;
  assigned_user: User;
  title: string | null;
  parentId: number | null;
  dueDate: Date | string | null;
  status: string | null;
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface TODOListResponse {
  data: TodoColumn[];

}
export interface CreateTodoPayload {
  eventId: number;
  task: string;
  category: TodoCategory | null;
  assigned_to?: number | null;
  title?: string | null;
  parentId?: number | null;
  dueDate?: Date | string | null;
  status?: string | null;
}
