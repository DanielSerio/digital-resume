import { z } from 'zod';
import type {
  Contact,
  ProfessionalSummary,
  TechnicalSkill,
  Education,
  WorkExperience,
  SkillCategory,
  SkillSubcategory,
  ScopedResume,
} from '@/types';

// Data integrity validation schemas and utilities

export interface IntegrityCheckResult {
  isValid: boolean;
  warnings: Array<{
    type: 'warning' | 'error' | 'info';
    field: string;
    message: string;
    suggestion?: string;
  }>;
  errors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

// Contact integrity checks
export const validateContactIntegrity = (contact: Contact): IntegrityCheckResult => {
  const warnings: IntegrityCheckResult['warnings'] = [];
  const errors: IntegrityCheckResult['errors'] = [];

  // Check for completeness
  if (!contact.email && !contact.phone) {
    warnings.push({
      type: 'warning',
      field: 'contact',
      message: 'No contact method provided',
      suggestion: 'Add an email address or phone number'
    });
  }

  if (!contact.github && !contact.linkedin && !contact.website) {
    warnings.push({
      type: 'info',
      field: 'contact',
      message: 'No professional links provided',
      suggestion: 'Consider adding GitHub, LinkedIn, or personal website'
    });
  }

  // Validate URL accessibility (basic checks)
  const urlFields = [
    { field: 'github', value: contact.github },
    { field: 'linkedin', value: contact.linkedin },
    { field: 'website', value: contact.website }
  ];

  urlFields.forEach(({ field, value }) => {
    if (value) {
      try {
        const url = new URL(value);

        // Check for common issues
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          warnings.push({
            type: 'warning',
            field: field,
            message: 'URL should use http or https protocol'
          });
        }

        // GitHub-specific checks
        if (field === 'github' && !url.hostname.includes('github.com')) {
          warnings.push({
            type: 'warning',
            field: field,
            message: 'GitHub URL should point to github.com'
          });
        }

        // LinkedIn-specific checks
        if (field === 'linkedin' && !url.hostname.includes('linkedin.com')) {
          warnings.push({
            type: 'warning',
            field: field,
            message: 'LinkedIn URL should point to linkedin.com'
          });
        }
      } catch (e) {
        errors.push({
          field: field,
          message: 'Invalid URL format',
          code: 'INVALID_URL'
        });
      }
    }
  });

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
};

