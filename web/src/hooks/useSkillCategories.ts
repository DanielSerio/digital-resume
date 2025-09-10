import { useMemo } from 'react';
import { useSkillCategoriesData, useSkillSubcategoriesData } from './useResumeData';
import { useCreateSkillCategory, useCreateSkillSubcategory } from './useResumeMutations';
import type { SkillCategory, SkillSubcategory } from '@/types';

// Hook for skill categories with creation capability
export const useSkillCategories = () => {
  const { data: categories = [], isLoading, error } = useSkillCategoriesData();
  const createCategoryMutation = useCreateSkillCategory();

  // Memoize category options for dropdowns
  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories]
  );

  // Function to create new category
  const createCategory = async (name: string): Promise<SkillCategory> => {
    const result = await createCategoryMutation.mutateAsync({ name });
    return result;
  };

  // Check if category exists by name
  const categoryExists = (name: string): boolean => {
    return categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    );
  };

  return {
    categories,
    categoryOptions,
    isLoading,
    error,
    createCategory,
    categoryExists,
    isCreating: createCategoryMutation.isPending,
    createError: createCategoryMutation.error,
  };
};

// Hook for skill subcategories with creation capability
export const useSkillSubcategories = () => {
  const { data: subcategories = [], isLoading, error } = useSkillSubcategoriesData();
  const createSubcategoryMutation = useCreateSkillSubcategory();

  // Memoize subcategory options for dropdowns
  const subcategoryOptions = useMemo(
    () =>
      subcategories.map((subcategory) => ({
        value: subcategory.id,
        label: subcategory.name,
      })),
    [subcategories]
  );

  // Function to create new subcategory
  const createSubcategory = async (name: string): Promise<SkillSubcategory> => {
    const result = await createSubcategoryMutation.mutateAsync({ name });
    return result;
  };

  // Check if subcategory exists by name
  const subcategoryExists = (name: string): boolean => {
    return subcategories.some(
      (subcategory) => subcategory.name.toLowerCase() === name.toLowerCase()
    );
  };

  return {
    subcategories,
    subcategoryOptions,
    isLoading,
    error,
    createSubcategory,
    subcategoryExists,
    isCreating: createSubcategoryMutation.isPending,
    createError: createSubcategoryMutation.error,
  };
};

// Combined hook for both categories and subcategories
export const useSkillTaxonomy = () => {
  const categories = useSkillCategories();
  const subcategories = useSkillSubcategories();

  // Loading state - true if either is loading
  const isLoading = categories.isLoading || subcategories.isLoading;

  // Combined error state
  const error = categories.error || subcategories.error;

  // Helper to get category name by ID
  const getCategoryName = (categoryId: number): string => {
    const category = categories.categories.find((cat) => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  // Helper to get subcategory name by ID
  const getSubcategoryName = (subcategoryId: number): string => {
    const subcategory = subcategories.subcategories.find(
      (subcat) => subcat.id === subcategoryId
    );
    return subcategory?.name || 'Unknown Subcategory';
  };

  // Helper to create category/subcategory combinations
  const createCategorySubcategoryPairs = () => {
    const pairs: Array<{
      categoryId: number;
      categoryName: string;
      subcategoryId: number;
      subcategoryName: string;
      combinedLabel: string;
    }> = [];

    categories.categories.forEach((category) => {
      subcategories.subcategories.forEach((subcategory) => {
        pairs.push({
          categoryId: category.id,
          categoryName: category.name,
          subcategoryId: subcategory.id,
          subcategoryName: subcategory.name,
          combinedLabel: `${category.name} - ${subcategory.name}`,
        });
      });
    });

    return pairs;
  };

  return {
    categories,
    subcategories,
    isLoading,
    error,
    getCategoryName,
    getSubcategoryName,
    createCategorySubcategoryPairs,
  };
};

// Hook for hybrid dropdown functionality (existing + new options)
export const useHybridDropdown = <T extends { id: number; name: string }>() => {
  // Generic helper for hybrid dropdown behavior
  const createHybridOptions = (
    items: T[],
    newItemValue: string = '__NEW__'
  ) => {
    const existingOptions = items.map((item) => ({
      value: item.id.toString(),
      label: item.name,
      isExisting: true,
    }));

    const newOption = {
      value: newItemValue,
      label: 'Add new...',
      isExisting: false,
    };

    return [...existingOptions, newOption];
  };

  const isNewItemSelected = (value: string, newItemValue: string = '__NEW__') => {
    return value === newItemValue;
  };

  return {
    createHybridOptions,
    isNewItemSelected,
  };
};