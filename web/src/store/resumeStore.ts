import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// State interface for resume editing
interface ResumeEditingState {
  // Section editing states
  isEditingContact: boolean;
  isEditingSummary: boolean;
  isEditingSkills: boolean;
  isEditingEducation: boolean;
  isEditingWorkExperience: boolean;
  
  // Currently editing items (for tracking which specific item is being edited)
  editingSkillId: number | null;
  editingEducationId: number | null;
  editingWorkExperienceId: number | null;
  
  // Form states
  hasUnsavedChanges: boolean;
  
  // UI states
  selectedScopedResumeId: number | null;
}

// Actions interface
interface ResumeEditingActions {
  // Section editing toggles
  toggleEditingContact: () => void;
  toggleEditingSummary: () => void;
  toggleEditingSkills: () => void;
  toggleEditingEducation: () => void;
  toggleEditingWorkExperience: () => void;
  
  // Set specific item being edited
  setEditingSkillId: (id: number | null) => void;
  setEditingEducationId: (id: number | null) => void;
  setEditingWorkExperienceId: (id: number | null) => void;
  
  // Form state management
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  
  // UI state management
  setSelectedScopedResumeId: (id: number | null) => void;
  
  // Utility actions
  exitAllEditModes: () => void;
  resetStore: () => void;
}

type ResumeStore = ResumeEditingState & ResumeEditingActions;

// Initial state
const initialState: ResumeEditingState = {
  isEditingContact: false,
  isEditingSummary: false,
  isEditingSkills: false,
  isEditingEducation: false,
  isEditingWorkExperience: false,
  editingSkillId: null,
  editingEducationId: null,
  editingWorkExperienceId: null,
  hasUnsavedChanges: false,
  selectedScopedResumeId: null,
};

// Create the store
export const useResumeStore = create<ResumeStore>()(
  devtools(
    (set) => ({
      ...initialState,

      // Section editing toggles
      toggleEditingContact: () =>
        set((state) => ({ 
          isEditingContact: !state.isEditingContact,
          hasUnsavedChanges: false 
        })),
        
      toggleEditingSummary: () =>
        set((state) => ({ 
          isEditingSummary: !state.isEditingSummary,
          hasUnsavedChanges: false 
        })),
        
      toggleEditingSkills: () =>
        set((state) => ({ 
          isEditingSkills: !state.isEditingSkills,
          editingSkillId: null,
          hasUnsavedChanges: false 
        })),
        
      toggleEditingEducation: () =>
        set((state) => ({ 
          isEditingEducation: !state.isEditingEducation,
          editingEducationId: null,
          hasUnsavedChanges: false 
        })),
        
      toggleEditingWorkExperience: () =>
        set((state) => ({ 
          isEditingWorkExperience: !state.isEditingWorkExperience,
          editingWorkExperienceId: null,
          hasUnsavedChanges: false 
        })),

      // Set specific item being edited
      setEditingSkillId: (id) =>
        set({ editingSkillId: id }),
        
      setEditingEducationId: (id) =>
        set({ editingEducationId: id }),
        
      setEditingWorkExperienceId: (id) =>
        set({ editingWorkExperienceId: id }),

      // Form state management
      setHasUnsavedChanges: (hasChanges) =>
        set({ hasUnsavedChanges: hasChanges }),

      // UI state management        
      setSelectedScopedResumeId: (id) =>
        set({ selectedScopedResumeId: id }),

      // Utility actions
      exitAllEditModes: () =>
        set({
          isEditingContact: false,
          isEditingSummary: false,
          isEditingSkills: false,
          isEditingEducation: false,
          isEditingWorkExperience: false,
          editingSkillId: null,
          editingEducationId: null,
          editingWorkExperienceId: null,
          hasUnsavedChanges: false,
        }),
        
      resetStore: () =>
        set(initialState),
    }),
    {
      name: 'resume-store',
      // Only include in devtools during development
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// Selector hooks for performance optimization
export const useEditingStates = () =>
  useResumeStore((state) => ({
    isEditingContact: state.isEditingContact,
    isEditingSummary: state.isEditingSummary,
    isEditingSkills: state.isEditingSkills,
    isEditingEducation: state.isEditingEducation,
    isEditingWorkExperience: state.isEditingWorkExperience,
  }));

export const useEditingActions = () =>
  useResumeStore((state) => ({
    toggleEditingContact: state.toggleEditingContact,
    toggleEditingSummary: state.toggleEditingSummary,
    toggleEditingSkills: state.toggleEditingSkills,
    toggleEditingEducation: state.toggleEditingEducation,
    toggleEditingWorkExperience: state.toggleEditingWorkExperience,
    exitAllEditModes: state.exitAllEditModes,
  }));

export const useUIState = () =>
  useResumeStore((state) => ({
    selectedScopedResumeId: state.selectedScopedResumeId,
    hasUnsavedChanges: state.hasUnsavedChanges,
  }));

export const useUIActions = () =>
  useResumeStore((state) => ({
    setSelectedScopedResumeId: state.setSelectedScopedResumeId,
    setHasUnsavedChanges: state.setHasUnsavedChanges,
  }));