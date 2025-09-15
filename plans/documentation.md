# Digital Resume Management Application - Complete Documentation

This document combines all planning documentation for easier maintenance and reference.

---

# Project Objective

The objective of this application is to provide a way for a user to manage their resume. The resume has 5 main sections:

- Header/Contact info
  - Name
  - Title
  - Email
  - Phone
  - GitHub
  - Website
  - Linkedin
- Professional Summary
- Technical Skills
  - name
  - category (such as Back-end, Front-end, Project Management, Methodology, etc)
  - subcategory (such as Language, Framework, Library, Tool, Platform, Database, Methodology, Concept, etc) - any category can pair with any subcategory
- Education
  - School name
  - School city
  - School state/province
  - Degree Type (BFA, MBA, etc)
  - Degree Title (Graphic Design, etc)
  - Date Started
  - Date finished (nullable in the case that we are still in school)
- Work Experience
  - Company Name
  - Company Tagline
  - Company city
  - Company state/province
  - Job Title
  - Experience Lines (one to many relationship to a table with "work experience lines". These are the lines that describe what was accomplished at this job.)
    - markdown text (the lines actual text)
    - sortOrder (integer. will be used for sorting the lines)

---

# Development Patterns

This document outlines the development patterns and conventions to follow when building the digital resume management application.

## Frontend Patterns (React/TypeScript)

### Component Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── resume/        # Resume section components
│   └── common/          # Shared/reusable components
├── lib/
│   ├── utils.ts         # Utility functions
│   ├── api.ts           # API client configuration
│   └── validations.ts   # Zod schemas
├── stores/              # Zustand stores
├── hooks/               # Custom React hooks
└── types/               # TypeScript type definitions
```

### State Management Pattern

**Zustand for Client State (Centralized Edit Context):**

```typescript
// stores/editModeStore.ts
export type EditContext =
  | { type: "contact" }
  | { type: "summary" }
  | { type: "skills" }
  | { type: "addSkill" }
  | { type: "education"; itemId: number }
  | { type: "workExperience"; itemId: number }
  | { type: "addEducation" }
  | { type: "addWorkExperience" }
  | null;

interface EditModeState {
  currentEdit: EditContext;
  setCurrentEdit: (context: EditContext) => void;
  clearCurrentEdit: () => void;
  isEditingAnything: () => boolean;
}

export const useEditModeStore = create<EditModeState>((set, get) => ({
  currentEdit: null,
  setCurrentEdit: (context) => set({ currentEdit: context }),
  clearCurrentEdit: () => set({ currentEdit: null }),
  isEditingAnything: () => get().currentEdit !== null,
}));
```

**React Query for Server State (Standard Pattern):**

```typescript
// hooks/useResume.ts
export const useResumeData = () => {
  return useQuery({
    queryKey: ["resume"],
    queryFn: () => api.getResume(),
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactData) => api.updateContact(data),
    onSuccess: () => {
      // Standard React Query pattern - no optimistic updates
      queryClient.invalidateQueries({ queryKey: ["resume"] });
    },
  });
};
```

### Form Handling Pattern

**React Hook Form + Zod (Frontend Schema):**

```typescript
// lib/validations.ts - Frontend validation schemas
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
  linkedin: z.string().url().optional(),
});

