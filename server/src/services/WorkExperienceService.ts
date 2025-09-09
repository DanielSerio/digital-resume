import { prisma } from '../lib/prisma';
import { AppError, ApiResponse, createSuccessResponse } from '../lib/errors';
import { 
  WorkExperienceSchema, 
  UpdateWorkExperienceSchema,
  WorkExperienceLineSchema,
  UpdateWorkExperienceLineSchema,
  WorkExperienceWithLinesSchema,
  WorkExperienceInput,
  UpdateWorkExperienceInput,
  WorkExperienceLineInput,
  UpdateWorkExperienceLineInput,
  WorkExperienceWithLinesInput
} from '../lib/validation';
import { WorkExperience, WorkExperienceLine } from '@prisma/client';

type WorkExperienceWithLines = WorkExperience & {
  workExperienceLines: WorkExperienceLine[];
};

export class WorkExperienceService {
  
  // ============ WORK EXPERIENCE ============
  
  async getWorkExperiences(): Promise<ApiResponse<WorkExperienceWithLines[]>> {
    try {
      const workExperiences = await prisma.workExperience.findMany({
        include: {
          workExperienceLines: {
            orderBy: { lineId: 'asc' },
          },
        },
        orderBy: { dateStarted: 'desc' },
      });
      return createSuccessResponse(workExperiences, 'Work experiences retrieved successfully');
    } catch (error) {
      console.error('Error fetching work experiences:', error);
      throw new AppError('Failed to fetch work experiences', 500);
    }
  }

  async getWorkExperienceById(id: number): Promise<ApiResponse<WorkExperienceWithLines | null>> {
    try {
      const workExperience = await prisma.workExperience.findUnique({
        where: { id },
        include: {
          workExperienceLines: {
            orderBy: { lineId: 'asc' },
          },
        },
      });
      return createSuccessResponse(workExperience, workExperience ? 'Work experience retrieved successfully' : 'Work experience not found');
    } catch (error) {
      console.error('Error fetching work experience:', error);
      throw new AppError('Failed to fetch work experience', 500);
    }
  }

  async createWorkExperience(data: WorkExperienceInput): Promise<ApiResponse<WorkExperience>> {
    try {
      // Validate input
      const validatedData = WorkExperienceSchema.parse(data);
      
      // Convert string dates to Date objects
      const workExperienceData = {
        ...validatedData,
        dateStarted: new Date(validatedData.dateStarted),
        dateEnded: validatedData.dateEnded ? new Date(validatedData.dateEnded) : null,
      };

      // Validate that start date is before end date (if end date exists)
      if (workExperienceData.dateEnded && workExperienceData.dateStarted >= workExperienceData.dateEnded) {
        throw new AppError('Start date must be before end date', 400);
      }

      const workExperience = await prisma.workExperience.create({
        data: workExperienceData,
      });

      return createSuccessResponse(workExperience, 'Work experience created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error creating work experience:', error);
      throw new AppError('Failed to create work experience', 500);
    }
  }

  async createWorkExperienceWithLines(data: WorkExperienceWithLinesInput): Promise<ApiResponse<WorkExperienceWithLines>> {
    try {
      // Validate input
      const validatedData = WorkExperienceWithLinesSchema.parse(data);
      
      // Convert string dates to Date objects
      const workExperienceData = {
        ...validatedData.workExperience,
        dateStarted: new Date(validatedData.workExperience.dateStarted),
        dateEnded: validatedData.workExperience.dateEnded ? new Date(validatedData.workExperience.dateEnded) : null,
      };

      // Validate that start date is before end date (if end date exists)
      if (workExperienceData.dateEnded && workExperienceData.dateStarted >= workExperienceData.dateEnded) {
        throw new AppError('Start date must be before end date', 400);
      }

      // Validate line IDs are unique
      const lineIds = validatedData.lines.map(line => line.lineId);
      const uniqueLineIds = new Set(lineIds);
      if (lineIds.length !== uniqueLineIds.size) {
        throw new AppError('Line IDs must be unique within the work experience', 400);
      }

      // Use transaction to create work experience and lines atomically
      const result = await prisma.$transaction(async (tx) => {
        // Create work experience
        const workExperience = await tx.workExperience.create({
          data: workExperienceData,
        });

        // Create work experience lines
        const lines = await Promise.all(
          validatedData.lines.map(line =>
            tx.workExperienceLine.create({
              data: {
                workExperienceId: workExperience.id,
                lineText: line.lineText,
                lineId: line.lineId,
              },
            })
          )
        );

        return {
          ...workExperience,
          workExperienceLines: lines,
        };
      });

      return createSuccessResponse(result, 'Work experience with lines created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error creating work experience with lines:', error);
      throw new AppError('Failed to create work experience with lines', 500);
    }
  }

  async updateWorkExperience(id: number, data: UpdateWorkExperienceInput): Promise<ApiResponse<WorkExperience>> {
    try {
      // Validate input
      const validatedData = UpdateWorkExperienceSchema.parse(data);
      
      // Check if work experience exists
      const existingWorkExperience = await prisma.workExperience.findUnique({
        where: { id },
      });
      
      if (!existingWorkExperience) {
        throw new AppError('Work experience not found', 404);
      }

      // Convert string dates to Date objects where provided
      const updateData: any = { ...validatedData };
      if (validatedData.dateStarted) {
        updateData.dateStarted = new Date(validatedData.dateStarted);
      }
      if (validatedData.dateEnded) {
        updateData.dateEnded = new Date(validatedData.dateEnded);
      }

      // Get the final dates for validation (existing or new)
      const finalStartDate = updateData.dateStarted || existingWorkExperience.dateStarted;
      const finalEndDate = updateData.dateEnded !== undefined ? updateData.dateEnded : existingWorkExperience.dateEnded;

      // Validate that start date is before end date (if end date exists)
      if (finalEndDate && finalStartDate >= finalEndDate) {
        throw new AppError('Start date must be before end date', 400);
      }

      const updatedWorkExperience = await prisma.workExperience.update({
        where: { id },
        data: updateData,
      });

      return createSuccessResponse(updatedWorkExperience, 'Work experience updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error updating work experience:', error);
      throw new AppError('Failed to update work experience', 500);
    }
  }

