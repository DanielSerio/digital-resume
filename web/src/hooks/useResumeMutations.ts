import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { resumeQueryKeys } from './useResumeData';
import type {
  ContactInput,
  ProfessionalSummaryInput,
  TechnicalSkillInput,
  EducationInput,
  CreateWorkExperienceRequest,
  UpdateWorkExperienceRequest,
  SkillCategory,
  SkillSubcategory,
} from '@/types';

// Contact mutations
export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactInput) => apiClient.put('/contact', data),
    onSuccess: () => {
      // Invalidate and refetch contact and complete resume data
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.contact() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
    meta: {
      errorMessage: 'Failed to update contact information',
    },
  });
};

// Professional Summary mutations
export const useUpdateProfessionalSummary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfessionalSummaryInput) => apiClient.put('/summary', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.summary() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
    meta: {
      errorMessage: 'Failed to update professional summary',
    },
  });
};

// Technical Skills mutations
export const useCreateTechnicalSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TechnicalSkillInput) => apiClient.post('/skills', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.skills() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
    meta: {
      errorMessage: 'Failed to create technical skill',
    },
  });
};

export const useUpdateTechnicalSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TechnicalSkillInput> }) =>
      apiClient.put(`/skills/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.skills() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
    meta: {
      errorMessage: 'Failed to update technical skill',
    },
  });
};

export const useDeleteTechnicalSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/skills/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.skills() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
    meta: {
      errorMessage: 'Failed to delete technical skill',
    },
  });
};

// Education mutations
export const useCreateEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EducationInput) => apiClient.post('/education', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.education() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
    meta: {
      errorMessage: 'Failed to create education entry',
    },
  });
};

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EducationInput> }) =>
      apiClient.put(`/education/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.education() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
    meta: {
      errorMessage: 'Failed to update education entry',
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/education/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.education() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
    meta: {
      errorMessage: 'Failed to delete education entry',
    },
  });
};

// Work Experience mutations (with atomic transaction support)
export const useCreateWorkExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkExperienceRequest) => 
      apiClient.post('/work-experiences', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.workExperiences() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
    meta: {
      errorMessage: 'Failed to create work experience',
    },
  });
};

export const useUpdateWorkExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateWorkExperienceRequest }) =>
      apiClient.put(`/work-experiences/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.workExperiences() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
    meta: {
      errorMessage: 'Failed to update work experience',
    },
  });
};

// Global deletion tracking - persists across all hook instances
const globalDeletionState = {
  deletingIds: new Set<number>(),

  startDeletion(id: number): boolean {
    if (this.deletingIds.has(id)) {
      return false; // Already deleting
    }
    this.deletingIds.add(id);
    return true; // Started deletion
  },

  finishDeletion(id: number): void {
    this.deletingIds.delete(id);
  }
};

export const useDeleteWorkExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Prevent duplicate calls using global state
      if (!globalDeletionState.startDeletion(id)) {
        throw new Error(`Already deleting work experience ${id}`);
      }

      try {
        const result = await apiClient.delete(`/work-experiences/${id}`);
        globalDeletionState.finishDeletion(id);
        return result;
      } catch (error) {
        // Cleanup on error too, but after a delay to prevent immediate retry
        setTimeout(() => {
          globalDeletionState.finishDeletion(id);
        }, 1000);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.workExperiences() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
    meta: {
      errorMessage: 'Failed to delete work experience',
    },
  });
};

// Skill Categories and Subcategories mutations
export const useCreateSkillCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<SkillCategory, Error, { name: string }>({
    mutationFn: (data: { name: string }) => apiClient.post<SkillCategory>('/skills/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.skillCategories() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
    meta: {
      errorMessage: 'Failed to create skill category',
    },
  });
};

export const useCreateSkillSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation<SkillSubcategory, Error, { name: string }>({
    mutationFn: (data: { name: string }) => apiClient.post<SkillSubcategory>('/skills/subcategories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.skillSubcategories() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
    meta: {
      errorMessage: 'Failed to create skill subcategory',
    },
  });
};