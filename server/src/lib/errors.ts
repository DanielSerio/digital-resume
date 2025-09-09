import { Response } from 'express';
import { ZodError } from 'zod';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: unknown, res: Response): void => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      message: 'An error occurred while processing your request'
    } as ApiResponse);
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      message: 'Invalid request data',
      details: error.errors
    } as ApiResponse);
    return;
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  } as ApiResponse);
};

export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => {
  return {
    data,
    message: message || 'Operation completed successfully'
  };
};