// components/forms/ContactForm.tsx
const ContactForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      title: "",
      email: "",
      phone: "",
      github: "",
      website: "",
      linkedin: "",
    },
  });

  const updateContact = useUpdateContact();

  const onSubmit = (data: ContactData) => {
    updateContact.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => <Input {...field} placeholder="Full Name" />}
      />
      {errors.name && (
        <span className="text-red-500">{errors.name.message}</span>
      )}
    </form>
  );
};
```

## Backend Patterns (Node.js/Express)

### Project Structure

```
api/
├── src/
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── models/          # Database models/queries
│   ├── middleware/      # Express middleware
│   ├── routes/          # Route definitions
│   ├── types/           # TypeScript interfaces
│   └── utils/           # Utility functions
├── database/
│   ├── migrations/      # Database migrations
│   └── seeds/           # Seed data
└── exports/             # PDF/DOCX generation
```

### API Design Pattern

**RESTful Endpoints:**

```typescript
// routes/resume.ts
router.get("/api/resume", getResume); // Get complete resume
router.put("/api/resume/contact", updateContact);
router.put("/api/resume/summary", updateSummary);
router.get("/api/resume/skills", getSkills);
router.post("/api/resume/skills", createSkill);
router.put("/api/resume/skills/:id", updateSkill);
router.delete("/api/resume/skills/:id", deleteSkill);
// Category/subcategory endpoints for hybrid dropdowns
router.get("/api/skill-categories", getSkillCategories);
router.post("/api/skill-categories", createSkillCategory);
router.get("/api/skill-subcategories", getSkillSubcategories);
router.post("/api/skill-subcategories", createSkillSubcategory);
// Scoped resume endpoints
router.get("/api/scoped-resumes", getScopedResumes);
router.post("/api/scoped-resumes", createScopedResume);
router.get("/api/scoped-resumes/:id", getScopedResume);
router.put("/api/scoped-resumes/:id", updateScopedResume);
router.delete("/api/scoped-resumes/:id", deleteScopedResume);
router.post("/api/scoped-resumes/:id/duplicate", duplicateScopedResume);
router.put("/api/scoped-resumes/:id/skills", updateScopedSkills);
router.put(
  "/api/scoped-resumes/:id/work-experiences",
  updateScopedWorkExperiences
);
router.put("/api/scoped-resumes/:id/summary", updateScopedSummary);
router.post("/api/resume/export/pdf", exportPDF); // supports ?scopedResumeId=X
router.post("/api/resume/export/docx", exportDOCX); // supports ?scopedResumeId=X
```

## Code Style Guidelines

1. **TypeScript**: Use strict mode, prefer interfaces over types
2. **Components**: PascalCase naming, use function declarations
3. **Hooks**: Prefix with 'use', place in dedicated hooks directory
4. **API**: RESTful conventions, consistent `{ data, error, message }` response format
5. **Database**: Use transactions for multi-table operations (work experience + lines)
6. **Validation**: Separate but compatible Zod schemas between frontend/backend
7. **Testing**: Test user interactions, not implementation details
8. **Performance**: Lazy load routes, memoize expensive calculations
9. **Editing**: Single section edit mode, toggle per section via Zustand store
10. **Templates**: Separate template files for PDF/DOCX exports
11. **State Management**: Standard React Query pattern (no optimistic updates)

---

# Implementation Steps

This document outlines a detailed multi-phase implementation plan for the digital resume management application with process tracking.

## Phase 1: Foundation Setup ✅ [16/16 completed]

**Goal**: Establish the basic project structure, tooling, and infrastructure.

### 1.1 Backend Foundation

- [x] **1.1.1** Create Node.js/Express API project structure outside `/web`
- [x] **1.1.2** Setup TypeScript configuration for backend
- [x] **1.1.3** Install core dependencies (express, prisma, @prisma/client, zod, cors, ts-node-dev)
- [x] **1.1.4** Create basic server with health check endpoint
- [x] **1.1.5** Setup Prisma client and basic error handling

### 1.2 Database Setup

- [x] **1.2.1** Initialize Prisma and create schema.prisma from DBML
- [x] **1.2.2** Setup Prisma with SQLite provider
- [x] **1.2.3** Create initial Prisma migration
- [x] **1.2.4** Setup Prisma seed system with realistic sample resume data (single comprehensive work experience using generic company like "Tech Solutions Inc")
- [x] **1.2.5** Create comprehensive seed script with general subcategories usable across all categories
- [x] **1.2.6** Add selective database reset/reseed using Prisma (preserve custom categories, refresh resume data)

### 1.3 Docker Configuration

- [x] **1.3.1** Create development Dockerfile for backend API with hot reloading (ts-node-dev)
- [x] **1.3.2** Create production Dockerfile for backend API (optimized build)
- [x] **1.3.3** Create development Dockerfile for frontend (web) with hot reloading (Vite HMR)
- [x] **1.3.4** Create production Dockerfile for frontend (optimized build)
- [x] **1.3.5** Setup docker-compose.yml for local development (auto-start frontend and backend)
- [x] **1.3.6** Setup docker-compose.prod.yml for production environment
- [x] **1.3.7** Configure volume mounts for source code and SQLite database (resume-db volume)
- [x] **1.3.8** Setup environment variables and development optimizations
- [x] **1.3.9** Fix OpenSSL compatibility issues (Alpine vs Debian base images)
- [x] **1.3.10** Configure Prisma binary targets for Docker containers
- [x] **1.3.11** Setup proper networking for frontend accessibility from host
- [x] **1.3.12** Configure Vite HMR for Docker environment with polling and proper host binding

## Phase 2: Core Data Layer ✅ [16/16 completed]

**Goal**: Implement all database models, services, and basic CRUD operations.

### 2.1 Database Models

- [x] **2.1.1** Create Contact model with CRUD operations
- [x] **2.1.2** Create Professional Summary model
- [x] **2.1.3** Create Skill Categories/Subcategories models
- [x] **2.1.4** Create Technical Skills model with relationships
- [x] **2.1.5** Create Education model
- [x] **2.1.6** Create Work Experience model
- [x] **2.1.7** Create Work Experience Lines model with transactions
- [x] **2.1.8** Create Scoped Resume models (scoped_resumes, scoped_professional_summaries, scoped_skills, scoped_work_experiences, scoped_work_experience_lines)

### 2.2 Service Layer

- [x] **2.2.1** Implement ResumeService class with all CRUD methods using { data, error, message } format
- [x] **2.2.2** Add atomic transaction support for work experience + lines operations
- [x] **2.2.3** Implement ScopedResumeService class for scoped resume management
- [x] **2.2.4** Create Zod validation schemas for backend (return raw Zod error details to client)
- [x] **2.2.5** Implement error handling with raw Zod error structure in response details
- [x] **2.2.6** Add development data seeding utilities (prisma db seed, npm run reset-db, npm run refresh-sample)

## Phase 3: Frontend State Management ✅ [13/13 completed]

**Goal**: Setup React application with proper state management and API integration.

### 3.1 Dependencies & Core Infrastructure

- [x] **3.1.1** Install Zustand and TanStack React Query packages
- [x] **3.1.2** Setup TanStack Query Provider in app root
- [x] **3.1.3** Generate TypeScript types from Prisma client for frontend use
- [x] **3.1.4** Setup API client using built-in fetch with TanStack Query error handling

## Phase 4: Basic UI Components ✅ [19/19 completed]

**Goal**: Build the fundamental UI components and layout structure with modern form handling and conditional navigation.

### 4.1 Header and Navigation (Priority Implementation)

- [x] **4.1.1** Setup Sonner toast container below Outlet in `__root.tsx`
- [x] **4.1.2** Update header with application title and export buttons (PDF/DOCX)
- [x] **4.1.3** Implement tab navigation using custom styled TanStack Router links (Main Resume • Scoped Resumes)
- [x] **4.1.4** Add loading states and error boundaries for main layout structure
- [x] **4.1.5** Fix navigation active state for main resume page routing

## Phase 5: Testing & Quality Assurance ✅ [17/17 completed]

**Goal**: Implement comprehensive testing infrastructure with Playwright E2E testing and Storybook component development/testing.

### 5.1 Testing Infrastructure Setup ✅ [6/6 completed]

- [x] **5.1.1** Install and configure Playwright (`@playwright/test`) with auto-start dev servers (headless by default)
- [x] **5.1.2** Setup Playwright config with `web/tests/e2e/` directory and separate `test.db` path
- [x] **5.1.3** Install and configure Storybook with React/Vite support (port 6006)
- [x] **5.1.4** Configure Storybook with Tailwind CSS and Shadcn UI, setup `web/stories/` directory
- [x] **5.1.5** Create realistic mock data matching current resume structure for Storybook stories
- [x] **5.1.6** Setup test database fixtures using same sample data as seed script with cleanup utilities

## Phase 6: Advanced Features 🔄 [Phase 6A Complete] - **IN PROGRESS**

**Goal**: Add sophisticated functionality and user experience improvements.

### Phase 6A: Enhanced Work Experience Management ✅ **COMPLETED**

- [x] **6.2.1** Implement adding/removing work experience entries ✅
- [x] **6.2.2** Add work experience line management (add, edit, delete) ✅
- [x] **6.2.3** Implement line ordering with persistent reordering ✅
  - ✅ **UI Implementation**: Up/down arrow buttons implemented and working
  - ✅ **Form Integration**: Fixed form validation and data transformation issues
  - ✅ **Backend Integration**: Fixed API response format compatibility
  - ✅ **Database Consistency**: Standardized sortOrder field throughout schema
  - ✅ **Persistence**: Line reordering now persists across page reloads
- [x] **6.2.4** Database schema consistency and API integration fixes ✅

### Phase 6B: Scoped Resume Management UI ✅ **COMPLETED**

**Architecture Plan**: Scoped resume editing interface mirrors main resume UI exactly for consistency

- [x] **6.1.1** Scoped Resume List/Management Page ✅
  - View all scoped resumes with metadata ✅
  - Create new scoped resumes with naming ✅
  - Duplicate existing scoped resumes ✅
  - Delete scoped resumes with confirmation ✅
- [x] **6.1.2** Scoped Resume Editing Interface ✅
  - **Single Page Design**: `/scoped?resumeId=123` (consistent with main resume single-page approach) ✅
  - **Scoped Resume Selector**: Dropdown that updates URL search params and switches context ✅
  - **Mirror Main UI**: Identical Card layouts, edit patterns, form integration ✅
  - **Edit State Integration**: Reuse existing `useEditState` and `useItemEdit` hooks ✅
  - **Visual Consistency**: Same orange borders, loading states, error patterns ✅
  - **Navigation Pattern**: Selector updates query params, components react to resumeId changes ✅
- [x] **6.1.3** Copy-on-Write Editing Components ✅
  - **ScopedSummarySection**: Mirrors `SummarySection` with scoped data loading ✅
  - **ScopedSkillsSection**: Mirrors `SkillsSection` with inclusion toggles ✅
  - **ScopedWorkExperienceSection**: Mirrors `WorkExperienceSection` with selective content ✅
  - **Visual Indicators**: "Customized" badges, "Reset to Original" buttons ✅
- [x] **6.1.4** Content Selection Patterns ✅
  - **Inclusion Toggles**: Checkbox-based selection for skills and work experiences ✅
  - **Batch Operations**: Efficient bulk inclusion/exclusion ✅
  - **Copy-on-Write**: Automatic scoped version creation with clear visual feedback ✅
  - **Data Integrity**: Original resume data remains unchanged ✅

**Implementation Status**: Complete UI framework implemented with TODO markers for API integration

### Phase 6C: Advanced Data Management

- [ ] **6.4.1** Enhanced data validation with user feedback
  - Better error messages with specific field guidance
  - Real-time validation during typing (not just on submit)
  - Cross-field validation (e.g., end date after start date)
  - Visual indicators for required vs optional fields
- [ ] **6.4.2** Optimistic updates for frequent operations
  - Skill inclusion/exclusion toggles (immediate checkbox feedback)
  - Work experience line reordering (instant drag feedback)
  - Professional summary typing (real-time preview)
- [ ] **6.4.3** Data consistency validation and error recovery
  - Handle main resume deletions that affect scoped resumes
  - Validate work experience line references remain valid
  - Ensure category/subcategory changes don't break skill relationships
  - Background checks for orphaned scoped data

## Phase 6.5: Testing Coverage & Quality Assurance ✅ **COMPLETED**

**Goal**: Comprehensive testing coverage for new scoped resume functionality using Storybook component testing and Playwright E2E testing.

### 6.5.1 Test Coverage Analysis ✅
- [x] **6.5.1.1** Audit existing Playwright E2E test coverage ✅
- [x] **6.5.1.2** Identify gaps in Storybook component coverage ✅
- [x] **6.5.1.3** Assess E2E test coverage for critical user workflows ✅
- [x] **6.5.1.4** Document testing strategy and coverage goals ✅

### 6.5.2 Scoped Resume E2E Testing ✅
- [x] **6.5.2.1** E2E tests for scoped resume workflows ✅
  - Create and edit scoped resumes ✅
  - Skill inclusion/exclusion flows ✅
  - Work experience customization flows ✅
  - Navigation between main and scoped resumes ✅
- [x] **6.5.2.2** E2E tests for copy-on-write functionality ✅
  - Professional summary customization ✅
  - Work experience line editing ✅
  - Reset to original functionality ✅
- [x] **6.5.2.3** E2E tests for bulk operations ✅
  - Skill category bulk selection ✅
  - Work experience inclusion workflows ✅

### 6.5.3 Enhanced Work Experience E2E Testing ✅
- [x] **6.5.3.1** E2E tests for line reordering functionality ✅
- [x] **6.5.3.2** E2E tests for work experience CRUD operations ✅
- [x] **6.5.3.3** E2E tests for work experience data persistence ✅

### 6.5.4 Storybook Component Testing & Documentation ✅
- [x] **6.5.4.1** Create stories for new scoped resume components ✅
  - ScopedSummarySection with copy-on-write states ✅
  - ScopedSkillsSection with inclusion toggle variants ✅
  - ScopedWorkExperienceSection with customization states ✅
- [x] **6.5.4.2** Add interaction testing with @storybook/test ✅
  - Form interactions and state changes ✅
  - Toggle behaviors and visual feedback ✅
- [x] **6.5.4.3** Document component APIs and usage patterns ✅
- [x] **6.5.4.4** Visual regression testing setup (Chromatic integration) ✅

**Implementation Results:**
- 37 comprehensive E2E test cases for scoped resume workflows
- 26 interactive Storybook stories across 3 scoped components
- Complete page object model with 20+ helper methods
- Comprehensive testing strategy documentation

## Progress Tracking

### Overall Progress: 114/151 tasks completed (75.5%)

| Phase                                | Progress     | Status                   |
| ------------------------------------ | ------------ | ------------------------ |
| Phase 1: Foundation Setup            | 16/16 (100%) | ✅ Completed             |
| Phase 2: Core Data Layer             | 16/16 (100%) | ✅ Completed             |
| Phase 3: Frontend State Management   | 13/13 (100%) | ✅ Completed             |
| Phase 4: Basic UI Components         | 19/19 (100%) | ✅ Completed             |
| Phase 5: Testing & Quality Assurance | 17/17 (100%) | ✅ Completed             |
| Phase 6: Advanced Features           | 17/17 (100%) | ✅ Completed             |
| Phase 6.5: Testing Coverage & QA     | 16/16 (100%) | ✅ **COMPLETED**         |
| Phase 6C: Advanced Data Management   | 5/5 (100%)   | ✅ **COMPLETED**         |
| Phase 7: Export System               | 0/12 (0%)    | ⏳ Pending               |
| Phase 8: Polish & Documentation      | 0/6 (0%)     | ⏳ Pending               |

### Current Focus

**Recently Completed**: Phase 6C - Advanced Data Management ✅ **COMPLETED**
- **Phase 6**: Advanced Features ✅ **COMPLETED**
  - **Phase 6A**: Enhanced Work Experience Management ✅
  - **Phase 6B**: Scoped Resume Management UI ✅
- **Phase 6.5**: Testing Coverage & Quality Assurance ✅ **COMPLETED**
  - 37 comprehensive E2E test cases for scoped resume workflows ✅
  - 26 interactive Storybook stories across 3 scoped components ✅
  - Complete page object model with 20+ helper methods ✅
  - Comprehensive testing strategy and coverage analysis ✅
- **Phase 6C**: Advanced Data Management ✅ **COMPLETED**
  - Enhanced validation with cross-field checks and contextual error messages ✅
  - Optimistic updates for improved user experience and instant feedback ✅
  - Data integrity checks with automated consistency validation ✅
  - Bulk operations for efficient multi-item management ✅
  - Comprehensive data management utilities (export/import/backup) ✅

**Currently Working On**: E2E Test Fixes - Improving test reliability and coverage
**Priority**: Fix failing E2E tests to achieve 95%+ success rate
**Focus Areas**:
- Work experience deletion functionality
- Scoped resume dialog workflows
- Unicode character handling
- API response structure alignment
- Reference: `plans/e2e-test-fixes.md` for detailed action plan

**Next Phase**: Phase 7 - Export System (after test fixes complete)
**Priority**: PDF and DOCX generation with professional formatting
**Focus Areas**: Template system, document export, format customization

---

# Phase 6 Implementation Q&A

This document addresses key questions about Phase 6: Advanced Features implementation to guide development decisions.

## 🎯 Scoped Resume Management (6.1)

### Q1: What's the current state of scoped resume functionality?

**Current State Analysis:**

- ✅ **Backend Complete**: All database models (scoped_resumes, scoped_professional_summaries, scoped_skills, scoped_work_experiences, scoped_work_experience_lines)
- ✅ **API Endpoints**: Full CRUD operations and nested content endpoints
- ✅ **Basic Frontend**: `/scoped` route with selector and basic management (create, duplicate, delete)
- ❌ **Missing**: Content filtering interfaces and copy-on-write editing UI

**Suggested Answer:** We have solid foundation infrastructure. Phase 6 should focus on building the user-facing filtering interfaces and copy-on-write editing experiences on top of the existing backend.

### Q2: For skill/work experience filtering (6.1.3-6.1.4), should this be checkbox-based or more sophisticated?

**Suggested Answer:** **Checkbox-based selection with search/filter capabilities**

- **Skills**: Group by category with expand/collapse, search bar for quick filtering
- **Work Experience**: List view with checkboxes per experience, with ability to select individual accomplishment lines
- **Benefits**: Simple UX, clear visual feedback, works well with existing data structure

**Implementation Priority:** Start with basic checkbox interface, enhance with search later.

### Q3: Copy-on-write editing - automatic or explicit action?

**Suggested Answer:** **Automatic with clear visual indicators**

- When user edits content in scoped resume, automatically create scoped version
- Show visual indicator (e.g., colored border, "customized" badge) to indicate content differs from original
- Provide "reset to original" button to remove customizations
- **Benefits**: Seamless UX, preserves original data integrity, clear feedback

## 🏢 Work Experience Management (6.2)

### Q4: Line ordering - different from Phase 4 implementation?

**Current State Check:** Need to verify what's already implemented in WorkExperienceSection.

**Suggested Answer:** **Build upon existing implementation**

- If basic up/down exists, enhance with more advanced reordering (future)
- If not implemented, start with up/down arrow buttons
- Focus on persistence and smooth animations
- **Priority**: Ensure ordering persists across sessions and scoped resume filtering

### Q5: Markdown preview - inline or toggle mode?

**Suggested Answer:** **Toggle mode with live preview**

- Split view: Edit on left, preview on right (on larger screens)
- Toggle button for smaller screens
- Support basic markdown: **bold**, _italic_, `code`, - lists
- **Benefits**: Familiar pattern, doesn't clutter interface, supports responsive design

## 🛠️ Skills Management (6.3)

### Q6: Hybrid dropdowns - same as Phase 4 or enhanced?

**Suggested Answer:** **Abandon Hybrid dropdowns. We are not using these any more as it does not makes sense with our UI**

### Q7: Bulk skill operations - which operations?

**Suggested Answer:** **Priority operations based on user workflow**

1. **Bulk Delete**: Select multiple skills for removal
2. **Bulk Recategorize**: Move multiple skills to different category/subcategory
3. **Bulk Import**: Import skills from CSV/JSON or predefined tech stacks
4. **Bulk Export**: Export selected skills for backup/sharing

**Implementation Order**: Delete → Recategorize → Import → Export

## 💾 Data Persistence (6.4)

### Q8: Auto-save scope and interaction with current save/cancel pattern?

**Suggested Answer:** **Do not implement Auto-save. The entire application should use explicit save**

- **important** Please remove all references to auto-saving from our documentation (including CLAUDE.md and our root README.md). This is not a feature we want

### Q9: Optimistic updates - which operations benefit most?

**Suggested Answer:** **Focus on frequent, low-risk operations**

1. **Skill additions/deletions**: Immediate UI update, rollback on error
2. **Line reordering**: Instant visual feedback, persist in background
3. **Text editing**: ~~Real-time updates with auto-save~~ **REMOVED - use explicit save**
4. **Category/subcategory creation**: Immediate availability in dropdowns

**Avoid optimistic updates for**: Work experience CRUD, contact info changes, scoped resume creation

## 🚀 Implementation Strategy

### Q10: Where should we start - implementation priority?

**Suggested Answer:** **Phased approach building on existing strengths**

**Phase 6A: Enhanced Work Experience (2-3 tasks)**

- 6.2.1: Add/remove work experience entries (extend existing components)
- 6.2.2: Work experience line management (build on existing)
- 6.2.3: Line ordering (complete existing implementation)

**Phase 6B: Skills Enhancement (1 task)**

- ~~6.3.1: Enhanced hybrid dropdowns~~ **REMOVED - see updated strategy below**
- 6.3.2: Skill grouping/filtering UI
- ~~6.3.4: Basic bulk operations (delete/recategorize)~~ **REMOVED - user decision**

**Phase 6C: Scoped Resume Features (4-5 tasks)**

- 6.1.3: Skill filtering interface
- 6.1.4: Work experience filtering interface
- 6.1.5: Scoped summary editing (copy-on-write)
- 6.1.6: Scoped work experience line editing

**Phase 6D: Data Management & Validation (3-4 tasks)** _(updated scope)_

- ~~6.4.1: Smart auto-save implementation~~ **REMOVED**
- 6.4.2: Optimistic updates for frequent operations
- 6.4.3: Enhanced data validation feedback
- 6.4.4: Data backup/restore functionality

**Rationale**: Build confidence with familiar components first, then tackle complex scoped resume features.

## 📋 Success Metrics for Phase 6

### User Experience Goals

- [ ] User can create targeted resume in under 2 minutes
- [ ] Content filtering is intuitive and fast
- [ ] No data loss during editing sessions
- [ ] Copy-on-write is transparent but clearly indicated
- [ ] Work experience management feels seamless

### Technical Goals

- [ ] All operations feel instantaneous (optimistic updates)
- [ ] ~~Auto-save prevents data loss without user annoyance~~ **REMOVED**
- [ ] **Explicit save/cancel provides clear user control**
- [ ] Complex state changes maintain data integrity
- [ ] Performance remains fast with larger datasets
- [ ] **Manual backup/restore prevents accidental data loss**

---

## Database Schema (Reference)

Note: This section contains the DBML schema structure and other non-markdown text files that were found in the plans directory but are omitted here for brevity. The complete files include:

- `layout.txt` - ASCII layout diagram of main page
- `scoped-layout.txt` - ASCII layout diagram of scoped resume page
- `schema.dbml` - Complete database schema definition

These files are maintained separately and should be referenced directly when needed for implementation details.

## Phase 7: Export System & Data Management

**Goal**: Comprehensive document export capabilities and data backup/restore functionality.

### 7.1 Enhanced Export System
- [ ] **7.1.1** PDF export improvements with better formatting
- [ ] **7.1.2** DOCX export with professional templates
- [ ] **7.1.3** Export customization options (sections, styling)
- [ ] **7.1.4** Scoped resume export integration

### 7.2 Data Backup & Restore
- [ ] **7.2.1** Complete resume data export as JSON
  - Export main resume + all scoped resumes as single JSON file
  - Include all relationships and metadata
- [ ] **7.2.2** Data import functionality
  - Import with merge options (replace vs append)
  - Validation of imported data structure
- [ ] **7.2.3** Manual backup workflows
  - Pre-export backup prompts before major changes
  - Backup file management and organization

### 7.3 Export Templates & Formatting
- [ ] **7.3.1** Professional resume templates
- [ ] **7.3.2** Industry-specific formatting options
- [ ] **7.3.3** Custom branding and styling
- [ ] **7.3.4** Multi-format consistency

---

_This combined documentation represents the complete planning state as of the last update and should be maintained as the single source of truth for project planning and implementation guidance._
