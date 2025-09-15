import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { resumeQueryKeys } from './useResumeData';
import type {
  ContactInput,
  ProfessionalSummaryInput,
  TechnicalSkillInput,
  EducationInput,
  CreateWorkExperienceRequest,
  UpdateWorkExperienceRequest,
  Contact,
  ProfessionalSummary,
  TechnicalSkill,
  Education,
  WorkExperience,
} from '@/types';

// Optimistic update utilities
const optimisticUpdateOptions = {
  // Don't refetch queries while mutations are in flight
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

// Enhanced contact mutation with optimistic updates
export const useOptimisticUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactInput) => apiClient.put('/contact', data),

    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: resumeQueryKeys.contact() });

      // Snapshot the previous value
      const previousContact = queryClient.getQueryData<Contact>(resumeQueryKeys.contact());

      // Optimistically update the contact data
      queryClient.setQueryData<Contact>(resumeQueryKeys.contact(), (old) => ({
        ...old,
        ...newData,
        id: old?.id || 1, // Ensure ID is preserved
        updatedAt: new Date().toISOString(),
      }));

      // Also update the complete resume data
      queryClient.setQueryData(resumeQueryKeys.resume(), (old: any) => ({
        ...old,
        contact: {
          ...old?.contact,
          ...newData,
          updatedAt: new Date().toISOString(),
        }
      }));

      // Return context with previous data for rollback
      return { previousContact };
    },

    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousContact) {
        queryClient.setQueryData(resumeQueryKeys.contact(), context.previousContact);
        queryClient.setQueryData(resumeQueryKeys.resume(), (old: any) => ({
          ...old,
          contact: context.previousContact
        }));
      }

      toast.error('Failed to update contact information');
      console.error('Contact update failed:', error);
    },

    onSuccess: () => {
      toast.success('Contact information updated');
    },

    onSettled: () => {
      // Always refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.contact() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
  });
};

// Enhanced professional summary mutation with optimistic updates
export const useOptimisticUpdateProfessionalSummary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfessionalSummaryInput) => apiClient.put('/summary', data),

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: resumeQueryKeys.summary() });

      const previousSummary = queryClient.getQueryData<ProfessionalSummary>(resumeQueryKeys.summary());

      queryClient.setQueryData<ProfessionalSummary>(resumeQueryKeys.summary(), (old) => ({
        ...old,
        ...newData,
        id: old?.id || 1,
        updatedAt: new Date().toISOString(),
      }));

      queryClient.setQueryData(resumeQueryKeys.resume(), (old: any) => ({
        ...old,
        professionalSummary: {
          ...old?.professionalSummary,
          ...newData,
          updatedAt: new Date().toISOString(),
        }
      }));

      return { previousSummary };
    },

    onError: (error, variables, context) => {
      if (context?.previousSummary) {
        queryClient.setQueryData(resumeQueryKeys.summary(), context.previousSummary);
        queryClient.setQueryData(resumeQueryKeys.resume(), (old: any) => ({
          ...old,
          professionalSummary: context.previousSummary
        }));
      }

      toast.error('Failed to update professional summary');
      console.error('Summary update failed:', error);
    },

    onSuccess: () => {
      toast.success('Professional summary updated');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.summary() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
  });
};

// Enhanced technical skill creation with optimistic updates
export const useOptimisticCreateTechnicalSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TechnicalSkillInput) => apiClient.post('/skills', data),

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: resumeQueryKeys.skills() });

      const previousSkills = queryClient.getQueryData<TechnicalSkill[]>(resumeQueryKeys.skills());

      // Create optimistic skill with temporary ID
      const optimisticSkill: TechnicalSkill = {
        id: Date.now(), // Temporary ID
        name: newData.name,
        categoryId: newData.categoryId,
        subcategoryId: newData.subcategoryId,
        category: { id: newData.categoryId, name: 'Loading...' }, // Placeholder
        subcategory: { id: newData.subcategoryId, name: 'Loading...' }, // Placeholder
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<TechnicalSkill[]>(resumeQueryKeys.skills(), (old = []) => [
        ...old,
        optimisticSkill
      ]);

      queryClient.setQueryData(resumeQueryKeys.resume(), (old: any) => ({
        ...old,
        technicalSkills: [...(old?.technicalSkills || []), optimisticSkill]
      }));

      return { previousSkills, optimisticSkill };
    },

    onError: (error, variables, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(resumeQueryKeys.skills(), context.previousSkills);
        queryClient.setQueryData(resumeQueryKeys.resume(), (old: any) => ({
          ...old,
          technicalSkills: context.previousSkills
        }));
      }

      toast.error('Failed to create technical skill');
      console.error('Skill creation failed:', error);
    },

    onSuccess: (result) => {
      toast.success(`Skill "${result.name}" created successfully`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.skills() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
  });
};