// Professional summary integrity checks
export const validateSummaryIntegrity = (summary: ProfessionalSummary): IntegrityCheckResult => {
  const warnings: IntegrityCheckResult['warnings'] = [];
  const errors: IntegrityCheckResult['errors'] = [];

  const text = summary.summaryText?.trim() || '';
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

  // Check length appropriateness
  if (wordCount < 20) {
    warnings.push({
      type: 'warning',
      field: 'summaryText',
      message: 'Professional summary is quite short',
      suggestion: 'Consider expanding to 20-100 words for better impact'
    });
  }

  if (wordCount > 150) {
    warnings.push({
      type: 'warning',
      field: 'summaryText',
      message: 'Professional summary is quite long',
      suggestion: 'Consider condensing to 50-100 words for better readability'
    });
  }

  // Check for common issues
  if (text.toLowerCase().includes('lorem ipsum')) {
    warnings.push({
      type: 'error',
      field: 'summaryText',
      message: 'Summary contains placeholder text'
    });
  }

  // Check for first-person pronouns (resume best practice)
  const firstPersonPronouns = ['I ', ' I ', 'my ', ' my ', 'me ', ' me '];
  const hasFirstPerson = firstPersonPronouns.some(pronoun =>
    text.toLowerCase().includes(pronoun.toLowerCase())
  );

  if (hasFirstPerson) {
    warnings.push({
      type: 'info',
      field: 'summaryText',
      message: 'Consider using third-person perspective in professional summary',
      suggestion: 'Remove "I", "my", "me" for more professional tone'
    });
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
};

// Skills integrity checks
export const validateSkillsIntegrity = (
  skills: TechnicalSkill[],
  categories: SkillCategory[],
  subcategories: SkillSubcategory[]
): IntegrityCheckResult => {
  const warnings: IntegrityCheckResult['warnings'] = [];
  const errors: IntegrityCheckResult['errors'] = [];

  // Check for orphaned skills (invalid category/subcategory references)
  skills.forEach(skill => {
    const category = categories.find(c => c.id === skill.categoryId);
    const subcategory = subcategories.find(s => s.id === skill.subcategoryId);

    if (!category) {
      errors.push({
        field: `skill-${skill.id}`,
        message: `Skill "${skill.name}" references non-existent category`,
        code: 'ORPHANED_SKILL_CATEGORY'
      });
    }

    if (!subcategory) {
      errors.push({
        field: `skill-${skill.id}`,
        message: `Skill "${skill.name}" references non-existent subcategory`,
        code: 'ORPHANED_SKILL_SUBCATEGORY'
      });
    }
  });

  // Check for duplicate skills
  const skillNames = skills.map(s => s.name.toLowerCase().trim());
  const duplicates = skillNames.filter((name, index) =>
    skillNames.indexOf(name) !== index
  );

  duplicates.forEach(duplicate => {
    warnings.push({
      type: 'warning',
      field: 'skills',
      message: `Duplicate skill found: "${duplicate}"`,
      suggestion: 'Consider removing or consolidating duplicate skills'
    });
  });

  // Check for skill distribution
  const categoryCounts = skills.reduce((acc, skill) => {
    const category = categories.find(c => c.id === skill.categoryId);
    if (category) {
      acc[category.name] = (acc[category.name] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > 15) {
      warnings.push({
        type: 'info',
        field: 'skills',
        message: `Many skills in "${category}" category (${count})`,
        suggestion: 'Consider grouping similar skills or using subcategories'
      });
    }
  });

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
};

// Work experience integrity checks
export const validateWorkExperienceIntegrity = (workExperiences: WorkExperience[]): IntegrityCheckResult => {
  const warnings: IntegrityCheckResult['warnings'] = [];
  const errors: IntegrityCheckResult['errors'] = [];

  workExperiences.forEach((exp, index) => {
    // Check date consistency
    if (exp.dateStarted && exp.dateEnded) {
      const startDate = new Date(exp.dateStarted);
      const endDate = new Date(exp.dateEnded);

      if (endDate <= startDate) {
        errors.push({
          field: `workExperience-${exp.id}-dates`,
          message: `End date must be after start date for ${exp.companyName}`,
          code: 'INVALID_DATE_RANGE'
        });
      }

      // Check for unrealistic durations
      const yearsDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      if (yearsDiff > 20) {
        warnings.push({
          type: 'warning',
          field: `workExperience-${exp.id}-duration`,
          message: `Very long tenure at ${exp.companyName} (${Math.round(yearsDiff)} years)`,
          suggestion: 'Verify dates are correct'
        });
      }

      if (yearsDiff < 0.1) { // Less than ~1 month
        warnings.push({
          type: 'info',
          field: `workExperience-${exp.id}-duration`,
          message: `Very short tenure at ${exp.companyName}`,
          suggestion: 'Consider if this experience adds value to your resume'
        });
      }
    }

    // Check for accomplishment lines
    if (!exp.lines || exp.lines.length === 0) {
      warnings.push({
        type: 'warning',
        field: `workExperience-${exp.id}-lines`,
        message: `No accomplishments listed for ${exp.companyName}`,
        suggestion: 'Add 2-4 key accomplishments or responsibilities'
      });
    } else if (exp.lines.length > 6) {
      warnings.push({
        type: 'info',
        field: `workExperience-${exp.id}-lines`,
        message: `Many accomplishments for ${exp.companyName} (${exp.lines.length})`,
        suggestion: 'Consider keeping to 3-5 most impactful accomplishments'
      });
    }

    // Check accomplishment line quality
    exp.lines?.forEach((line, lineIndex) => {
      const text = line.lineText.trim();
      const wordCount = text.split(/\s+/).length;

      if (wordCount < 3) {
        warnings.push({
          type: 'warning',
          field: `workExperience-${exp.id}-line-${line.id}`,
          message: 'Accomplishment line is very short',
          suggestion: 'Provide more detail about your achievement'
        });
      }

      if (wordCount > 25) {
        warnings.push({
          type: 'info',
          field: `workExperience-${exp.id}-line-${line.id}`,
          message: 'Accomplishment line is quite long',
          suggestion: 'Consider breaking into multiple points or condensing'
        });
      }

      // Check for action verbs at the beginning
      const actionVerbs = [
        'achieved', 'implemented', 'developed', 'led', 'managed', 'created',
        'improved', 'increased', 'reduced', 'streamlined', 'optimized',
        'designed', 'built', 'delivered', 'collaborated', 'initiated'
      ];

      const startsWithActionVerb = actionVerbs.some(verb =>
        text.toLowerCase().startsWith(verb)
      );

      if (!startsWithActionVerb) {
        warnings.push({
          type: 'info',
          field: `workExperience-${exp.id}-line-${line.id}`,
          message: 'Consider starting with an action verb',
          suggestion: 'Use verbs like "achieved", "implemented", "led" for impact'
        });
      }
    });
  });

  // Check for chronological order
  const sortedExperiences = [...workExperiences].sort((a, b) => {
    const aStart = new Date(a.dateStarted || 0);
    const bStart = new Date(b.dateStarted || 0);
    return bStart.getTime() - aStart.getTime(); // Most recent first
  });

  const isChronological = workExperiences.every((exp, index) =>
    exp.id === sortedExperiences[index]?.id
  );

  if (!isChronological) {
    warnings.push({
      type: 'info',
      field: 'workExperiences',
      message: 'Work experiences are not in chronological order',
      suggestion: 'Consider ordering by most recent first'
    });
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
};

// Education integrity checks
export const validateEducationIntegrity = (education: Education[]): IntegrityCheckResult => {
  const warnings: IntegrityCheckResult['warnings'] = [];
  const errors: IntegrityCheckResult['errors'] = [];

  education.forEach(edu => {
    // Check date consistency
    if (edu.dateStarted && edu.dateFinished) {
      const startDate = new Date(edu.dateStarted);
      const endDate = new Date(edu.dateFinished);

      if (endDate <= startDate) {
        errors.push({
          field: `education-${edu.id}-dates`,
          message: `End date must be after start date for ${edu.schoolName}`,
          code: 'INVALID_DATE_RANGE'
        });
      }

      // Check for unrealistic durations
      const yearsDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      if (yearsDiff > 10) {
        warnings.push({
          type: 'warning',
          field: `education-${edu.id}-duration`,
          message: `Very long education period at ${edu.schoolName} (${Math.round(yearsDiff)} years)`,
          suggestion: 'Verify dates are correct'
        });
      }
    }
  });

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
};

// Scoped resume integrity checks
export const validateScopedResumeIntegrity = (
  scopedResume: ScopedResume,
  availableSkills: TechnicalSkill[],
  availableWorkExperiences: WorkExperience[]
): IntegrityCheckResult => {
  const warnings: IntegrityCheckResult['warnings'] = [];
  const errors: IntegrityCheckResult['errors'] = [];

  // Check if scoped skills reference valid skills
  scopedResume.scopedSkills?.forEach(scopedSkill => {
    const skillExists = availableSkills.some(skill => skill.id === scopedSkill.technicalSkillId);
    if (!skillExists) {
      errors.push({
        field: `scopedResume-${scopedResume.id}-skills`,
        message: `References non-existent skill ID: ${scopedSkill.technicalSkillId}`,
        code: 'ORPHANED_SCOPED_SKILL'
      });
    }
  });

  // Check if scoped work experiences reference valid experiences
  scopedResume.scopedWorkExperiences?.forEach(scopedExp => {
    const expExists = availableWorkExperiences.some(exp => exp.id === scopedExp.workExperienceId);
    if (!expExists) {
      errors.push({
        field: `scopedResume-${scopedResume.id}-workExperiences`,
        message: `References non-existent work experience ID: ${scopedExp.workExperienceId}`,
        code: 'ORPHANED_SCOPED_WORK_EXPERIENCE'
      });
    }
  });

  // Check for minimal content
  const skillCount = scopedResume.scopedSkills?.length || 0;
  const workExpCount = scopedResume.scopedWorkExperiences?.length || 0;

  if (skillCount === 0) {
    warnings.push({
      type: 'warning',
      field: `scopedResume-${scopedResume.id}`,
      message: 'No skills included in scoped resume',
      suggestion: 'Include relevant skills for the target position'
    });
  }

  if (workExpCount === 0) {
    warnings.push({
      type: 'warning',
      field: `scopedResume-${scopedResume.id}`,
      message: 'No work experiences included in scoped resume',
      suggestion: 'Include relevant work experiences'
    });
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
};

// Comprehensive integrity check
export const validateCompleteResumeIntegrity = (resumeData: {
  contact?: Contact;
  professionalSummary?: ProfessionalSummary;
  technicalSkills?: TechnicalSkill[];
  skillCategories?: SkillCategory[];
  skillSubcategories?: SkillSubcategory[];
  workExperiences?: WorkExperience[];
  education?: Education[];
  scopedResumes?: ScopedResume[];
}): IntegrityCheckResult => {
  const allWarnings: IntegrityCheckResult['warnings'] = [];
  const allErrors: IntegrityCheckResult['errors'] = [];

  // Validate each section
  if (resumeData.contact) {
    const contactResult = validateContactIntegrity(resumeData.contact);
    allWarnings.push(...contactResult.warnings);
    allErrors.push(...contactResult.errors);
  }

  if (resumeData.professionalSummary) {
    const summaryResult = validateSummaryIntegrity(resumeData.professionalSummary);
    allWarnings.push(...summaryResult.warnings);
    allErrors.push(...summaryResult.errors);
  }

  if (resumeData.technicalSkills && resumeData.skillCategories && resumeData.skillSubcategories) {
    const skillsResult = validateSkillsIntegrity(
      resumeData.technicalSkills,
      resumeData.skillCategories,
      resumeData.skillSubcategories
    );
    allWarnings.push(...skillsResult.warnings);
    allErrors.push(...skillsResult.errors);
  }

  if (resumeData.workExperiences) {
    const workExpResult = validateWorkExperienceIntegrity(resumeData.workExperiences);
    allWarnings.push(...workExpResult.warnings);
    allErrors.push(...workExpResult.errors);
  }

  if (resumeData.education) {
    const educationResult = validateEducationIntegrity(resumeData.education);
    allWarnings.push(...educationResult.warnings);
    allErrors.push(...educationResult.errors);
  }

  if (resumeData.scopedResumes && resumeData.technicalSkills && resumeData.workExperiences) {
    resumeData.scopedResumes.forEach(scopedResume => {
      const scopedResult = validateScopedResumeIntegrity(
        scopedResume,
        resumeData.technicalSkills!,
        resumeData.workExperiences!
      );
      allWarnings.push(...scopedResult.warnings);
      allErrors.push(...scopedResult.errors);
    });
  }

  return {
    isValid: allErrors.length === 0,
    warnings: allWarnings,
    errors: allErrors
  };
};