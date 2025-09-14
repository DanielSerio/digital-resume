import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type {
  CompleteResume,
  Contact,
  ProfessionalSummary,
  TechnicalSkill,
  Education,
  WorkExperience,
  SkillCategory,
  SkillSubcategory
} from '@/types';

// Query keys for consistent caching
export const resumeQueryKeys = {
  all: ['resume'] as const,
  resume: () => [...resumeQueryKeys.all, 'complete'] as const,
  contact: () => [...resumeQueryKeys.all, 'contact'] as const,
  summary: () => [...resumeQueryKeys.all, 'summary'] as const,
  skills: () => [...resumeQueryKeys.all, 'skills'] as const,
  skillCategories: () => [...resumeQueryKeys.all, 'skill-categories'] as const,
  skillSubcategories: () => [...resumeQueryKeys.all, 'skill-subcategories'] as const,
  education: () => [...resumeQueryKeys.all, 'education'] as const,
  workExperiences: () => [...resumeQueryKeys.all, 'work-experiences'] as const,
};

// Hook for fetching complete resume data
export const useResumeData = () => {
  return useQuery({
    queryKey: resumeQueryKeys.resume(),
    queryFn: async (): Promise<CompleteResume> => {
      // Fetch all resume data in parallel for better performance
      const [
        contact,
        professionalSummary,
        technicalSkills,
        education,
        workExperiences,
        skillCategories,
        skillSubcategories,
      ] = await Promise.all([
        apiClient.get<Contact>('/contact').catch(() => null),
        apiClient.get<ProfessionalSummary>('/summary').catch(() => null),
        apiClient.get<TechnicalSkill[]>('/skills').catch(() => []),
        apiClient.get<Education[]>('/education').catch(() => []),
        apiClient.get<WorkExperience[]>('/work-experiences').catch(() => []),
        apiClient.get<SkillCategory[]>('/skills/categories').catch(() => []),
        apiClient.get<SkillSubcategory[]>('/skills/subcategories').catch(() => []),
      ]);

      return {
        contact,
        professionalSummary,
        technicalSkills,
        education,
        workExperiences,
        skillCategories,
        skillSubcategories,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    throwOnError: false, // Handle errors gracefully
    meta: {
      errorMessage: 'Failed to load resume data',
    },
  });
};

// Individual section hooks for more granular data fetching
export const useContactData = () => {
  return useQuery({
    queryKey: resumeQueryKeys.contact(),
    queryFn: () => apiClient.get<Contact>('/contact'),
    throwOnError: false,
    meta: {
      errorMessage: 'Failed to load contact information',
    },
  });
};

export const useProfessionalSummaryData = () => {
  return useQuery({
    queryKey: resumeQueryKeys.summary(),
    queryFn: () => apiClient.get<ProfessionalSummary>('/summary'),
    throwOnError: false,
    meta: {
      errorMessage: 'Failed to load professional summary',
    },
  });
};

export const useTechnicalSkillsData = () => {
  return useQuery({
    queryKey: resumeQueryKeys.skills(),
    queryFn: () => apiClient.get<TechnicalSkill[]>('/skills'),
    throwOnError: false,
    meta: {
      errorMessage: 'Failed to load technical skills',
    },
  });
};

export const useEducationData = () => {
  return useQuery({
    queryKey: resumeQueryKeys.education(),
    queryFn: () => apiClient.get<Education[]>('/education'),
    throwOnError: false,
    meta: {
      errorMessage: 'Failed to load education information',
    },
  });
};

export const useWorkExperiencesData = () => {
  return useQuery({
    queryKey: resumeQueryKeys.workExperiences(),
    queryFn: async () => {
      const response = await apiClient.get<WorkExperience[]>('/work-experiences');
      console.info('response', response);
      // Transform date strings to Date objects
      return response.map((workExp) => ({
        ...workExp,
        dateStarted: new Date(workExp.dateStarted),
        dateEnded: workExp.dateEnded ? new Date(workExp.dateEnded) : null,
        createdAt: new Date(workExp.createdAt),
        updatedAt: new Date(workExp.updatedAt),
        lines: workExp.lines.map(line => ({
          ...line,
          createdAt: new Date(line.createdAt),
          updatedAt: new Date(line.updatedAt),
        }))
      }));
    },
    throwOnError: false,
    meta: {
      errorMessage: 'Failed to load work experience',
    },
  });
};

export const useSkillCategoriesData = () => {
  return useQuery<SkillCategory[]>({
    queryKey: resumeQueryKeys.skillCategories(),
    queryFn: () => apiClient.get<SkillCategory[]>('/skills/categories'),
    throwOnError: false,
    meta: {
      errorMessage: 'Failed to load skill categories',
    },
  });
};

export const useSkillSubcategoriesData = () => {
  return useQuery<SkillSubcategory[]>({
    queryKey: resumeQueryKeys.skillSubcategories(),
    queryFn: () => apiClient.get<SkillSubcategory[]>('/skills/subcategories'),
    throwOnError: false,
    meta: {
      errorMessage: 'Failed to load skill subcategories',
    },
  });
};