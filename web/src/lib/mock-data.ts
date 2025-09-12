import type { 
  Contact,
  ProfessionalSummary,
  TechnicalSkill,
  SkillCategory,
  SkillSubcategory,
  Education,
  WorkExperience,
  WorkExperienceLine,
  ScopedResume
} from '@/types';

// Mock Skill Categories and Subcategories
export const mockSkillCategories: SkillCategory[] = [
  { id: 1, name: "Frontend", createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: "Backend", createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: "Database", createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: "Cloud", createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: "Tools", createdAt: new Date(), updatedAt: new Date() },
];

export const mockSkillSubcategories: SkillSubcategory[] = [
  { id: 1, name: "Framework", createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: "Language", createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: "Database", createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: "Platform", createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: "Tool", createdAt: new Date(), updatedAt: new Date() },
];

// Mock Contact Information
export const mockContactInfo: Contact = {
  id: 1,
  name: "John Doe",
  title: "Senior Software Engineer",
  email: "john.doe@email.com",
  phone: "(555) 123-4567",
  githubUrl: "https://github.com/johndoe",
  websiteUrl: "https://johndoe.dev",
  linkedinUrl: "https://linkedin.com/in/johndoe",
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

// Mock Professional Summary
export const mockProfessionalSummary: ProfessionalSummary = {
  id: 1,
  summaryText: "Experienced full-stack developer with 8+ years building scalable web applications. Specializes in React, Node.js, and cloud architecture with a proven track record of leading high-performing development teams and delivering complex projects on time.",
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

// Mock Technical Skills
export const mockTechnicalSkills: TechnicalSkill[] = [
  {
    id: 1,
    name: "React",
    categoryId: 1,
    subcategoryId: 1,
    category: mockSkillCategories[0],
    subcategory: mockSkillSubcategories[0],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: "Vue.js",
    categoryId: 1,
    subcategoryId: 1,
    category: mockSkillCategories[0],
    subcategory: mockSkillSubcategories[0],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 3,
    name: "TypeScript",
    categoryId: 1,
    subcategoryId: 2,
    category: mockSkillCategories[0],
    subcategory: mockSkillSubcategories[1],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 4,
    name: "Node.js",
    categoryId: 2,
    subcategoryId: 1,
    category: mockSkillCategories[1],
    subcategory: mockSkillSubcategories[0],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 5,
    name: "Python",
    categoryId: 2,
    subcategoryId: 2,
    category: mockSkillCategories[1],
    subcategory: mockSkillSubcategories[1],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 6,
    name: "PostgreSQL",
    categoryId: 3,
    subcategoryId: 3,
    category: mockSkillCategories[2],
    subcategory: mockSkillSubcategories[2],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 7,
    name: "AWS",
    categoryId: 4,
    subcategoryId: 4,
    category: mockSkillCategories[3],
    subcategory: mockSkillSubcategories[3],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 8,
    name: "Git",
    categoryId: 5,
    subcategoryId: 5,
    category: mockSkillCategories[4],
    subcategory: mockSkillSubcategories[4],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Mock Education
export const mockEducation: Education[] = [
  {
    id: 1,
    schoolName: "University of Technology",
    schoolCity: "San Francisco",
    schoolState: "CA",
    degreeType: "Bachelor of Science",
    degreeTitle: "Computer Science",
    dateStarted: new Date('2012-09-01'),
    dateFinished: new Date('2016-05-15'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Mock Work Experience Lines
export const mockWorkExperienceLines: WorkExperienceLine[] = [
  {
    id: 1,
    workExperienceId: 1,
    lineText: "Led development of microservices architecture reducing system load by 40%",
    lineId: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    workExperienceId: 1,
    lineText: "Implemented React-based dashboard serving 100k+ daily active users",
    lineId: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 3,
    workExperienceId: 1,
    lineText: "Mentored 5 junior developers and established code review processes",
    lineId: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 4,
    workExperienceId: 1,
    lineText: "Deployed cloud infrastructure using AWS and Docker containers",
    lineId: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 5,
    workExperienceId: 2,
    lineText: "Built customer portal using React and Node.js from ground up",
    lineId: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 6,
    workExperienceId: 2,
    lineText: "Integrated payment systems and third-party APIs",
    lineId: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Mock Work Experience
export const mockWorkExperience: WorkExperience[] = [
  {
    id: 1,
    companyName: "Tech Solutions Inc",
    jobTitle: "Senior Software Engineer",
    companyCity: "San Francisco",
    companyState: "CA",
    dateStarted: new Date('2020-01-01'),
    dateEnded: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lines: mockWorkExperienceLines.slice(0, 4),
  },
  {
    id: 2,
    companyName: "StartupCorp",
    jobTitle: "Software Engineer",
    companyCity: "Remote",
    companyState: "",
    dateStarted: new Date('2016-06-01'),
    dateEnded: new Date('2019-12-31'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lines: mockWorkExperienceLines.slice(4, 6),
  },
];

// Mock Scoped Resumes
export const mockScopedResumes: ScopedResume[] = [
  {
    id: 1,
    name: "Frontend Developer Role",
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: "Full-Stack Position",
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 3,
    name: "Senior Engineering Role",
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Mock Complete Resume Data
export const mockResumeData = {
  contactInfo: mockContactInfo,
  professionalSummary: mockProfessionalSummary,
  technicalSkills: mockTechnicalSkills,
  education: mockEducation,
  workExperience: mockWorkExperience,
  scopedResumes: mockScopedResumes,
};

// Helper functions for generating variations
export const createMockContactInfo = (overrides: Partial<Contact> = {}): Contact => ({
  ...mockContactInfo,
  ...overrides,
});

export const createMockTechnicalSkill = (overrides: Partial<TechnicalSkill> = {}): TechnicalSkill => ({
  ...mockTechnicalSkills[0],
  ...overrides,
});

export const createMockWorkExperience = (overrides: Partial<WorkExperience> = {}): WorkExperience => ({
  ...mockWorkExperience[0],
  ...overrides,
});

export const createMockEducation = (overrides: Partial<Education> = {}): Education => ({
  ...mockEducation[0],
  ...overrides,
});

export const createMockScopedResume = (overrides: Partial<ScopedResume> = {}): ScopedResume => ({
  ...mockScopedResumes[0],
  ...overrides,
});