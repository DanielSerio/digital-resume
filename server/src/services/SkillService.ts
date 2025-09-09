import { prisma } from '../lib/prisma';
import { AppError, ApiResponse, createSuccessResponse } from '../lib/errors';
import { 
  SkillCategorySchema, 
  UpdateSkillCategorySchema,
  SkillSubcategorySchema,
  UpdateSkillSubcategorySchema,
  TechnicalSkillSchema,
  UpdateTechnicalSkillSchema,
  SkillCategoryInput,
  UpdateSkillCategoryInput,
  SkillSubcategoryInput,
  UpdateSkillSubcategoryInput,
  TechnicalSkillInput,
  UpdateTechnicalSkillInput
} from '../lib/validation';
import { SkillCategory, SkillSubcategory, TechnicalSkill } from '@prisma/client';

export class SkillService {
  
  // ============ SKILL CATEGORIES ============
  
  async getSkillCategories(): Promise<ApiResponse<SkillCategory[]>> {
    try {
      const categories = await prisma.skillCategory.findMany({
        orderBy: { name: 'asc' },
      });
      return createSuccessResponse(categories, 'Skill categories retrieved successfully');
    } catch (error) {
      console.error('Error fetching skill categories:', error);
      throw new AppError('Failed to fetch skill categories', 500);
    }
  }

  async getSkillCategoryById(id: number): Promise<ApiResponse<SkillCategory | null>> {
    try {
      const category = await prisma.skillCategory.findUnique({
        where: { id },
      });
      return createSuccessResponse(category, category ? 'Skill category retrieved successfully' : 'Skill category not found');
    } catch (error) {
      console.error('Error fetching skill category:', error);
      throw new AppError('Failed to fetch skill category', 500);
    }
  }

  async createSkillCategory(data: SkillCategoryInput): Promise<ApiResponse<SkillCategory>> {
    try {
      const validatedData = SkillCategorySchema.parse(data);
      
      // Check for duplicate name
      const existingCategory = await prisma.skillCategory.findUnique({
        where: { name: validatedData.name },
      });
      
      if (existingCategory) {
        throw new AppError('Skill category with this name already exists', 409);
      }

      const category = await prisma.skillCategory.create({
        data: validatedData,
      });

      return createSuccessResponse(category, 'Skill category created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error creating skill category:', error);
      throw new AppError('Failed to create skill category', 500);
    }
  }

  async updateSkillCategory(id: number, data: UpdateSkillCategoryInput): Promise<ApiResponse<SkillCategory>> {
    try {
      const validatedData = UpdateSkillCategorySchema.parse(data);
      
      // Check if category exists
      const existingCategory = await prisma.skillCategory.findUnique({
        where: { id },
      });
      
      if (!existingCategory) {
        throw new AppError('Skill category not found', 404);
      }

      // Check for duplicate name if name is being updated
      if (validatedData.name && validatedData.name !== existingCategory.name) {
        const duplicateCategory = await prisma.skillCategory.findUnique({
          where: { name: validatedData.name },
        });
        
        if (duplicateCategory) {
          throw new AppError('Skill category with this name already exists', 409);
        }
      }

      const updatedCategory = await prisma.skillCategory.update({
        where: { id },
        data: validatedData,
      });

      return createSuccessResponse(updatedCategory, 'Skill category updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error updating skill category:', error);
      throw new AppError('Failed to update skill category', 500);
    }
  }

  async deleteSkillCategory(id: number): Promise<ApiResponse<null>> {
    try {
      // Check if category exists
      const existingCategory = await prisma.skillCategory.findUnique({
        where: { id },
        include: { technicalSkills: true },
      });
      
      if (!existingCategory) {
        throw new AppError('Skill category not found', 404);
      }

      // Check if category is being used by technical skills
      if (existingCategory.technicalSkills.length > 0) {
        throw new AppError('Cannot delete skill category that is being used by technical skills', 409);
      }

      await prisma.skillCategory.delete({
        where: { id },
      });

      return createSuccessResponse(null, 'Skill category deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deleting skill category:', error);
      throw new AppError('Failed to delete skill category', 500);
    }
  }

