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
  const isEditingCategory = currentEdit?.type === 'skillCategory';
  const currentEditCategory = isEditingCategory ? (currentEdit as { type: 'skillCategory'; categoryName: string }).categoryName : null;
  const canEdit = !isEditingAnything() || isEditing || isAddingSkill || isEditingCategory;

  // Actions
  const startEdit = () => {
    if (isEditingAnything() && !isEditing && !isAddingSkill) return false;
    setCurrentEdit({ type: 'skills' });
    return true;
  };

  const startAddSkill = () => {
    if (isEditingAnything() && !isEditing && !isAddingSkill && !isEditingCategory) return false;
    setCurrentEdit({ type: 'addSkill' });
    return true;
  };

  const startEditCategory = (categoryName: string) => {
    if (isEditingAnything() && currentEditCategory !== categoryName) return false;
    setCurrentEdit({ type: 'skillCategory', categoryName });
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
    isEditingCategory,
    currentEditCategory,
    canEdit,
    isEditingAnything: isEditingAnything(),

    // Actions
    startEdit,
    startAddSkill,
    startEditCategory,
    cancelEdit,
    completeEdit,
    completeAddSkill,

    // Direct access to store actions (for special cases)
    setCurrentEdit,
    clearCurrentEdit,
  };
}