import { prisma } from '../lib/prisma';
import { AppError, ApiResponse, createSuccessResponse } from '../lib/errors';
import { ProfessionalSummarySchema, UpdateProfessionalSummarySchema, ProfessionalSummaryInput, UpdateProfessionalSummaryInput } from '../lib/validation';
import { ProfessionalSummary } from '@prisma/client';

export class ProfessionalSummaryService {
  
  async getProfessionalSummary(): Promise<ApiResponse<ProfessionalSummary | null>> {
    try {
      const summary = await prisma.professionalSummary.findFirst();
      return createSuccessResponse(summary, summary ? 'Professional summary retrieved successfully' : 'No professional summary found');
    } catch (error) {
      console.error('Error fetching professional summary:', error);
      throw new AppError('Failed to fetch professional summary', 500);
    }
  }

  async createProfessionalSummary(data: ProfessionalSummaryInput): Promise<ApiResponse<ProfessionalSummary>> {
    try {
      // Validate input
      const validatedData = ProfessionalSummarySchema.parse(data);
      
      // Check if summary already exists (single-user app)
      const existingSummary = await prisma.professionalSummary.findFirst();
      if (existingSummary) {
        throw new AppError('Professional summary already exists. Use update instead.', 409);
      }

      const summary = await prisma.professionalSummary.create({
        data: validatedData,
      });

      return createSuccessResponse(summary, 'Professional summary created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error creating professional summary:', error);
      throw new AppError('Failed to create professional summary', 500);
    }
  }

  async updateProfessionalSummary(data: UpdateProfessionalSummaryInput): Promise<ApiResponse<ProfessionalSummary>> {
    try {
      // Validate input
      const validatedData = UpdateProfessionalSummarySchema.parse(data);
      
      // Get existing summary
      const existingSummary = await prisma.professionalSummary.findFirst();
      if (!existingSummary) {
        throw new AppError('Professional summary not found', 404);
      }

      const updatedSummary = await prisma.professionalSummary.update({
        where: { id: existingSummary.id },
        data: validatedData,
      });

      return createSuccessResponse(updatedSummary, 'Professional summary updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error updating professional summary:', error);
      throw new AppError('Failed to update professional summary', 500);
    }
  }

  async deleteProfessionalSummary(): Promise<ApiResponse<null>> {
    try {
      const existingSummary = await prisma.professionalSummary.findFirst();
      if (!existingSummary) {
        throw new AppError('Professional summary not found', 404);
      }

      await prisma.professionalSummary.delete({
        where: { id: existingSummary.id },
      });

      return createSuccessResponse(null, 'Professional summary deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deleting professional summary:', error);
      throw new AppError('Failed to delete professional summary', 500);
    }
  }
}