  // ============ SKILL SUBCATEGORIES ============
  
  async getSkillSubcategories(): Promise<ApiResponse<SkillSubcategory[]>> {
    try {
      const subcategories = await prisma.skillSubcategory.findMany({
        orderBy: { name: 'asc' },
      });
      return createSuccessResponse(subcategories, 'Skill subcategories retrieved successfully');
    } catch (error) {
      console.error('Error fetching skill subcategories:', error);
      throw new AppError('Failed to fetch skill subcategories', 500);
    }
  }

  async getSkillSubcategoryById(id: number): Promise<ApiResponse<SkillSubcategory | null>> {
    try {
      const subcategory = await prisma.skillSubcategory.findUnique({
        where: { id },
      });
      return createSuccessResponse(subcategory, subcategory ? 'Skill subcategory retrieved successfully' : 'Skill subcategory not found');
    } catch (error) {
      console.error('Error fetching skill subcategory:', error);
      throw new AppError('Failed to fetch skill subcategory', 500);
    }
  }

  async createSkillSubcategory(data: SkillSubcategoryInput): Promise<ApiResponse<SkillSubcategory>> {
    try {
      const validatedData = SkillSubcategorySchema.parse(data);
      
      // Check for duplicate name
      const existingSubcategory = await prisma.skillSubcategory.findUnique({
        where: { name: validatedData.name },
      });
      
      if (existingSubcategory) {
        throw new AppError('Skill subcategory with this name already exists', 409);
      }

      const subcategory = await prisma.skillSubcategory.create({
        data: validatedData,
      });

      return createSuccessResponse(subcategory, 'Skill subcategory created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error creating skill subcategory:', error);
      throw new AppError('Failed to create skill subcategory', 500);
    }
  }

  async updateSkillSubcategory(id: number, data: UpdateSkillSubcategoryInput): Promise<ApiResponse<SkillSubcategory>> {
    try {
      const validatedData = UpdateSkillSubcategorySchema.parse(data);
      
      // Check if subcategory exists
      const existingSubcategory = await prisma.skillSubcategory.findUnique({
        where: { id },
      });
      
      if (!existingSubcategory) {
        throw new AppError('Skill subcategory not found', 404);
      }

      // Check for duplicate name if name is being updated
      if (validatedData.name && validatedData.name !== existingSubcategory.name) {
        const duplicateSubcategory = await prisma.skillSubcategory.findUnique({
          where: { name: validatedData.name },
        });
        
        if (duplicateSubcategory) {
          throw new AppError('Skill subcategory with this name already exists', 409);
        }
      }

      const updatedSubcategory = await prisma.skillSubcategory.update({
        where: { id },
        data: validatedData,
      });

      return createSuccessResponse(updatedSubcategory, 'Skill subcategory updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error updating skill subcategory:', error);
      throw new AppError('Failed to update skill subcategory', 500);
    }
  }

  async deleteSkillSubcategory(id: number): Promise<ApiResponse<null>> {
    try {
      // Check if subcategory exists
      const existingSubcategory = await prisma.skillSubcategory.findUnique({
        where: { id },
        include: { technicalSkills: true },
      });
      
      if (!existingSubcategory) {
        throw new AppError('Skill subcategory not found', 404);
      }

      // Check if subcategory is being used by technical skills
      if (existingSubcategory.technicalSkills.length > 0) {
        throw new AppError('Cannot delete skill subcategory that is being used by technical skills', 409);
      }

      await prisma.skillSubcategory.delete({
        where: { id },
      });

      return createSuccessResponse(null, 'Skill subcategory deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deleting skill subcategory:', error);
      throw new AppError('Failed to delete skill subcategory', 500);
    }
  }

  // ============ TECHNICAL SKILLS ============
  
