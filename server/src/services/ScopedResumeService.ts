import { prisma } from '../lib/prisma';
import { AppError, ApiResponse, createSuccessResponse } from '../lib/errors';
import { 
  ScopedResumeSchema,
  UpdateScopedResumeSchema,
  ScopedProfessionalSummarySchema,
  UpdateScopedProfessionalSummarySchema,
  ScopedSkillSchema,
  ScopedWorkExperienceSchema,
  ScopedWorkExperienceLineSchema,
  UpdateScopedWorkExperienceLineSchema,
  ScopedResumeSetupSchema,
  ScopedResumeInput,
  UpdateScopedResumeInput,
  ScopedProfessionalSummaryInput,
  UpdateScopedProfessionalSummaryInput,
  ScopedSkillInput,
  ScopedWorkExperienceInput,
  ScopedWorkExperienceLineInput,
  UpdateScopedWorkExperienceLineInput,
  ScopedResumeSetupInput
} from '../lib/validation';
import { ScopedResume, ScopedProfessionalSummary, ScopedSkill, ScopedWorkExperience, ScopedWorkExperienceLine } from '@prisma/client';

type FullScopedResume = ScopedResume & {
  scopedProfessionalSummaries: ScopedProfessionalSummary[];
  scopedSkills: (ScopedSkill & {
    technicalSkill: {
      id: number;
      name: string;
      category: { id: number; name: string; };
      subcategory: { id: number; name: string; };
    };
  })[];
  scopedWorkExperiences: (ScopedWorkExperience & {
    workExperience: {
      id: number;
      companyName: string;
      companyTagline: string | null;
      companyCity: string;
      companyState: string;
      jobTitle: string;
      dateStarted: Date;
      dateEnded: Date | null;
    };
  })[];
  scopedWorkExperienceLines: (ScopedWorkExperienceLine & {
    workExperienceLine: {
      id: number;
      workExperienceId: number;
      sortOrder: number;
    };
  })[];
};

export class ScopedResumeService {
  
  // ============ SCOPED RESUMES ============
  
  async getScopedResumes(): Promise<ApiResponse<ScopedResume[]>> {
    try {
      const scopedResumes = await prisma.scopedResume.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return createSuccessResponse(scopedResumes, 'Scoped resumes retrieved successfully');
    } catch (error) {
      console.error('Error fetching scoped resumes:', error);
      throw new AppError('Failed to fetch scoped resumes', 500);
    }
  }

  async getScopedResumeById(id: number): Promise<ApiResponse<FullScopedResume | null>> {
    try {
      const scopedResume = await prisma.scopedResume.findUnique({
        where: { id },
        include: {
          scopedProfessionalSummaries: true,
          scopedSkills: {
            include: {
              technicalSkill: {
                include: {
                  category: true,
                  subcategory: true,
                },
              },
            },
          },
          scopedWorkExperiences: {
            include: {
              workExperience: true,
            },
          },
          scopedWorkExperienceLines: {
            include: {
              workExperienceLine: true,
            },
          },
        },
      });

      if (!scopedResume) {
        return createSuccessResponse(null, 'Scoped resume not found');
      }

      // Transform the data to match frontend expectations (single summary instead of array)
      const transformedResume = {
        ...scopedResume,
        scopedProfessionalSummary: scopedResume.scopedProfessionalSummaries[0] || null,
        scopedProfessionalSummaries: undefined, // Remove the array property
      };

      return createSuccessResponse(transformedResume, 'Scoped resume retrieved successfully');
    } catch (error) {
      console.error('Error fetching scoped resume:', error);
      throw new AppError('Failed to fetch scoped resume', 500);
    }
  }

  async createScopedResume(data: ScopedResumeInput): Promise<ApiResponse<ScopedResume>> {
    try {
      const validatedData = ScopedResumeSchema.parse(data);
      
      // Check for duplicate name
      const existingResume = await prisma.scopedResume.findFirst({
        where: { name: validatedData.name },
      });
      
      if (existingResume) {
        throw new AppError('Scoped resume with this name already exists', 409);
      }

      const scopedResume = await prisma.scopedResume.create({
        data: validatedData,
      });

      return createSuccessResponse(scopedResume, 'Scoped resume created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error creating scoped resume:', error);
      throw new AppError('Failed to create scoped resume', 500);
    }
  }

