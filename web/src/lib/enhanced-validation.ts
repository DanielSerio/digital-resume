import { z } from 'zod';
import { addDays, isBefore, isAfter, parseISO } from 'date-fns';

// Enhanced validation helpers with cross-field validation and improved error messages

// Date validation with contextual error messages
export const createDateValidator = (fieldName: string, options: {
  required?: boolean;
  minDate?: Date | string;
  maxDate?: Date | string;
  futureOnly?: boolean;
  pastOnly?: boolean;
} = {}) => {
  let schema = z.date({
    errorMap: () => ({ message: `Please enter a valid ${fieldName.toLowerCase()}` })
  });

  if (!options.required) {
    schema = schema.optional();
  }

  return schema.refine((date) => {
    if (!date && !options.required) return true;
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Future only validation
    if (options.futureOnly && isBefore(date, today)) {
      throw new z.ZodError([{
        code: 'custom',
        message: `${fieldName} must be in the future`,
        path: []
      }]);
    }

    // Past only validation
    if (options.pastOnly && isAfter(date, today)) {
      throw new z.ZodError([{
        code: 'custom',
        message: `${fieldName} cannot be in the future`,
        path: []
      }]);
    }

    // Min date validation
    if (options.minDate) {
      const minDate = typeof options.minDate === 'string' ? parseISO(options.minDate) : options.minDate;
      if (isBefore(date, minDate)) {
        throw new z.ZodError([{
          code: 'custom',
          message: `${fieldName} must be after ${minDate.toLocaleDateString()}`,
          path: []
        }]);
      }
    }

    // Max date validation
    if (options.maxDate) {
      const maxDate = typeof options.maxDate === 'string' ? parseISO(options.maxDate) : options.maxDate;
      if (isAfter(date, maxDate)) {
        throw new z.ZodError([{
          code: 'custom',
          message: `${fieldName} must be before ${maxDate.toLocaleDateString()}`,
          path: []
        }]);
      }
    }

    return true;
  });
};

// Enhanced URL validation with better error messages
export const createEnhancedUrlValidator = (fieldName: string, options: {
  required?: boolean;
  allowedDomains?: string[];
  blockedDomains?: string[];
} = {}) => {
  let schema = z
    .string()
    .transform((val) => val?.trim() || '')
    .refine(
      (val) => {
        if (!val && !options.required) return true;
        if (!val && options.required) return false;

        // Allow domain-only URLs and full URLs
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
        return urlPattern.test(val);
      },
      { message: `Please enter a valid ${fieldName.toLowerCase()} URL (e.g., github.com/username or https://example.com)` }
    )
    .transform((val) => {
      if (!val || val === '') return val;
      // Add https:// if missing protocol
      return val.startsWith('http://') || val.startsWith('https://')
        ? val
        : `https://${val}`;
    });

  if (!options.required) {
    schema = schema.optional().or(z.literal(''));
  }

  return schema.refine((val) => {
    if (!val) return true;

    try {
      const url = new URL(val);
      const domain = url.hostname.toLowerCase();

      // Check allowed domains
      if (options.allowedDomains && options.allowedDomains.length > 0) {
        const isAllowed = options.allowedDomains.some(allowed =>
          domain === allowed.toLowerCase() || domain.endsWith(`.${allowed.toLowerCase()}`)
        );
        if (!isAllowed) {
          throw new z.ZodError([{
            code: 'custom',
            message: `${fieldName} must be from an allowed domain: ${options.allowedDomains.join(', ')}`,
            path: []
          }]);
        }
      }

      // Check blocked domains
      if (options.blockedDomains && options.blockedDomains.length > 0) {
        const isBlocked = options.blockedDomains.some(blocked =>
          domain === blocked.toLowerCase() || domain.endsWith(`.${blocked.toLowerCase()}`)
        );
        if (isBlocked) {
          throw new z.ZodError([{
            code: 'custom',
            message: `${fieldName} cannot be from ${domain}`,
            path: []
          }]);
        }
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) throw error;
      return false;
    }
  });
};

// Enhanced work experience validation with date range validation
export const enhancedWorkExperienceSchema = z.object({
  companyName: z.string()
    .min(1, 'Company name is required')
    .max(255, 'Company name must be less than 255 characters')
    .refine(val => val.trim().length > 0, 'Company name cannot be just whitespace'),

  jobTitle: z.string()
    .min(1, 'Job title is required')
    .max(255, 'Job title must be less than 255 characters')
    .refine(val => val.trim().length > 0, 'Job title cannot be just whitespace'),

  companyCity: z.string()
    .max(255, 'Company city must be less than 255 characters')
    .optional()
    .or(z.literal('')),

  companyState: z.string()
    .max(255, 'Company state must be less than 255 characters')
    .optional()
    .or(z.literal('')),

  startDate: createDateValidator('Start date', {
    required: true,
    pastOnly: true
  }),

  endDate: createDateValidator('End date', {
    required: false,
    pastOnly: true
  }).optional().or(z.literal(null)),
}).refine((data) => {
  // Cross-field validation: end date must be after start date
  if (data.endDate && data.startDate) {
    if (isBefore(data.endDate, data.startDate)) {
      throw new z.ZodError([{
        code: 'custom',
        message: 'End date must be after start date',
        path: ['endDate']
      }]);
    }

    // Warn if date range is very long (more than 15 years)
    const yearsDiff = (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearsDiff > 15) {
      console.warn('Work experience duration is unusually long (>15 years)');
    }
  }

  return true;
});

