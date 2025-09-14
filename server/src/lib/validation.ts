import { z } from 'zod';

// Contact validation schemas
export const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  title: z.string().max(255).optional(),
  email: z.string().email('Invalid email format').max(255).optional(),
  phone: z.string().max(50).optional(),
  github: z.string().url('Invalid GitHub URL').max(255).optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').max(255).optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').max(255).optional().or(z.literal('')),
});

export const UpdateContactSchema = ContactSchema.partial();

// Professional Summary validation schemas
export const ProfessionalSummarySchema = z.object({
  summaryText: z.string().min(1, 'Summary text is required'),
});

export const UpdateProfessionalSummarySchema = ProfessionalSummarySchema.partial();

// Skill Category validation schemas
export const SkillCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
});

export const UpdateSkillCategorySchema = SkillCategorySchema.partial();

// Skill Subcategory validation schemas
export const SkillSubcategorySchema = z.object({
  name: z.string().min(1, 'Subcategory name is required').max(100),
});

export const UpdateSkillSubcategorySchema = SkillSubcategorySchema.partial();

// Technical Skill validation schemas
export const TechnicalSkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(255),
  categoryId: z.number().int().positive('Category ID must be a positive integer'),
  subcategoryId: z.number().int().positive('Subcategory ID must be a positive integer'),
});

export const UpdateTechnicalSkillSchema = TechnicalSkillSchema.partial();

// Education validation schemas
export const EducationSchema = z.object({
  schoolName: z.string().min(1, 'School name is required').max(255),
  schoolCity: z.string().min(1, 'School city is required').max(100),
  schoolState: z.string().min(1, 'School state/province is required').max(100),
  degreeType: z.string().min(1, 'Degree type is required').max(50),
  degreeTitle: z.string().min(1, 'Degree title is required').max(255),
  dateStarted: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Invalid start date format'),
  dateFinished: z.string().optional().refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Invalid finish date format'),
});

export const UpdateEducationSchema = EducationSchema.partial();

// Work Experience validation schemas
export const WorkExperienceSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(255),
  companyTagline: z.string().max(255).optional(),
  companyCity: z.string().min(1, 'Company city is required').max(100),
  companyState: z.string().min(1, 'Company state/province is required').max(100),
  jobTitle: z.string().min(1, 'Job title is required').max(255),
  dateStarted: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Invalid start date format'),
  dateEnded: z.string().nullish().refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Invalid end date format'),
});

export const UpdateWorkExperienceSchema = WorkExperienceSchema.partial();

// Work Experience Line validation schemas
export const WorkExperienceLineSchema = z.object({
  workExperienceId: z.number().int().positive('Work experience ID must be a positive integer'),
  lineText: z.string().min(1, 'Line text is required'),
  sortOrder: z.number().int().nonnegative('Sort order must be non-negative'),
});

export const UpdateWorkExperienceLineSchema = WorkExperienceLineSchema.partial();

// Work Experience with Lines (for creation with transaction)
export const WorkExperienceWithLinesSchema = z.object({
  workExperience: WorkExperienceSchema,
  lines: z.array(z.object({
    lineText: z.string().min(1, 'Line text is required'),
    sortOrder: z.number().int().nonnegative('Sort order must be non-negative'),
  })).optional().default([]),
});

// Scoped Resume validation schemas
export const ScopedResumeSchema = z.object({
  name: z.string().min(1, 'Scoped resume name is required').max(255),
});

export const UpdateScopedResumeSchema = ScopedResumeSchema.partial();

export const ScopedProfessionalSummarySchema = z.object({
  scopedResumeId: z.number().int().positive('Scoped resume ID must be a positive integer'),
  summaryText: z.string().min(1, 'Summary text is required'),
});

export const UpdateScopedProfessionalSummarySchema = ScopedProfessionalSummarySchema.partial();

export const ScopedSkillSchema = z.object({
  scopedResumeId: z.number().int().positive('Scoped resume ID must be a positive integer'),
  technicalSkillId: z.number().int().positive('Technical skill ID must be a positive integer'),
});

export const ScopedWorkExperienceSchema = z.object({
  scopedResumeId: z.number().int().positive('Scoped resume ID must be a positive integer'),
  workExperienceId: z.number().int().positive('Work experience ID must be a positive integer'),
});

export const ScopedWorkExperienceLineSchema = z.object({
  scopedResumeId: z.number().int().positive('Scoped resume ID must be a positive integer'),
  workExperienceLineId: z.number().int().positive('Work experience line ID must be a positive integer'),
  lineText: z.string().min(1, 'Line text is required'),
});

export const UpdateScopedWorkExperienceLineSchema = ScopedWorkExperienceLineSchema.partial();

// Bulk operations for scoped resume setup
export const ScopedResumeSetupSchema = z.object({
  name: z.string().min(1, 'Scoped resume name is required').max(255),
  professionalSummary: z.string().optional(),
  skillIds: z.array(z.number().int().positive()).optional().default([]),
  workExperienceIds: z.array(z.number().int().positive()).optional().default([]),
});

// Type exports
export type ContactInput = z.infer<typeof ContactSchema>;
export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;
export type ProfessionalSummaryInput = z.infer<typeof ProfessionalSummarySchema>;
export type UpdateProfessionalSummaryInput = z.infer<typeof UpdateProfessionalSummarySchema>;
export type SkillCategoryInput = z.infer<typeof SkillCategorySchema>;
export type UpdateSkillCategoryInput = z.infer<typeof UpdateSkillCategorySchema>;
export type SkillSubcategoryInput = z.infer<typeof SkillSubcategorySchema>;
export type UpdateSkillSubcategoryInput = z.infer<typeof UpdateSkillSubcategorySchema>;
export type TechnicalSkillInput = z.infer<typeof TechnicalSkillSchema>;
export type UpdateTechnicalSkillInput = z.infer<typeof UpdateTechnicalSkillSchema>;
export type EducationInput = z.infer<typeof EducationSchema>;
export type UpdateEducationInput = z.infer<typeof UpdateEducationSchema>;
export type WorkExperienceInput = z.infer<typeof WorkExperienceSchema>;
export type UpdateWorkExperienceInput = z.infer<typeof UpdateWorkExperienceSchema>;
export type WorkExperienceLineInput = z.infer<typeof WorkExperienceLineSchema>;
export type UpdateWorkExperienceLineInput = z.infer<typeof UpdateWorkExperienceLineSchema>;
export type WorkExperienceWithLinesInput = z.infer<typeof WorkExperienceWithLinesSchema>;
export type ScopedResumeInput = z.infer<typeof ScopedResumeSchema>;
export type UpdateScopedResumeInput = z.infer<typeof UpdateScopedResumeSchema>;
export type ScopedProfessionalSummaryInput = z.infer<typeof ScopedProfessionalSummarySchema>;
export type UpdateScopedProfessionalSummaryInput = z.infer<typeof UpdateScopedProfessionalSummarySchema>;
export type ScopedSkillInput = z.infer<typeof ScopedSkillSchema>;
export type ScopedWorkExperienceInput = z.infer<typeof ScopedWorkExperienceSchema>;
export type ScopedWorkExperienceLineInput = z.infer<typeof ScopedWorkExperienceLineSchema>;
export type UpdateScopedWorkExperienceLineInput = z.infer<typeof UpdateScopedWorkExperienceLineSchema>;
export type ScopedResumeSetupInput = z.infer<typeof ScopedResumeSetupSchema>;