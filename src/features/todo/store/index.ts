import { create } from "zustand";
import { TodoColumn} from "../type/index";

interface TodoStoreInterface {
  todoDraft: TodoColumn | null;
  setTodoDetail: (detail: TodoColumn) => void;
  clearTodoDetail: () => void;
}

export const useTodoDraftStore = create<TodoStoreInterface>((set) => ({
  todoDraft: null,
  setTodoDetail: (detail) => set({ todoDraft: detail }),
  clearTodoDetail: () => set({ todoDraft: null }),
}));