  async createScopedResumeWithSetup(data: ScopedResumeSetupInput): Promise<ApiResponse<FullScopedResume>> {
    try {
      const validatedData = ScopedResumeSetupSchema.parse(data);
      
      // Check for duplicate name
      const existingResume = await prisma.scopedResume.findFirst({
        where: { name: validatedData.name },
      });
      
      if (existingResume) {
        throw new AppError('Scoped resume with this name already exists', 409);
      }

      // Verify that all skills and work experiences exist
      if (validatedData.skillIds.length > 0) {
        const skills = await prisma.technicalSkill.findMany({
          where: { id: { in: validatedData.skillIds } },
        });
        if (skills.length !== validatedData.skillIds.length) {
          throw new AppError('One or more technical skills not found', 404);
        }
      }

      if (validatedData.workExperienceIds.length > 0) {
        const workExperiences = await prisma.workExperience.findMany({
          where: { id: { in: validatedData.workExperienceIds } },
        });
        if (workExperiences.length !== validatedData.workExperienceIds.length) {
          throw new AppError('One or more work experiences not found', 404);
        }
      }

      // Use transaction to create scoped resume with all related data
      const result = await prisma.$transaction(async (tx) => {
        // Create scoped resume
        const scopedResume = await tx.scopedResume.create({
          data: { name: validatedData.name },
        });

        // Create scoped professional summary if provided
        let scopedProfessionalSummary = null;
        if (validatedData.professionalSummary) {
          scopedProfessionalSummary = await tx.scopedProfessionalSummary.create({
            data: {
              scopedResumeId: scopedResume.id,
              summaryText: validatedData.professionalSummary,
            },
          });
        }

        // Create scoped skills
        const scopedSkills = await Promise.all(
          validatedData.skillIds.map(skillId =>
            tx.scopedSkill.create({
              data: {
                scopedResumeId: scopedResume.id,
                technicalSkillId: skillId,
              },
              include: {
                technicalSkill: {
                  include: {
                    category: true,
                    subcategory: true,
                  },
                },
              },
            })
          )
        );

        // Create scoped work experiences
        const scopedWorkExperiences = await Promise.all(
          validatedData.workExperienceIds.map(workExperienceId =>
            tx.scopedWorkExperience.create({
              data: {
                scopedResumeId: scopedResume.id,
                workExperienceId: workExperienceId,
              },
              include: {
                workExperience: true,
              },
            })
          )
        );

        return {
          ...scopedResume,
          scopedProfessionalSummaries: scopedProfessionalSummary ? [scopedProfessionalSummary] : [],
          scopedSkills,
          scopedWorkExperiences,
          scopedWorkExperienceLines: [],
        };
      });

      return createSuccessResponse(result, 'Scoped resume created with setup successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error creating scoped resume with setup:', error);
      throw new AppError('Failed to create scoped resume with setup', 500);
    }
  }

  async updateScopedResume(id: number, data: UpdateScopedResumeInput): Promise<ApiResponse<ScopedResume>> {
    try {
      const validatedData = UpdateScopedResumeSchema.parse(data);
      
      const existingResume = await prisma.scopedResume.findUnique({
        where: { id },
      });
      
      if (!existingResume) {
        throw new AppError('Scoped resume not found', 404);
      }

      // Check for duplicate name if name is being updated
      if (validatedData.name && validatedData.name !== existingResume.name) {
        const duplicateResume = await prisma.scopedResume.findFirst({
          where: { name: validatedData.name },
        });
        
        if (duplicateResume) {
          throw new AppError('Scoped resume with this name already exists', 409);
        }
      }

      const updatedResume = await prisma.scopedResume.update({
        where: { id },
        data: validatedData,
      });

      return createSuccessResponse(updatedResume, 'Scoped resume updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error updating scoped resume:', error);
      throw new AppError('Failed to update scoped resume', 500);
    }
  }

