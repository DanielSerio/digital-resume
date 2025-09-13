import { useEditModeStore } from '@/stores';

/**
 * Hook specifically for Skills section edit state
 * Handles both section editing and skill addition
 */
export function useSkillsEdit() {
  const { currentEdit, setCurrentEdit, clearCurrentEdit, isEditingAnything } = useEditModeStore();

  // Derived state
  const isEditing = currentEdit?.type === 'skills';
  const isAddingSkill = currentEdit?.type === 'addSkill';
  const canEdit = !isEditingAnything() || isEditing || isAddingSkill;

  // Actions
  const startEdit = () => {
    if (isEditingAnything() && !isEditing && !isAddingSkill) return false;
    setCurrentEdit({ type: 'skills' });
    return true;
  };

  const startAddSkill = () => {
    if (isEditingAnything() && !isEditing && !isAddingSkill) return false;
    setCurrentEdit({ type: 'addSkill' });
    return true;
  };

  const cancelEdit = () => {
    clearCurrentEdit();
  };

  const completeEdit = () => {
    clearCurrentEdit();
  };

  const completeAddSkill = () => {
    clearCurrentEdit();
  };

  return {
    // State
    isEditing,
    isAddingSkill,
    canEdit,
    isEditingAnything: isEditingAnything(),

    // Actions
    startEdit,
    startAddSkill,
    cancelEdit,
    completeEdit,
    completeAddSkill,

    // Direct access to store actions (for special cases)
    setCurrentEdit,
    clearCurrentEdit,
  };
}