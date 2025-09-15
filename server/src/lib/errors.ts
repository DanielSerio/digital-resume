import { Response } from 'express';
import { ZodError } from 'zod';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  details?: any;
  success?: boolean;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes for better error handling
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, true, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(message, 404, true, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, true, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class DatabaseError extends AppError {
  constructor(operation: string, details?: any) {
    super(`Database operation failed: ${operation}`, 500, true, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

// Enhanced error formatting for Zod validation errors
const formatZodError = (error: ZodError): {
  fieldErrors: Record<string, string[]>;
  generalErrors: string[];
} => {
  const fieldErrors: Record<string, string[]> = {};
  const generalErrors: string[] = [];

  error.issues.forEach((issue) => {
    if (issue.path.length > 0) {
      const fieldPath = issue.path.join('.');
      if (!fieldErrors[fieldPath]) {
        fieldErrors[fieldPath] = [];
      }
      fieldErrors[fieldPath].push(issue.message);
    } else {
      generalErrors.push(issue.message);
    }
  });

  return { fieldErrors, generalErrors };
};

// Enhanced error handler with better user-facing messages
export const handleError = (error: unknown, res: Response) => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      message: getUserFriendlyMessage(error),
      code: error.code
    } as ApiResponse);
  }

  if (error instanceof ZodError) {
    const { fieldErrors, generalErrors } = formatZodError(error);

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Please check your input and try again',
      details: {
        fieldErrors,
        generalErrors
      },
      code: 'VALIDATION_ERROR'
    } as ApiResponse);
  }

  // Database constraint violations
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any;

    if (prismaError.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'Duplicate entry',
        message: 'This entry already exists',
        code: 'DUPLICATE_ENTRY'
      } as ApiResponse);
    }

    if (prismaError.code === 'P2003') {
      return res.status(400).json({
        success: false,
        error: 'Invalid reference',
        message: 'Referenced record does not exist',
        code: 'INVALID_REFERENCE'
      } as ApiResponse);
    }

    if (prismaError.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Record not found',
        message: 'The requested record was not found',
        code: 'NOT_FOUND'
      } as ApiResponse);
    }
  }

  // Default error response
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'An unexpected error occurred. Please try again later.',
    code: 'INTERNAL_ERROR'
  } as ApiResponse);
};

// Get user-friendly error messages
const getUserFriendlyMessage = (error: AppError): string => {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      return 'Please check your input and try again';
    case 'NOT_FOUND':
      return 'The requested item was not found';
    case 'CONFLICT':
      return 'This action conflicts with existing data';
    case 'DATABASE_ERROR':
      return 'Unable to save changes. Please try again';
    default:
      return 'An error occurred while processing your request';
  }
};

export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => {
  return {
    success: true,
    data,
    message: message || 'Operation completed successfully'
  };
};

// Validation helper for backend routes
export const validateRequestData = <T>(
  schema: any,
  data: unknown,
  customMessage?: string
): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(customMessage || 'Invalid request data');
    }
    throw error;
  }
};

// Data integrity validation utilities
export const validateDataIntegrity = {
  // Check if referenced IDs exist
  validateReferences: async (
    references: Array<{ id: number; type: string; checkFn: (id: number) => Promise<boolean> }>
  ) => {
    for (const ref of references) {
      const exists = await ref.checkFn(ref.id);
      if (!exists) {
        throw new NotFoundError(ref.type, ref.id);
      }
    }
  },

  // Check for duplicate entries
  validateUniqueness: async (
    field: string,
    value: any,
    checkFn: (value: any) => Promise<boolean>,
    excludeId?: number
  ) => {
    const exists = await checkFn(value);
    if (exists) {
      throw new ConflictError(`${field} '${value}' already exists`);
    }
  },

  // Validate date ranges
  validateDateRange: (startDate: Date, endDate?: Date | null, fieldNames?: { start: string; end: string }) => {
    if (!endDate) return;

    const start = fieldNames?.start || 'start date';
    const end = fieldNames?.end || 'end date';

    if (endDate <= startDate) {
      throw new ValidationError(`${end} must be after ${start}`);
    }

    // Check for unrealistic date ranges (more than 50 years)
    const yearsDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearsDiff > 50) {
      throw new ValidationError(`Date range cannot exceed 50 years`);
    }
  }
};