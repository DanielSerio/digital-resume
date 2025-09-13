import { create } from 'zustand';

export type EditContext =
  | { type: 'contact' }
  | { type: 'summary' }
  | { type: 'skills' }
  | { type: 'addSkill' }
  | { type: 'education'; itemId: number }
  | { type: 'workExperience'; itemId: number }
  | { type: 'addEducation' }
  | { type: 'addWorkExperience' }
  | null;

interface EditModeState {
  currentEdit: EditContext;
  setCurrentEdit: (context: EditContext) => void;
  clearCurrentEdit: () => void;
  isEditingAnything: () => boolean;
  isEditingContext: (context: EditContext) => boolean;
}

export const useEditModeStore = create<EditModeState>((set, get) => ({
  currentEdit: null,

  setCurrentEdit: (context) => set({ currentEdit: context }),

  clearCurrentEdit: () => set({ currentEdit: null }),

  isEditingAnything: () => get().currentEdit !== null,

  isEditingContext: (context) => {
    const current = get().currentEdit;
    if (!current || !context) return false;

    // Deep comparison for context objects
    return JSON.stringify(current) === JSON.stringify(context);
  },
}));