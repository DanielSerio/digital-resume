import { useEffect, useState } from 'react';
import { useResumeData } from './useResumeData';
import { validateCompleteResumeIntegrity, type IntegrityCheckResult } from '@/lib/data-integrity';

// Hook for monitoring data integrity with automatic validation
export const useDataIntegrity = (options: {
  enabled?: boolean;
  onValidationComplete?: (result: IntegrityCheckResult) => void;
  autofix?: boolean;
} = {}) => {
  const { enabled = true, onValidationComplete, autofix = false } = options;
  const [integrityResult, setIntegrityResult] = useState<IntegrityCheckResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const { data: resumeData, isLoading } = useResumeData();

  // Perform integrity validation
  const validateIntegrity = async () => {
    if (!resumeData || isLoading) return;

    setIsValidating(true);

    try {
      const result = validateCompleteResumeIntegrity({
        contact: resumeData.contact,
        professionalSummary: resumeData.professionalSummary,
        technicalSkills: resumeData.technicalSkills,
        skillCategories: resumeData.skillCategories,
        skillSubcategories: resumeData.skillSubcategories,
        workExperiences: resumeData.workExperiences,
        education: resumeData.education,
        scopedResumes: resumeData.scopedResumes,
      });

      setIntegrityResult(result);
      onValidationComplete?.(result);

      // Log issues for debugging
      if (result.errors.length > 0) {
        console.warn('Data integrity errors found:', result.errors);
      }

      if (result.warnings.length > 0) {
        console.info('Data integrity warnings:', result.warnings);
      }

    } catch (error) {
      console.error('Data integrity validation failed:', error);
      setIntegrityResult({
        isValid: false,
        warnings: [],
        errors: [{
          field: 'validation',
          message: 'Integrity validation failed',
          code: 'VALIDATION_ERROR'
        }]
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Auto-validate when data changes
  useEffect(() => {
    if (enabled && resumeData && !isLoading) {
      const timer = setTimeout(() => {
        validateIntegrity();
      }, 500); // Debounce validation

      return () => clearTimeout(timer);
    }
  }, [enabled, resumeData, isLoading]);

  return {
    integrityResult,
    isValidating,
    validateIntegrity,
    hasErrors: integrityResult?.errors.length ?? 0 > 0,
    hasWarnings: integrityResult?.warnings.length ?? 0 > 0,
    errorCount: integrityResult?.errors.length ?? 0,
    warningCount: integrityResult?.warnings.length ?? 0,
  };
};

// Hook for getting integrity status for specific fields
export const useFieldIntegrity = (fieldPath: string) => {
  const { integrityResult } = useDataIntegrity();

  const fieldErrors = integrityResult?.errors.filter(error =>
    error.field === fieldPath || error.field.startsWith(fieldPath + '-')
  ) ?? [];

  const fieldWarnings = integrityResult?.warnings.filter(warning =>
    warning.field === fieldPath || warning.field.startsWith(fieldPath + '-')
  ) ?? [];

  return {
    hasErrors: fieldErrors.length > 0,
    hasWarnings: fieldWarnings.length > 0,
    errors: fieldErrors,
    warnings: fieldWarnings,
    isValid: fieldErrors.length === 0,
  };
};

// Hook for real-time data consistency monitoring
export const useDataConsistency = () => {
  const { data: resumeData } = useResumeData();
  const [consistencyIssues, setConsistencyIssues] = useState<Array<{
    type: 'orphaned_reference' | 'duplicate_data' | 'missing_required';
    description: string;
    affectedItems: string[];
    severity: 'low' | 'medium' | 'high';
  }>>([]);

  useEffect(() => {
    if (!resumeData) return;

    const issues: typeof consistencyIssues = [];

    // Check for orphaned skill references in scoped resumes
    resumeData.scopedResumes?.forEach(scopedResume => {
      scopedResume.scopedSkills?.forEach(scopedSkill => {
        const skillExists = resumeData.technicalSkills?.some(
          skill => skill.id === scopedSkill.technicalSkillId
        );

        if (!skillExists) {
          issues.push({
            type: 'orphaned_reference',
            description: `Scoped resume "${scopedResume.name}" references deleted skill`,
            affectedItems: [`scopedResume-${scopedResume.id}`, `skill-${scopedSkill.technicalSkillId}`],
            severity: 'high'
          });
        }
      });

      scopedResume.scopedWorkExperiences?.forEach(scopedExp => {
        const expExists = resumeData.workExperiences?.some(
          exp => exp.id === scopedExp.workExperienceId
        );

        if (!expExists) {
          issues.push({
            type: 'orphaned_reference',
            description: `Scoped resume "${scopedResume.name}" references deleted work experience`,
            affectedItems: [`scopedResume-${scopedResume.id}`, `workExperience-${scopedExp.workExperienceId}`],
            severity: 'high'
          });
        }
      });
    });

    // Check for orphaned skill category/subcategory references
    resumeData.technicalSkills?.forEach(skill => {
      const categoryExists = resumeData.skillCategories?.some(
        cat => cat.id === skill.categoryId
      );
      const subcategoryExists = resumeData.skillSubcategories?.some(
        subcat => subcat.id === skill.subcategoryId
      );

      if (!categoryExists) {
        issues.push({
          type: 'orphaned_reference',
          description: `Skill "${skill.name}" references deleted category`,
          affectedItems: [`skill-${skill.id}`, `category-${skill.categoryId}`],
          severity: 'high'
        });
      }

      if (!subcategoryExists) {
        issues.push({
          type: 'orphaned_reference',
          description: `Skill "${skill.name}" references deleted subcategory`,
          affectedItems: [`skill-${skill.id}`, `subcategory-${skill.subcategoryId}`],
          severity: 'high'
        });
      }
    });

    // Check for duplicate skills
    const skillNames = resumeData.technicalSkills?.map(s => s.name.toLowerCase().trim()) ?? [];
    const duplicateSkills = skillNames.filter((name, index) =>
      skillNames.indexOf(name) !== index
    );

    if (duplicateSkills.length > 0) {
      issues.push({
        type: 'duplicate_data',
        description: `Duplicate skills found: ${duplicateSkills.join(', ')}`,
        affectedItems: duplicateSkills.map(name => `skill-${name}`),
        severity: 'medium'
      });
    }

    // Check for missing required data
    if (!resumeData.contact?.name) {
      issues.push({
        type: 'missing_required',
        description: 'Contact name is required',
        affectedItems: ['contact-name'],
        severity: 'high'
      });
    }

    if (!resumeData.professionalSummary?.summaryText) {
      issues.push({
        type: 'missing_required',
        description: 'Professional summary is required',
        affectedItems: ['summary-text'],
        severity: 'medium'
      });
    }

    setConsistencyIssues(issues);
  }, [resumeData]);

  return {
    consistencyIssues,
    hasIssues: consistencyIssues.length > 0,
    highSeverityIssues: consistencyIssues.filter(issue => issue.severity === 'high'),
    mediumSeverityIssues: consistencyIssues.filter(issue => issue.severity === 'medium'),
    lowSeverityIssues: consistencyIssues.filter(issue => issue.severity === 'low'),
  };
};