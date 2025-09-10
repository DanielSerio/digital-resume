import { z } from 'zod';

// Frontend Zod schemas compatible with backend validation
// These schemas match the backend structure but are optimized for form validation

// Contact validation schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  title: z.string().max(255, 'Title is too long').optional().or(z.literal('')),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email is too long')
    .optional()
    .or(z.literal('')),
  phone: z.string().max(50, 'Phone number is too long').optional().or(z.literal('')),
  github: z.string().url('Invalid URL format').optional().or(z.literal('')),
  website: z.string().url('Invalid URL format').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Professional Summary validation schema
export const professionalSummarySchema = z.object({
  summaryText: z
    .string()
    .min(1, 'Professional summary is required')
    .max(2000, 'Summary is too long'),
});

export type ProfessionalSummaryFormData = z.infer<typeof professionalSummarySchema>;

// Technical Skill validation schema
export const technicalSkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(100, 'Skill name is too long'),
  categoryId: z.number().int().positive('Category is required'),
  subcategoryId: z.number().int().positive('Subcategory is required'),
});

export type TechnicalSkillFormData = z.infer<typeof technicalSkillSchema>;

// Skill Category validation schema
export const skillCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name is too long'),
});

export type SkillCategoryFormData = z.infer<typeof skillCategorySchema>;

// Skill Subcategory validation schema
export const skillSubcategorySchema = z.object({
  name: z.string().min(1, 'Subcategory name is required').max(100, 'Subcategory name is too long'),
});

export type SkillSubcategoryFormData = z.infer<typeof skillSubcategorySchema>;

// Education validation schema
export const educationSchema = z.object({
  schoolName: z.string().min(1, 'School name is required').max(255, 'School name is too long'),
  location: z.string().max(255, 'Location is too long').optional().or(z.literal('')),
  degree: z.string().max(255, 'Degree is too long').optional().or(z.literal('')),
  fieldOfStudy: z.string().max(255, 'Field of study is too long').optional().or(z.literal('')),
  startDate: z.date().optional().or(z.literal(null)),
  endDate: z.date().optional().or(z.literal(null)),
  gpa: z.string().max(10, 'GPA is too long').optional().or(z.literal('')),
  honors: z.string().max(255, 'Honors is too long').optional().or(z.literal('')),
  relevantCoursework: z
    .string()
    .max(1000, 'Relevant coursework is too long')
    .optional()
    .or(z.literal('')),
});

export type EducationFormData = z.infer<typeof educationSchema>;

// Work Experience validation schema
export const workExperienceSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(255, 'Company name is too long'),
  jobTitle: z.string().min(1, 'Job title is required').max(255, 'Job title is too long'),
  location: z.string().max(255, 'Location is too long').optional().or(z.literal('')),
  startDate: z.date().optional().or(z.literal(null)),
  endDate: z.date().optional().or(z.literal(null)),
  description: z.string().max(1000, 'Description is too long').optional().or(z.literal('')),
});

export type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;

// Work Experience Line validation schema
export const workExperienceLineSchema = z.object({
  lineText: z.string().min(1, 'Line text is required').max(500, 'Line text is too long'),
  sortOrder: z.number().int().nonnegative('Sort order must be non-negative'),
});

export type WorkExperienceLineFormData = z.infer<typeof workExperienceLineSchema>;

// Complete Work Experience with Lines validation schema
export const completeWorkExperienceSchema = workExperienceSchema.extend({
  lines: z.array(workExperienceLineSchema).default([]),
});

export type CompleteWorkExperienceFormData = z.infer<typeof completeWorkExperienceSchema>;

// Scoped Resume validation schema
export const scopedResumeSchema = z.object({
  name: z.string().min(1, 'Resume name is required').max(255, 'Resume name is too long'),
});

export type ScopedResumeFormData = z.infer<typeof scopedResumeSchema>;

// Date validation helpers
export const dateStringSchema = z
  .string()
  .optional()
  .transform((str) => (str ? new Date(str) : undefined))
  .refine((date) => !date || !isNaN(date.getTime()), {
    message: 'Invalid date format',
  });

// Form validation utility functions
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
} => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      return { success: false, errors };
    }
    return {
      success: false,
      errors: { _general: ['Validation failed'] }
    };
  }
};

// Helper to convert empty strings to null for optional fields
export const transformOptionalString = (value: string | undefined | null) => {
  return value === '' || value === undefined ? null : value;
};

// Helper to format dates for form inputs
export const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

// Helper to parse date from form input
export const parseDateFromInput = (dateString: string): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};