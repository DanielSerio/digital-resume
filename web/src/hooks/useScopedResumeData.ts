import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { 
  ScopedResume, 
  CompleteScopedResume, 
  ScopedResumeInput
} from '@/types';

// Query keys for consistent caching - simplified to avoid circular references
export const scopedResumeQueryKeys = {
  all: ['scoped-resumes'] as const,
  list: ['scoped-resumes', 'list'] as const,
  detail: (id: number) => ['scoped-resumes', 'detail', id] as const,
};

// Hook for fetching all scoped resumes
export const useScopedResumesData = () => {
  return useQuery({
    queryKey: scopedResumeQueryKeys.list,
    queryFn: () => apiClient.get<ScopedResume[]>('/scoped-resumes'),
    throwOnError: false,
    meta: {
      errorMessage: 'Failed to load scoped resumes',
    },
  });
};

// Hook for fetching a single scoped resume with all its data
export const useScopedResumeData = (scopedResumeId: number | null) => {
  return useQuery({
    queryKey: scopedResumeQueryKeys.detail(scopedResumeId!),
    queryFn: () => apiClient.get<CompleteScopedResume>(`/scoped-resumes/${scopedResumeId}`),
    enabled: scopedResumeId !== null,
    throwOnError: false,
    meta: {
      errorMessage: 'Failed to load scoped resume data',
    },
  });
};

// Hook for creating a new scoped resume
export const useCreateScopedResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScopedResumeInput) => 
      apiClient.post<ScopedResume>('/scoped-resumes', data),
    onSuccess: () => {
      // Only invalidate the list query, not all queries
      queryClient.invalidateQueries({ queryKey: scopedResumeQueryKeys.list });
    },
    meta: {
      errorMessage: 'Failed to create scoped resume',
    },
  });
};

// Hook for updating a scoped resume
export const useUpdateScopedResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ScopedResumeInput> }) => 
      apiClient.put<ScopedResume>(`/scoped-resumes/${id}`, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific queries only
      queryClient.invalidateQueries({ queryKey: scopedResumeQueryKeys.list });
      queryClient.invalidateQueries({ queryKey: scopedResumeQueryKeys.detail(id) });
    },
    meta: {
      errorMessage: 'Failed to update scoped resume',
    },
  });
};

// Hook for deleting a scoped resume
export const useDeleteScopedResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => 
      apiClient.delete(`/scoped-resumes/${id}`),
    onSuccess: (_, id) => {
      // Invalidate list and remove specific detail query
      queryClient.invalidateQueries({ queryKey: scopedResumeQueryKeys.list });
      queryClient.removeQueries({ queryKey: scopedResumeQueryKeys.detail(id) });
    },
    meta: {
      errorMessage: 'Failed to delete scoped resume',
    },
  });
};

// Hook for duplicating a scoped resume
export const useDuplicateScopedResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => 
      apiClient.post<ScopedResume>(`/scoped-resumes/${id}/duplicate`, {}),
    onSuccess: () => {
      // Only invalidate the list query to show the new duplicate
      queryClient.invalidateQueries({ queryKey: scopedResumeQueryKeys.list });
    },
    meta: {
      errorMessage: 'Failed to duplicate scoped resume',
    },
  });
};