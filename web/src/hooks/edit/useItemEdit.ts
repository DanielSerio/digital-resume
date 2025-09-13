import { useEditModeStore } from '@/stores';

/**
 * Hook for collection edit state (Education, WorkExperience)
 * Handles both adding new items and editing existing items
 */
export function useItemEdit<T extends { id: number }>(
  itemType: 'education' | 'workExperience',
  items: T[]
) {
  const { currentEdit, setCurrentEdit, clearCurrentEdit, isEditingAnything } = useEditModeStore();

  const addType = itemType === 'education' ? 'addEducation' : 'addWorkExperience';

  // Derived state
  const isAdding = currentEdit?.type === addType;
  const editingItemId = currentEdit?.type === itemType ? currentEdit.itemId : null;
  const editingItem = editingItemId
    ? items.find(item => item.id === editingItemId) || null
    : null;

  const canEdit = !isEditingAnything() || currentEdit?.type?.includes(itemType.charAt(0).toUpperCase() + itemType.slice(1));

  // Actions
  const startAdd = () => {
    if (isEditingAnything() && !canEdit) return false;
    setCurrentEdit({ type: addType as any });
    return true;
  };

  const startEditItem = (item: T) => {
    if (isEditingAnything() && !canEdit) return false;
    setCurrentEdit({ type: itemType, itemId: item.id });
    return true;
  };

  const cancelEdit = () => {
    clearCurrentEdit();
  };

  const completeAdd = () => {
    clearCurrentEdit();
  };

  const completeEditItem = () => {
    clearCurrentEdit();
  };

  const deleteItem = () => {
    clearCurrentEdit();
  };

  return {
    // State
    isAdding,
    editingItemId,
    editingItem,
    canEdit,
    isEditingAnything: isEditingAnything(),

    // Computed state helpers
    isEditingItem: (itemId: number) => editingItemId === itemId,
    shouldDisableEdit: (itemId: number) => isEditingAnything() && editingItemId !== itemId,

    // Actions
    startAdd,
    startEditItem,
    cancelEdit,
    completeAdd,
    completeEditItem,
    deleteItem,

    // Direct access to store actions (for special cases)
    setCurrentEdit,
    clearCurrentEdit,
  };
}