  async getTechnicalSkills(): Promise<ApiResponse<TechnicalSkill[]>> {
    try {
      const skills = await prisma.technicalSkill.findMany({
        include: {
          category: true,
          subcategory: true,
        },
        orderBy: [
          { category: { name: 'asc' } },
          { subcategory: { name: 'asc' } },
          { name: 'asc' },
        ],
      });
      return createSuccessResponse(skills, 'Technical skills retrieved successfully');
    } catch (error) {
      console.error('Error fetching technical skills:', error);
      throw new AppError('Failed to fetch technical skills', 500);
    }
  }

  async getTechnicalSkillById(id: number): Promise<ApiResponse<TechnicalSkill | null>> {
    try {
      const skill = await prisma.technicalSkill.findUnique({
        where: { id },
        include: {
          category: true,
          subcategory: true,
        },
      });
      return createSuccessResponse(skill, skill ? 'Technical skill retrieved successfully' : 'Technical skill not found');
    } catch (error) {
      console.error('Error fetching technical skill:', error);
      throw new AppError('Failed to fetch technical skill', 500);
    }
  }

  async createTechnicalSkill(data: TechnicalSkillInput): Promise<ApiResponse<TechnicalSkill>> {
    try {
      const validatedData = TechnicalSkillSchema.parse(data);
      
      // Verify that category and subcategory exist
      const [category, subcategory] = await Promise.all([
        prisma.skillCategory.findUnique({ where: { id: validatedData.categoryId } }),
        prisma.skillSubcategory.findUnique({ where: { id: validatedData.subcategoryId } }),
      ]);

      if (!category) {
        throw new AppError('Skill category not found', 404);
      }

      if (!subcategory) {
        throw new AppError('Skill subcategory not found', 404);
      }

      const skill = await prisma.technicalSkill.create({
        data: validatedData,
        include: {
          category: true,
          subcategory: true,
        },
      });

      return createSuccessResponse(skill, 'Technical skill created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error creating technical skill:', error);
      throw new AppError('Failed to create technical skill', 500);
    }
  }

  async updateTechnicalSkill(id: number, data: UpdateTechnicalSkillInput): Promise<ApiResponse<TechnicalSkill>> {
    try {
      const validatedData = UpdateTechnicalSkillSchema.parse(data);
      
      // Check if skill exists
      const existingSkill = await prisma.technicalSkill.findUnique({
        where: { id },
      });
      
      if (!existingSkill) {
        throw new AppError('Technical skill not found', 404);
      }

      // Verify that category and subcategory exist if they're being updated
      if (validatedData.categoryId || validatedData.subcategoryId) {
        const categoryId = validatedData.categoryId || existingSkill.categoryId;
        const subcategoryId = validatedData.subcategoryId || existingSkill.subcategoryId;

        const [category, subcategory] = await Promise.all([
          prisma.skillCategory.findUnique({ where: { id: categoryId } }),
          prisma.skillSubcategory.findUnique({ where: { id: subcategoryId } }),
        ]);

        if (!category) {
          throw new AppError('Skill category not found', 404);
        }

        if (!subcategory) {
          throw new AppError('Skill subcategory not found', 404);
        }
      }

      const updatedSkill = await prisma.technicalSkill.update({
        where: { id },
        data: validatedData,
        include: {
          category: true,
          subcategory: true,
        },
      });

      return createSuccessResponse(updatedSkill, 'Technical skill updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error updating technical skill:', error);
      throw new AppError('Failed to update technical skill', 500);
    }
  }

  async deleteTechnicalSkill(id: number): Promise<ApiResponse<null>> {
    try {
      // Check if skill exists
      const existingSkill = await prisma.technicalSkill.findUnique({
        where: { id },
        include: { scopedSkills: true },
      });
      
      if (!existingSkill) {
        throw new AppError('Technical skill not found', 404);
      }

      // Check if skill is being used in scoped resumes
      if (existingSkill.scopedSkills.length > 0) {
        throw new AppError('Cannot delete technical skill that is being used in scoped resumes', 409);
      }

      await prisma.technicalSkill.delete({
        where: { id },
      });

      return createSuccessResponse(null, 'Technical skill deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deleting technical skill:', error);
      throw new AppError('Failed to delete technical skill', 500);
    }
  }
}