import { prisma } from '../lib/prisma';
import { AppError, ApiResponse, createSuccessResponse } from '../lib/errors';
import { EducationSchema, UpdateEducationSchema, EducationInput, UpdateEducationInput } from '../lib/validation';
import { Education } from '@prisma/client';

export class EducationService {
  
  async getEducation(): Promise<ApiResponse<Education[]>> {
    try {
      const education = await prisma.education.findMany({
        orderBy: { dateStarted: 'desc' },
      });
      return createSuccessResponse(education, 'Education records retrieved successfully');
    } catch (error) {
      console.error('Error fetching education records:', error);
      throw new AppError('Failed to fetch education records', 500);
    }
  }

  async getEducationById(id: number): Promise<ApiResponse<Education | null>> {
    try {
      const education = await prisma.education.findUnique({
        where: { id },
      });
      return createSuccessResponse(education, education ? 'Education record retrieved successfully' : 'Education record not found');
    } catch (error) {
      console.error('Error fetching education record:', error);
      throw new AppError('Failed to fetch education record', 500);
    }
  }

  async createEducation(data: EducationInput): Promise<ApiResponse<Education>> {
    try {
      // Validate input
      const validatedData = EducationSchema.parse(data);
      
      // Convert string dates to Date objects
      const educationData = {
        ...validatedData,
        dateStarted: new Date(validatedData.dateStarted),
        dateFinished: validatedData.dateFinished ? new Date(validatedData.dateFinished) : null,
      };

      // Validate that start date is before finish date (if finish date exists)
      if (educationData.dateFinished && educationData.dateStarted >= educationData.dateFinished) {
        throw new AppError('Start date must be before finish date', 400);
      }

      const education = await prisma.education.create({
        data: educationData,
      });

      return createSuccessResponse(education, 'Education record created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error creating education record:', error);
      throw new AppError('Failed to create education record', 500);
    }
  }

  async updateEducation(id: number, data: UpdateEducationInput): Promise<ApiResponse<Education>> {
    try {
      // Validate input
      const validatedData = UpdateEducationSchema.parse(data);
      
      // Check if education record exists
      const existingEducation = await prisma.education.findUnique({
        where: { id },
      });
      
      if (!existingEducation) {
        throw new AppError('Education record not found', 404);
      }

      // Convert string dates to Date objects where provided
      const updateData: any = { ...validatedData };
      if (validatedData.dateStarted) {
        updateData.dateStarted = new Date(validatedData.dateStarted);
      }
      if (validatedData.dateFinished) {
        updateData.dateFinished = new Date(validatedData.dateFinished);
      }

      // Get the final dates for validation (existing or new)
      const finalStartDate = updateData.dateStarted || existingEducation.dateStarted;
      const finalFinishDate = updateData.dateFinished !== undefined ? updateData.dateFinished : existingEducation.dateFinished;

      // Validate that start date is before finish date (if finish date exists)
      if (finalFinishDate && finalStartDate >= finalFinishDate) {
        throw new AppError('Start date must be before finish date', 400);
      }

      const updatedEducation = await prisma.education.update({
        where: { id },
        data: updateData,
      });

      return createSuccessResponse(updatedEducation, 'Education record updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error updating education record:', error);
      throw new AppError('Failed to update education record', 500);
    }
  }

  async deleteEducation(id: number): Promise<ApiResponse<null>> {
    try {
      // Check if education record exists
      const existingEducation = await prisma.education.findUnique({
        where: { id },
      });
      
      if (!existingEducation) {
        throw new AppError('Education record not found', 404);
      }

      await prisma.education.delete({
        where: { id },
      });

      return createSuccessResponse(null, 'Education record deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deleting education record:', error);
      throw new AppError('Failed to delete education record', 500);
    }
  }
}