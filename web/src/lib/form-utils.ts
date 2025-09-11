import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import type { z } from 'zod';

// Re-export for convenience since we're using Zod v4
export const createFormResolver = <T extends z.ZodTypeAny>(schema: T) => {
  return standardSchemaResolver(schema);
};

// Form validation helper to handle common field validation patterns
export const createFieldValidation = {
  required: (message = 'This field is required') => ({
    required: message,
  }),
  email: (message = 'Please enter a valid email address') => ({
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message,
    },
  }),
  url: (message = 'Please enter a valid URL') => ({
    pattern: {
      value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      message,
    },
  }),
  phone: (message = 'Please enter a valid phone number') => ({
    pattern: {
      value: /^[\+]?[1-9][\d]{0,15}$/,
      message,
    },
  }),
  minLength: (min: number, message?: string) => ({
    minLength: {
      value: min,
      message: message || `Must be at least ${min} characters`,
    },
  }),
  maxLength: (max: number, message?: string) => ({
    maxLength: {
      value: max,
      message: message || `Must be no more than ${max} characters`,
    },
  }),
};

// Helper to format form errors for display
export const getFieldError = (errors: any, fieldPath: string) => {
  const pathParts = fieldPath.split('.');
  let error = errors;
  
  for (const part of pathParts) {
    error = error?.[part];
    if (!error) break;
  }
  
  return error?.message || null;
};

// Helper to check if a field has an error
export const hasFieldError = (errors: any, fieldPath: string) => {
  return Boolean(getFieldError(errors, fieldPath));
};