  async duplicateScopedResume(id: number, newName: string): Promise<ApiResponse<FullScopedResume>> {
    try {
      if (!newName || newName.trim().length === 0) {
        throw new AppError('New name is required for duplication', 400);
      }

      // Check if original exists
      const originalResume = await prisma.scopedResume.findUnique({
        where: { id },
        include: {
          scopedProfessionalSummaries: true,
          scopedSkills: true,
          scopedWorkExperiences: true,
          scopedWorkExperienceLines: true,
        },
      });

      if (!originalResume) {
        throw new AppError('Scoped resume not found', 404);
      }

      // Check for duplicate name
      const existingResume = await prisma.scopedResume.findFirst({
        where: { name: newName.trim() },
      });
      
      if (existingResume) {
        throw new AppError('Scoped resume with this name already exists', 409);
      }

      // Use transaction to duplicate all related data
      const result = await prisma.$transaction(async (tx) => {
        // Create new scoped resume
        const newResume = await tx.scopedResume.create({
          data: { name: newName.trim() },
        });

        // Duplicate scoped professional summaries
        const newSummaries = await Promise.all(
          originalResume.scopedProfessionalSummaries.map(summary =>
            tx.scopedProfessionalSummary.create({
              data: {
                scopedResumeId: newResume.id,
                summaryText: summary.summaryText,
              },
            })
          )
        );

        // Duplicate scoped skills
        const newSkills = await Promise.all(
          originalResume.scopedSkills.map(skill =>
            tx.scopedSkill.create({
              data: {
                scopedResumeId: newResume.id,
                technicalSkillId: skill.technicalSkillId,
              },
              include: {
                technicalSkill: {
                  include: {
                    category: true,
                    subcategory: true,
                  },
                },
              },
            })
          )
        );

        // Duplicate scoped work experiences
        const newWorkExperiences = await Promise.all(
          originalResume.scopedWorkExperiences.map(workExp =>
            tx.scopedWorkExperience.create({
              data: {
                scopedResumeId: newResume.id,
                workExperienceId: workExp.workExperienceId,
              },
              include: {
                workExperience: true,
              },
            })
          )
        );

        // Duplicate scoped work experience lines
        const newWorkExperienceLines = await Promise.all(
          originalResume.scopedWorkExperienceLines.map(line =>
            tx.scopedWorkExperienceLine.create({
              data: {
                scopedResumeId: newResume.id,
                workExperienceLineId: line.workExperienceLineId,
                lineText: line.lineText,
              },
              include: {
                workExperienceLine: true,
              },
            })
          )
        );

        return {
          ...newResume,
          scopedProfessionalSummaries: newSummaries,
          scopedSkills: newSkills,
          scopedWorkExperiences: newWorkExperiences,
          scopedWorkExperienceLines: newWorkExperienceLines,
        };
      });

      return createSuccessResponse(result, 'Scoped resume duplicated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error duplicating scoped resume:', error);
      throw new AppError('Failed to duplicate scoped resume', 500);
    }
  }

  async deleteScopedResume(id: number): Promise<ApiResponse<null>> {
    try {
      const existingResume = await prisma.scopedResume.findUnique({
        where: { id },
      });
      
      if (!existingResume) {
        throw new AppError('Scoped resume not found', 404);
      }

      // Use transaction to delete all related data
      await prisma.$transaction(async (tx) => {
        // Delete all related scoped data (cascade delete)
        await tx.scopedProfessionalSummary.deleteMany({
          where: { scopedResumeId: id },
        });
        await tx.scopedSkill.deleteMany({
          where: { scopedResumeId: id },
        });
        await tx.scopedWorkExperience.deleteMany({
          where: { scopedResumeId: id },
        });
        await tx.scopedWorkExperienceLine.deleteMany({
          where: { scopedResumeId: id },
        });

        // Delete the scoped resume
        await tx.scopedResume.delete({
          where: { id },
        });
      });

      return createSuccessResponse(null, 'Scoped resume deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deleting scoped resume:', error);
      throw new AppError('Failed to delete scoped resume', 500);
    }
  }

  // ============ SCOPED PROFESSIONAL SUMMARY ============
  
