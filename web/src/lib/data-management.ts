import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import type {
  TechnicalSkill,
  WorkExperience,
  Education,
  ScopedResume,
  Contact,
  ProfessionalSummary,
} from '@/types';

// Comprehensive data management utilities for Phase 6C

export interface DataExportOptions {
  format: 'json' | 'csv';
  sections?: Array<'contact' | 'summary' | 'skills' | 'education' | 'workExperience' | 'scopedResumes'>;
  scopedResumeId?: number;
}

export interface DataImportResult {
  successful: number;
  failed: number;
  errors: Array<{
    item: any;
    error: string;
  }>;
}

// Data export utilities
export const exportResumeData = async (options: DataExportOptions) => {
  try {
    const endpoint = options.scopedResumeId
      ? `/export/scoped-resume/${options.scopedResumeId}`
      : '/export/resume';

    const params = new URLSearchParams({
      format: options.format,
      ...(options.sections && { sections: options.sections.join(',') })
    });

    const response = await apiClient.get(`${endpoint}?${params}`);

    if (options.format === 'json') {
      return JSON.stringify(response, null, 2);
    } else {
      // CSV format
      return convertToCSV(response, options.sections);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('Failed to export resume data');
  }
};

// Data import utilities
export const importResumeData = async (
  data: any,
  options: {
    overwrite?: boolean;
    validate?: boolean;
  } = {}
): Promise<DataImportResult> => {
  const { overwrite = false, validate = true } = options;
  const result: DataImportResult = {
    successful: 0,
    failed: 0,
    errors: []
  };

  try {
    if (validate) {
      const validationResult = await validateImportData(data);
      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
      }
    }

    const endpoint = overwrite ? '/import/resume/overwrite' : '/import/resume/merge';
    const response = await apiClient.post(endpoint, data);

    result.successful = response.imported || 0;
    result.failed = response.failed || 0;
    result.errors = response.errors || [];

    if (result.successful > 0) {
      toast.success(`Successfully imported ${result.successful} items`);
    }

    if (result.failed > 0) {
      toast.error(`Failed to import ${result.failed} items`);
    }

    return result;
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
};

// Data validation for imports
const validateImportData = async (data: any): Promise<{
  isValid: boolean;
  errors: string[];
}> => {
  const errors: string[] = [];

  // Basic structure validation
  if (!data || typeof data !== 'object') {
    errors.push('Invalid data format');
    return { isValid: false, errors };
  }

  // Validate contact data
  if (data.contact) {
    if (!data.contact.name) {
      errors.push('Contact name is required');
    }
  }

  // Validate skills data
  if (data.technicalSkills && Array.isArray(data.technicalSkills)) {
    data.technicalSkills.forEach((skill: any, index: number) => {
      if (!skill.name) {
        errors.push(`Skill at index ${index} is missing name`);
      }
      if (!skill.categoryId) {
        errors.push(`Skill "${skill.name}" is missing category`);
      }
      if (!skill.subcategoryId) {
        errors.push(`Skill "${skill.name}" is missing subcategory`);
      }
    });
  }

  // Validate work experience data
  if (data.workExperiences && Array.isArray(data.workExperiences)) {
    data.workExperiences.forEach((exp: any, index: number) => {
      if (!exp.companyName) {
        errors.push(`Work experience at index ${index} is missing company name`);
      }
      if (!exp.jobTitle) {
        errors.push(`Work experience at index ${index} is missing job title`);
      }
      if (!exp.dateStarted) {
        errors.push(`Work experience at index ${index} is missing start date`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// CSV conversion utility
const convertToCSV = (data: any, sections?: string[]): string => {
  const csvData: string[] = [];

  if (!sections || sections.includes('contact')) {
    csvData.push('CONTACT INFORMATION');
    csvData.push('Field,Value');
    if (data.contact) {
      Object.entries(data.contact).forEach(([key, value]) => {
        csvData.push(`${key},"${value || ''}"`);
      });
    }
    csvData.push('');
  }

  if (!sections || sections.includes('skills')) {
    csvData.push('TECHNICAL SKILLS');
    csvData.push('Name,Category,Subcategory');
    if (data.technicalSkills) {
      data.technicalSkills.forEach((skill: TechnicalSkill) => {
        csvData.push(`"${skill.name}","${skill.category?.name || ''}","${skill.subcategory?.name || ''}"`);
      });
    }
    csvData.push('');
  }

  if (!sections || sections.includes('workExperience')) {
    csvData.push('WORK EXPERIENCE');
    csvData.push('Company,Title,City,State,Start Date,End Date,Accomplishments');
    if (data.workExperiences) {
      data.workExperiences.forEach((exp: WorkExperience) => {
        const accomplishments = exp.lines?.map(line => line.lineText).join('; ') || '';
        csvData.push(
          `"${exp.companyName}","${exp.jobTitle}","${exp.companyCity || ''}","${exp.companyState || ''}","${exp.dateStarted}","${exp.dateEnded || 'Present'}","${accomplishments}"`
        );
      });
    }
    csvData.push('');
  }

  if (!sections || sections.includes('education')) {
    csvData.push('EDUCATION');
    csvData.push('School,City,State,Degree Type,Degree Title,Start Date,End Date');
    if (data.education) {
      data.education.forEach((edu: Education) => {
        csvData.push(
          `"${edu.schoolName}","${edu.schoolCity}","${edu.schoolState}","${edu.degreeType}","${edu.degreeTitle}","${edu.dateStarted}","${edu.dateFinished || 'Present'}"`
        );
      });
    }
  }

  return csvData.join('\n');
};

// Data cleanup utilities
export const cleanupOrphanedData = async (): Promise<{
  cleaned: number;
  details: Array<{ type: string; count: number; description: string }>;
}> => {
  try {
    const response = await apiClient.post('/data/cleanup');

    toast.success(`Cleaned up ${response.cleaned} orphaned records`);

    return {
      cleaned: response.cleaned,
      details: response.details
    };
  } catch (error) {
    console.error('Cleanup failed:', error);
    throw new Error('Failed to cleanup orphaned data');
  }
};

// Data optimization utilities
export const optimizeDatabase = async (): Promise<{
  optimized: boolean;
  stats: {
    beforeSize: number;
    afterSize: number;
    spaceSaved: number;
  };
}> => {
  try {
    const response = await apiClient.post('/data/optimize');

    if (response.optimized) {
      const { stats } = response;
      toast.success(`Database optimized. Saved ${(stats.spaceSaved / 1024).toFixed(2)} KB`);
    }

    return response;
  } catch (error) {
    console.error('Optimization failed:', error);
    throw new Error('Failed to optimize database');
  }
};

// Data backup utilities
export const createDataBackup = async (): Promise<{
  backupId: string;
  size: number;
  timestamp: string;
}> => {
  try {
    const response = await apiClient.post('/data/backup');

    toast.success('Data backup created successfully');

    return response;
  } catch (error) {
    console.error('Backup failed:', error);
    throw new Error('Failed to create data backup');
  }
};

export const restoreDataBackup = async (backupId: string): Promise<{
  restored: boolean;
  itemsRestored: number;
}> => {
  try {
    const response = await apiClient.post(`/data/restore/${backupId}`);

    if (response.restored) {
      toast.success(`Successfully restored ${response.itemsRestored} items from backup`);
    }

    return response;
  } catch (error) {
    console.error('Restore failed:', error);
    throw new Error('Failed to restore data backup');
  }
};

// Data synchronization utilities
export const syncDataConsistency = async (): Promise<{
  synced: boolean;
  issues: Array<{
    type: string;
    description: string;
    fixed: boolean;
  }>;
}> => {
  try {
    const response = await apiClient.post('/data/sync');

    const fixedCount = response.issues.filter((issue: any) => issue.fixed).length;
    if (fixedCount > 0) {
      toast.success(`Fixed ${fixedCount} data consistency issues`);
    }

    const unfixedCount = response.issues.length - fixedCount;
    if (unfixedCount > 0) {
      toast.warning(`${unfixedCount} issues require manual attention`);
    }

    return response;
  } catch (error) {
    console.error('Sync failed:', error);
    throw new Error('Failed to sync data consistency');
  }
};

// Performance monitoring
export const getDataStats = async (): Promise<{
  totalRecords: number;
  databaseSize: number;
  lastOptimized: string;
  queryPerformance: {
    averageResponseTime: number;
    slowQueries: number;
  };
}> => {
  try {
    const response = await apiClient.get('/data/stats');
    return response;
  } catch (error) {
    console.error('Failed to get data stats:', error);
    throw new Error('Failed to retrieve data statistics');
  }
};