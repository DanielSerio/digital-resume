import type { ApiResponse, ApiError } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL + '/api' || 'http://localhost:3001/api';

// Debug API URL
console.log('=== API Configuration ===');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Final API_BASE_URL:', API_BASE_URL);

// Custom error class for API errors
export class ApiResponseError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiResponseError';
    this.status = status;
    this.details = details;
  }
}

// Generic API client using built-in fetch
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Parse JSON response
      const data = await response.json();

      // Handle non-2xx responses
      if (!response.ok) {
        throw new ApiResponseError(
          data.error || `HTTP ${response.status}`,
          response.status,
          data.details
        );
      }

      // Handle API-level errors (when response is 200 but contains error)
      if (data.error) {
        throw new ApiResponseError(data.error, response.status, data.details);
      }

      // Handle both wrapped (ApiResponse) and direct responses
      // If data has a 'data' field, it's wrapped - return data.data
      // Otherwise, return data directly
      return (data.data !== undefined ? data.data : data) as T;
    } catch (error) {
      // Re-throw ApiResponseError as-is
      if (error instanceof ApiResponseError) {
        throw error;
      }

      // Handle fetch/network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiResponseError(
          'Network error - please check your connection',
          0,
          error.message
        );
      }

      // Handle JSON parsing errors or other unexpected errors
      throw new ApiResponseError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        0,
        error
      );
    }
  }

  // HTTP method helpers
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create and export a default API client instance
export const apiClient = new ApiClient();

// TanStack Query error handler
export const handleQueryError = (error: unknown): ApiError => {
  if (error instanceof ApiResponseError) {
    return {
      message: error.message,
      status: error.status,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      details: error,
    };
  }

  return {
    message: 'An unknown error occurred',
    details: error,
  };
};

// Helper function for TanStack Query queryFn
export const createQueryFn = <T>(endpoint: string) => {
  return (): Promise<T> => apiClient.get<T>(endpoint);
};

// Helper function for TanStack Query mutationFn
export const createMutationFn = <TData, TVariables = any>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
) => {
  return (variables: TVariables): Promise<TData> => {
    switch (method) {
      case 'POST':
        return apiClient.post<TData>(endpoint, variables);
      case 'PUT':
        return apiClient.put<TData>(endpoint, variables);
      case 'DELETE':
        return apiClient.delete<TData>(endpoint);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  };
};