  async deleteWorkExperience(id: number): Promise<ApiResponse<null>> {
    try {
      // Check if work experience exists
      const existingWorkExperience = await prisma.workExperience.findUnique({
        where: { id },
        include: { 
          workExperienceLines: true,
          scopedWorkExperiences: true 
        },
      });
      
      if (!existingWorkExperience) {
        throw new AppError('Work experience not found', 404);
      }

      // Check if work experience is being used in scoped resumes
      if (existingWorkExperience.scopedWorkExperiences.length > 0) {
        throw new AppError('Cannot delete work experience that is being used in scoped resumes', 409);
      }

      // Use transaction to delete work experience and its lines atomically
      await prisma.$transaction(async (tx) => {
        // Delete work experience lines first (due to foreign key constraint)
        await tx.workExperienceLine.deleteMany({
          where: { workExperienceId: id },
        });

        // Delete work experience
        await tx.workExperience.delete({
          where: { id },
        });
      });

      return createSuccessResponse(null, 'Work experience deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deleting work experience:', error);
      throw new AppError('Failed to delete work experience', 500);
    }
  }

  // ============ WORK EXPERIENCE LINES ============
  
  async getWorkExperienceLines(workExperienceId: number): Promise<ApiResponse<WorkExperienceLine[]>> {
    try {
      // Verify work experience exists
      const workExperience = await prisma.workExperience.findUnique({
        where: { id: workExperienceId },
      });

      if (!workExperience) {
        throw new AppError('Work experience not found', 404);
      }

      const lines = await prisma.workExperienceLine.findMany({
        where: { workExperienceId },
        orderBy: { lineId: 'asc' },
      });

      return createSuccessResponse(lines, 'Work experience lines retrieved successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error fetching work experience lines:', error);
      throw new AppError('Failed to fetch work experience lines', 500);
    }
  }

  async createWorkExperienceLine(data: WorkExperienceLineInput): Promise<ApiResponse<WorkExperienceLine>> {
    try {
      // Validate input
      const validatedData = WorkExperienceLineSchema.parse(data);
      
      // Verify work experience exists
      const workExperience = await prisma.workExperience.findUnique({
        where: { id: validatedData.workExperienceId },
      });

      if (!workExperience) {
        throw new AppError('Work experience not found', 404);
      }

      // Check for duplicate line ID within the same work experience
      const existingLine = await prisma.workExperienceLine.findFirst({
        where: {
          workExperienceId: validatedData.workExperienceId,
          lineId: validatedData.lineId,
        },
      });

      if (existingLine) {
        throw new AppError('Line ID already exists for this work experience', 409);
      }

      const line = await prisma.workExperienceLine.create({
        data: validatedData,
      });

      return createSuccessResponse(line, 'Work experience line created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error creating work experience line:', error);
      throw new AppError('Failed to create work experience line', 500);
    }
  }

  async updateWorkExperienceLine(id: number, data: UpdateWorkExperienceLineInput): Promise<ApiResponse<WorkExperienceLine>> {
    try {
      // Validate input
      const validatedData = UpdateWorkExperienceLineSchema.parse(data);
      
      // Check if line exists
      const existingLine = await prisma.workExperienceLine.findUnique({
        where: { id },
      });
      
      if (!existingLine) {
        throw new AppError('Work experience line not found', 404);
      }

      // If updating line ID, check for duplicates
      if (validatedData.lineId && validatedData.lineId !== existingLine.lineId) {
        const duplicateLine = await prisma.workExperienceLine.findFirst({
          where: {
            workExperienceId: existingLine.workExperienceId,
            lineId: validatedData.lineId,
          },
        });

        if (duplicateLine) {
          throw new AppError('Line ID already exists for this work experience', 409);
        }
      }

      const updatedLine = await prisma.workExperienceLine.update({
        where: { id },
        data: validatedData,
      });

      return createSuccessResponse(updatedLine, 'Work experience line updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error updating work experience line:', error);
      throw new AppError('Failed to update work experience line', 500);
    }
  }

  async deleteWorkExperienceLine(id: number): Promise<ApiResponse<null>> {
    try {
      // Check if line exists
      const existingLine = await prisma.workExperienceLine.findUnique({
        where: { id },
        include: { scopedWorkExperienceLines: true },
      });
      
      if (!existingLine) {
        throw new AppError('Work experience line not found', 404);
      }

      // Check if line is being used in scoped resumes
      if (existingLine.scopedWorkExperienceLines.length > 0) {
        throw new AppError('Cannot delete work experience line that is being used in scoped resumes', 409);
      }

      await prisma.workExperienceLine.delete({
        where: { id },
      });

      return createSuccessResponse(null, 'Work experience line deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deleting work experience line:', error);
      throw new AppError('Failed to delete work experience line', 500);
    }
  }
}