import { create } from "zustand";

export type ChecklistTaskDraft = {
    title: string;
    dueDate?: string | null;
    assigneeName?: string;
    assigneeAvatar?: string;
    isDone?: boolean;
    statusDotClassName?: string;
    usePersonIcon?: boolean;
};

type ChecklistDraftState = {
    draft: ChecklistTaskDraft | null;
    setDraft: (draft: ChecklistTaskDraft) => void;
    clearDraft: () => void;
};

export const useChecklistDraftStore = create<ChecklistDraftState>((set) => ({
    draft: null,
    setDraft: (draft) => set({ draft }),
    clearDraft: () => set({ draft: null }),
}));