  async updateScopedProfessionalSummary(scopedResumeId: number, data: UpdateScopedProfessionalSummaryInput): Promise<ApiResponse<ScopedProfessionalSummary>> {
    try {
      // Verify scoped resume exists
      const scopedResume = await prisma.scopedResume.findUnique({
        where: { id: scopedResumeId },
      });

      if (!scopedResume) {
        throw new AppError('Scoped resume not found', 404);
      }

      const validatedData = UpdateScopedProfessionalSummarySchema.parse(data);

      // Check if scoped summary already exists
      const existingSummary = await prisma.scopedProfessionalSummary.findFirst({
        where: { scopedResumeId },
      });

      let summary;
      if (existingSummary) {
        // Update existing
        summary = await prisma.scopedProfessionalSummary.update({
          where: { id: existingSummary.id },
          data: validatedData,
        });
      } else {
        // Create new
        summary = await prisma.scopedProfessionalSummary.create({
          data: {
            scopedResumeId,
            ...validatedData,
          },
        });
      }

      return createSuccessResponse(summary, 'Scoped professional summary updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error updating scoped professional summary:', error);
      throw new AppError('Failed to update scoped professional summary', 500);
    }
  }

  // ============ SCOPED SKILLS ============
  
  async addScopedSkill(data: ScopedSkillInput): Promise<ApiResponse<ScopedSkill>> {
    try {
      const validatedData = ScopedSkillSchema.parse(data);
      
      // Verify scoped resume and technical skill exist
      const [scopedResume, technicalSkill] = await Promise.all([
        prisma.scopedResume.findUnique({ where: { id: validatedData.scopedResumeId } }),
        prisma.technicalSkill.findUnique({ where: { id: validatedData.technicalSkillId } }),
      ]);

      if (!scopedResume) {
        throw new AppError('Scoped resume not found', 404);
      }

      if (!technicalSkill) {
        throw new AppError('Technical skill not found', 404);
      }

      // Check if skill is already in scoped resume
      const existingSkill = await prisma.scopedSkill.findFirst({
        where: {
          scopedResumeId: validatedData.scopedResumeId,
          technicalSkillId: validatedData.technicalSkillId,
        },
      });

      if (existingSkill) {
        throw new AppError('Skill already exists in this scoped resume', 409);
      }

      const scopedSkill = await prisma.scopedSkill.create({
        data: validatedData,
      });

      return createSuccessResponse(scopedSkill, 'Skill added to scoped resume successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error adding scoped skill:', error);
      throw new AppError('Failed to add scoped skill', 500);
    }
  }

  async removeScopedSkill(scopedResumeId: number, technicalSkillId: number): Promise<ApiResponse<null>> {
    try {
      const existingSkill = await prisma.scopedSkill.findFirst({
        where: {
          scopedResumeId,
          technicalSkillId,
        },
      });

      if (!existingSkill) {
        throw new AppError('Scoped skill not found', 404);
      }

      await prisma.scopedSkill.delete({
        where: { id: existingSkill.id },
      });

      return createSuccessResponse(null, 'Skill removed from scoped resume successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error removing scoped skill:', error);
      throw new AppError('Failed to remove scoped skill', 500);
    }
  }

  // ============ SCOPED WORK EXPERIENCES ============
  
  async addScopedWorkExperience(data: ScopedWorkExperienceInput): Promise<ApiResponse<ScopedWorkExperience>> {
    try {
      const validatedData = ScopedWorkExperienceSchema.parse(data);
      
      // Verify scoped resume and work experience exist
      const [scopedResume, workExperience] = await Promise.all([
        prisma.scopedResume.findUnique({ where: { id: validatedData.scopedResumeId } }),
        prisma.workExperience.findUnique({ where: { id: validatedData.workExperienceId } }),
      ]);

      if (!scopedResume) {
        throw new AppError('Scoped resume not found', 404);
      }

      if (!workExperience) {
        throw new AppError('Work experience not found', 404);
      }

      // Check if work experience is already in scoped resume
      const existingWorkExp = await prisma.scopedWorkExperience.findFirst({
        where: {
          scopedResumeId: validatedData.scopedResumeId,
          workExperienceId: validatedData.workExperienceId,
        },
      });

      if (existingWorkExp) {
        throw new AppError('Work experience already exists in this scoped resume', 409);
      }

      const scopedWorkExperience = await prisma.scopedWorkExperience.create({
        data: validatedData,
      });

      return createSuccessResponse(scopedWorkExperience, 'Work experience added to scoped resume successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error adding scoped work experience:', error);
      throw new AppError('Failed to add scoped work experience', 500);
    }
  }