// Enhanced skill deletion with optimistic updates
export const useOptimisticDeleteTechnicalSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/skills/${id}`),

    onMutate: async (skillId) => {
      await queryClient.cancelQueries({ queryKey: resumeQueryKeys.skills() });

      const previousSkills = queryClient.getQueryData<TechnicalSkill[]>(resumeQueryKeys.skills());
      const skillToDelete = previousSkills?.find(skill => skill.id === skillId);

      // Optimistically remove the skill
      queryClient.setQueryData<TechnicalSkill[]>(resumeQueryKeys.skills(), (old = []) =>
        old.filter(skill => skill.id !== skillId)
      );

      queryClient.setQueryData(resumeQueryKeys.resume(), (old: any) => ({
        ...old,
        technicalSkills: (old?.technicalSkills || []).filter((skill: TechnicalSkill) => skill.id !== skillId)
      }));

      return { previousSkills, skillToDelete };
    },

    onError: (error, variables, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(resumeQueryKeys.skills(), context.previousSkills);
        queryClient.setQueryData(resumeQueryKeys.resume(), (old: any) => ({
          ...old,
          technicalSkills: context.previousSkills
        }));
      }

      toast.error('Failed to delete technical skill');
      console.error('Skill deletion failed:', error);
    },

    onSuccess: (result, variables, context) => {
      const skillName = context?.skillToDelete?.name || 'Skill';
      toast.success(`"${skillName}" deleted successfully`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.skills() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
  });
};

// Enhanced work experience creation with optimistic updates
export const useOptimisticCreateWorkExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkExperienceRequest) => apiClient.post('/work-experiences', data),

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: resumeQueryKeys.workExperiences() });

      const previousWorkExperiences = queryClient.getQueryData<WorkExperience[]>(resumeQueryKeys.workExperiences());

      // Create optimistic work experience
      const optimisticWorkExperience: WorkExperience = {
        id: Date.now(), // Temporary ID
        companyName: newData.workExperience.companyName,
        jobTitle: newData.workExperience.jobTitle,
        companyCity: newData.workExperience.companyCity || null,
        companyState: newData.workExperience.companyState || null,
        dateStarted: newData.workExperience.dateStarted,
        dateEnded: newData.workExperience.dateEnded || null,
        lines: newData.lines?.map((line, index) => ({
          id: Date.now() + index, // Temporary ID
          workExperienceId: Date.now(),
          lineText: line.lineText,
          sortOrder: line.sortOrder,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })) || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<WorkExperience[]>(resumeQueryKeys.workExperiences(), (old = []) => [
        ...old,
        optimisticWorkExperience
      ]);

      queryClient.setQueryData(resumeQueryKeys.resume(), (old: any) => ({
        ...old,
        workExperiences: [...(old?.workExperiences || []), optimisticWorkExperience]
      }));

      return { previousWorkExperiences, optimisticWorkExperience };
    },

    onError: (error, variables, context) => {
      if (context?.previousWorkExperiences) {
        queryClient.setQueryData(resumeQueryKeys.workExperiences(), context.previousWorkExperiences);
        queryClient.setQueryData(resumeQueryKeys.resume(), (old: any) => ({
          ...old,
          workExperiences: context.previousWorkExperiences
        }));
      }

      toast.error('Failed to create work experience');
      console.error('Work experience creation failed:', error);
    },

    onSuccess: (result) => {
      toast.success(`Work experience at "${result.companyName}" created successfully`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.workExperiences() });
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });
    },
  });
};

// Batch optimistic updates utility
export const useBatchOptimisticUpdates = () => {
  const queryClient = useQueryClient();

  return {
    // Batch skill updates
    batchUpdateSkills: async (updates: Array<{ id: number; data: Partial<TechnicalSkillInput> }>) => {
      const previousSkills = queryClient.getQueryData<TechnicalSkill[]>(resumeQueryKeys.skills());

      // Apply optimistic updates
      queryClient.setQueryData<TechnicalSkill[]>(resumeQueryKeys.skills(), (old = []) =>
        old.map(skill => {
          const update = updates.find(u => u.id === skill.id);
          return update ? { ...skill, ...update.data, updatedAt: new Date().toISOString() } : skill;
        })
      );

      try {
        // Execute batch updates
        const promises = updates.map(update =>
          apiClient.put(`/skills/${update.id}`, update.data)
        );

        await Promise.all(promises);
        toast.success(`${updates.length} skills updated successfully`);

        // Refresh data
        queryClient.invalidateQueries({ queryKey: resumeQueryKeys.skills() });
        queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });

      } catch (error) {
        // Rollback on error
        if (previousSkills) {
          queryClient.setQueryData(resumeQueryKeys.skills(), previousSkills);
        }

        toast.error('Failed to update skills');
        console.error('Batch skill update failed:', error);
        throw error;
      }
    },

    // Batch skill deletions
    batchDeleteSkills: async (skillIds: number[]) => {
      const previousSkills = queryClient.getQueryData<TechnicalSkill[]>(resumeQueryKeys.skills());

      // Apply optimistic deletions
      queryClient.setQueryData<TechnicalSkill[]>(resumeQueryKeys.skills(), (old = []) =>
        old.filter(skill => !skillIds.includes(skill.id))
      );

      try {
        // Execute batch deletions
        const promises = skillIds.map(id => apiClient.delete(`/skills/${id}`));
        await Promise.all(promises);

        toast.success(`${skillIds.length} skills deleted successfully`);

        // Refresh data
        queryClient.invalidateQueries({ queryKey: resumeQueryKeys.skills() });
        queryClient.invalidateQueries({ queryKey: resumeQueryKeys.resume() });

      } catch (error) {
        // Rollback on error
        if (previousSkills) {
          queryClient.setQueryData(resumeQueryKeys.skills(), previousSkills);
        }

        toast.error('Failed to delete skills');
        console.error('Batch skill deletion failed:', error);
        throw error;
      }
    }
  };
};