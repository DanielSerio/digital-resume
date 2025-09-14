// TypeScript types based on Prisma client models
// These types mirror the backend database schema for frontend use

export interface Contact {
  id: number;
  name: string;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  github?: string | null;
  website?: string | null;
  linkedin?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfessionalSummary {
  id: number;
  summaryText: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillCategory {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillSubcategory {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechnicalSkill {
  id: number;
  name: string;
  categoryId: number;
  subcategoryId: number;
  createdAt: Date;
  updatedAt: Date;
  category: SkillCategory;
  subcategory: SkillSubcategory;
}

export interface Education {
  id: number;
  schoolName: string;
  schoolCity: string;
  schoolState: string;
  degreeType: string;
  degreeTitle: string;
  dateStarted: Date;
  dateFinished: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkExperience {
  id: number;
  companyName: string;
  companyTagline?: string | null;
  companyCity: string;
  companyState: string;
  jobTitle: string;
  dateStarted: Date;
  dateEnded: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lines: WorkExperienceLine[];
}

export interface WorkExperienceLine {
  id: number;
  workExperienceId: number;
  lineText: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScopedResume {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScopedProfessionalSummary {
  id: number;
  scopedResumeId: number;
  summaryText: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScopedSkill {
  id: number;
  scopedResumeId: number;
  skillId: number;
  createdAt: Date;
  updatedAt: Date;
  skill: TechnicalSkill;
}

export interface ScopedWorkExperience {
  id: number;
  scopedResumeId: number;
  workExperienceId: number;
  createdAt: Date;
  updatedAt: Date;
  workExperience: WorkExperience;
  lines: ScopedWorkExperienceLine[];
}

export interface ScopedWorkExperienceLine {
  id: number;
  scopedWorkExperienceId: number;
  workExperienceLineId?: number | null;
  lineText: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Composite types for complete resume data
export interface CompleteResume {
  contact: Contact | null;
  professionalSummary: ProfessionalSummary | null;
  technicalSkills: TechnicalSkill[];
  education: Education[];
  workExperiences: WorkExperience[];
  skillCategories: SkillCategory[];
  skillSubcategories: SkillSubcategory[];
}

export interface CompleteScopedResume {
  scopedResume: ScopedResume;
  contact: Contact | null;
  professionalSummary: ScopedProfessionalSummary | null;
  technicalSkills: ScopedSkill[];
  education: Education[];
  workExperiences: ScopedWorkExperience[];
  skillCategories: SkillCategory[];
  skillSubcategories: SkillSubcategory[];
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

export interface ApiError {
  message: string;
  details?: any;
  status?: number;
}

// Form input types (for creating/updating)
export type ContactInput = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;
export type ProfessionalSummaryInput = Omit<ProfessionalSummary, 'id' | 'createdAt' | 'updatedAt'>;
export type TechnicalSkillInput = Omit<TechnicalSkill, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'subcategory'>;
export type EducationInput = Omit<Education, 'id' | 'createdAt' | 'updatedAt'>;
export type WorkExperienceInput = Omit<WorkExperience, 'id' | 'createdAt' | 'updatedAt' | 'lines'>;
export type WorkExperienceLineInput = Omit<WorkExperienceLine, 'id' | 'createdAt' | 'updatedAt' | 'workExperienceId'>;
export type ScopedResumeInput = Omit<ScopedResume, 'id' | 'createdAt' | 'updatedAt'>;

// Query/mutation parameter types
export interface CreateWorkExperienceRequest {
  workExperience: WorkExperienceInput;
  lines: WorkExperienceLineInput[];
}

export interface UpdateWorkExperienceRequest {
  workExperience: Partial<WorkExperienceInput>;
  lines?: WorkExperienceLineInput[];
}