  async removeScopedWorkExperience(scopedResumeId: number, workExperienceId: number): Promise<ApiResponse<null>> {
    try {
      const existingWorkExp = await prisma.scopedWorkExperience.findFirst({
        where: {
          scopedResumeId,
          workExperienceId,
        },
      });

      if (!existingWorkExp) {
        throw new AppError('Scoped work experience not found', 404);
      }

      // Use transaction to also remove any customized work experience lines for this work experience
      await prisma.$transaction(async (tx) => {
        // Remove customized lines for this work experience in this scoped resume
        await tx.scopedWorkExperienceLine.deleteMany({
          where: {
            scopedResumeId,
            workExperienceLine: {
              workExperienceId,
            },
          },
        });

        // Remove the scoped work experience
        await tx.scopedWorkExperience.delete({
          where: { id: existingWorkExp.id },
        });
      });

      return createSuccessResponse(null, 'Work experience removed from scoped resume successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error removing scoped work experience:', error);
      throw new AppError('Failed to remove scoped work experience', 500);
    }
  }

  // ============ SCOPED WORK EXPERIENCE LINES ============
  
  async updateScopedWorkExperienceLine(data: ScopedWorkExperienceLineInput): Promise<ApiResponse<ScopedWorkExperienceLine>> {
    try {
      const validatedData = ScopedWorkExperienceLineSchema.parse(data);
      
      // Verify scoped resume and work experience line exist
      const [scopedResume, workExperienceLine] = await Promise.all([
        prisma.scopedResume.findUnique({ where: { id: validatedData.scopedResumeId } }),
        prisma.workExperienceLine.findUnique({ where: { id: validatedData.workExperienceLineId } }),
      ]);

      if (!scopedResume) {
        throw new AppError('Scoped resume not found', 404);
      }

      if (!workExperienceLine) {
        throw new AppError('Work experience line not found', 404);
      }

      // Check if scoped work experience line already exists
      const existingLine = await prisma.scopedWorkExperienceLine.findFirst({
        where: {
          scopedResumeId: validatedData.scopedResumeId,
          workExperienceLineId: validatedData.workExperienceLineId,
        },
      });

      let scopedLine;
      if (existingLine) {
        // Update existing
        scopedLine = await prisma.scopedWorkExperienceLine.update({
          where: { id: existingLine.id },
          data: { lineText: validatedData.lineText },
        });
      } else {
        // Create new
        scopedLine = await prisma.scopedWorkExperienceLine.create({
          data: validatedData,
        });
      }

      return createSuccessResponse(scopedLine, 'Scoped work experience line updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error updating scoped work experience line:', error);
      throw new AppError('Failed to update scoped work experience line', 500);
    }
  }

  async removeScopedWorkExperienceLine(scopedResumeId: number, workExperienceLineId: number): Promise<ApiResponse<null>> {
    try {
      const existingLine = await prisma.scopedWorkExperienceLine.findFirst({
        where: {
          scopedResumeId,
          workExperienceLineId,
        },
      });

      if (!existingLine) {
        throw new AppError('Scoped work experience line not found', 404);
      }

      await prisma.scopedWorkExperienceLine.delete({
        where: { id: existingLine.id },
      });

      return createSuccessResponse(null, 'Scoped work experience line removed successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error removing scoped work experience line:', error);
      throw new AppError('Failed to remove scoped work experience line', 500);
    }
  }

  async removeScopedProfessionalSummary(scopedResumeId: number): Promise<ApiResponse<null>> {
    try {
      const existingSummary = await prisma.scopedProfessionalSummary.findFirst({
        where: { scopedResumeId },
      });

      if (!existingSummary) {
        throw new AppError('Scoped professional summary not found', 404);
      }

      await prisma.scopedProfessionalSummary.delete({
        where: { id: existingSummary.id },
      });

      return createSuccessResponse(null, 'Scoped professional summary removed successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error removing scoped professional summary:', error);
      throw new AppError('Failed to remove scoped professional summary', 500);
    }
  }
}