// Enhanced education validation with date range validation
export const enhancedEducationSchema = z.object({
  schoolName: z.string()
    .min(1, 'School name is required')
    .max(255, 'School name must be less than 255 characters')
    .refine(val => val.trim().length > 0, 'School name cannot be just whitespace'),

  schoolCity: z.string()
    .min(1, 'School city is required')
    .max(100, 'School city must be less than 100 characters')
    .refine(val => val.trim().length > 0, 'School city cannot be just whitespace'),

  schoolState: z.string()
    .min(1, 'School state is required')
    .max(100, 'School state must be less than 100 characters')
    .refine(val => val.trim().length > 0, 'School state cannot be just whitespace'),

  degreeType: z.string()
    .min(1, 'Degree type is required')
    .max(50, 'Degree type must be less than 50 characters')
    .refine(val => val.trim().length > 0, 'Degree type cannot be just whitespace'),

  degreeTitle: z.string()
    .min(1, 'Degree title is required')
    .max(255, 'Degree title must be less than 255 characters')
    .refine(val => val.trim().length > 0, 'Degree title cannot be just whitespace'),

  dateStarted: createDateValidator('Start date', {
    required: true,
    pastOnly: true
  }),

  dateFinished: createDateValidator('End date', {
    required: false,
    pastOnly: true
  }).optional().or(z.literal(null)),
}).refine((data) => {
  // Cross-field validation: end date must be after start date
  if (data.dateFinished && data.dateStarted) {
    if (isBefore(data.dateFinished, data.dateStarted)) {
      throw new z.ZodError([{
        code: 'custom',
        message: 'End date must be after start date',
        path: ['dateFinished']
      }]);
    }

    // Warn if education duration is very long (more than 10 years)
    const yearsDiff = (data.dateFinished.getTime() - data.dateStarted.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearsDiff > 10) {
      console.warn('Education duration is unusually long (>10 years)');
    }
  }

  return true;
});

// Enhanced contact validation with domain-specific validation
export const enhancedContactSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .refine(val => val.trim().length > 0, 'Name cannot be just whitespace')
    .refine(val => {
      // Basic name pattern validation (at least one letter, can contain spaces, hyphens, apostrophes)
      const namePattern = /^[a-zA-Z\s\-'\.]+$/;
      return namePattern.test(val.trim());
    }, 'Name can only contain letters, spaces, hyphens, and apostrophes'),

  title: z.string()
    .max(255, 'Title must be less than 255 characters')
    .optional()
    .or(z.literal('')),

  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .optional()
    .or(z.literal(''))
    .refine(val => {
      if (!val) return true;
      // Additional email validation for common typos
      const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      const emailDomain = val.split('@')[1]?.toLowerCase();

      // Check for common typos
      const typos: Record<string, string> = {
        'gmial.com': 'gmail.com',
        'gmai.com': 'gmail.com',
        'yahooo.com': 'yahoo.com',
        'hotmial.com': 'hotmail.com'
      };

      if (emailDomain && typos[emailDomain]) {
        console.warn(`Possible email typo: did you mean ${val.replace(emailDomain, typos[emailDomain])}?`);
      }

      return true;
    }),

  phone: z.string()
    .max(50, 'Phone number must be less than 50 characters')
    .optional()
    .or(z.literal(''))
    .refine(val => {
      if (!val) return true;
      // Allow various phone number formats
      const phonePattern = /^[\+]?[\d\s\-\(\)\.]+$/;
      return phonePattern.test(val);
    }, 'Please enter a valid phone number'),

  github: createEnhancedUrlValidator('GitHub', {
    allowedDomains: ['github.com']
  }),

  website: createEnhancedUrlValidator('Website'),

  linkedin: createEnhancedUrlValidator('LinkedIn', {
    allowedDomains: ['linkedin.com']
  }),
});

// Enhanced skill validation with category consistency
export const enhancedTechnicalSkillSchema = z.object({
  name: z.string()
    .min(1, 'Skill name is required')
    .max(100, 'Skill name must be less than 100 characters')
    .refine(val => val.trim().length > 0, 'Skill name cannot be just whitespace')
    .transform(val => val.trim()),

  categoryId: z.number()
    .int('Category must be a valid selection')
    .positive('Please select a category'),

  subcategoryId: z.number()
    .int('Subcategory must be a valid selection')
    .positive('Please select a subcategory'),
});


// Error formatting utilities
export const formatValidationErrors = (error: z.ZodError): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};

  error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });

  return errors;
};

export const getFirstValidationError = (error: z.ZodError): string => {
  return error.issues[0]?.message || 'Validation failed';
};

// Type exports
export type EnhancedWorkExperienceFormData = z.infer<typeof enhancedWorkExperienceSchema>;
export type EnhancedEducationFormData = z.infer<typeof enhancedEducationSchema>;
export type EnhancedContactFormData = z.infer<typeof enhancedContactSchema>;
export type EnhancedTechnicalSkillFormData = z.infer<typeof enhancedTechnicalSkillSchema>;