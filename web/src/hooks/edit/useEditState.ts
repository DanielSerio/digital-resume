import { useEditModeStore } from '@/stores';

/**
 * Hook for simple section edit state (Contact, Summary, Skills)
 * Provides common edit operations for sections without sub-items
 */
export function useEditState(sectionType: 'contact' | 'summary' | 'skills') {
  const { currentEdit, setCurrentEdit, clearCurrentEdit, isEditingAnything } = useEditModeStore();

  // Derived state
  const isEditing = currentEdit?.type === sectionType;
  const canEdit = !isEditingAnything() || isEditing;

  // Actions
  const startEdit = () => {
    if (isEditingAnything() && !isEditing) return false;
    setCurrentEdit({ type: sectionType });
    return true;
  };

  const cancelEdit = () => {
    clearCurrentEdit();
  };

  const completeEdit = () => {
    clearCurrentEdit();
  };

  return {
    // State
    isEditing,
    canEdit,
    isEditingAnything: isEditingAnything(),

    // Actions
    startEdit,
    cancelEdit,
    completeEdit,

    // Direct access to store actions (for special cases)
    setCurrentEdit,
    clearCurrentEdit,
  };
}