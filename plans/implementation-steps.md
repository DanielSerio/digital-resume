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

**Phase 1 Completion Criteria:**
- ✅ Backend server running on port (e.g., 3001) with ts-node-dev hot reloading
- ✅ Frontend development server running on port 3000 with Vite HMR
- ✅ Prisma client configured with SQLite database
- ✅ Database schema migrated and seeded with realistic sample data
- ✅ Development and production Docker configurations ready
- ✅ Docker containers can be built and run with proper volume mounts
- ✅ Hot reloading works for both frontend and backend in development containers
- ✅ Prisma seeding script populates comprehensive sample data covering all major skill categories
- ✅ Selective database reset preserves custom data while refreshing sample resume
- ✅ Basic API health check accessible from frontend
- ✅ OpenSSL compatibility resolved between container environments
- ✅ Frontend accessible from host machine at localhost:3000
- ✅ Hot module replacement works properly in Docker without container restarts

---

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

### 2.3 API Endpoints (REST conventions with basic endpoint testing)
- [x] **2.3.1** Create `/api/resume` endpoint (GET complete resume) with basic tests
- [x] **2.3.2** Create contact endpoints (`GET /api/contact`, `PUT /api/contact`) with basic tests
- [x] **2.3.3** Create summary endpoints (`GET /api/summary`, `PUT /api/summary`) with basic tests
- [x] **2.3.4** Create skills endpoints (`GET /api/skills`, `POST /api/skills`, `PUT /api/skills/:id`, `DELETE /api/skills/:id`) and category/subcategory endpoints with basic tests
- [x] **2.3.5** Create education endpoints (`GET /api/education`, `POST /api/education`, `PUT /api/education/:id`, `DELETE /api/education/:id`) with basic tests
- [x] **2.3.6** Create work experience endpoints (`GET /api/work-experiences`, `POST /api/work-experiences`, `PUT /api/work-experiences/:id`, `DELETE /api/work-experiences/:id`) with transaction support and basic tests
- [x] **2.3.7** Create scoped resume endpoints (`GET /api/scoped-resumes`, `POST /api/scoped-resumes`, `PUT /api/scoped-resumes/:id`, `DELETE /api/scoped-resumes/:id`, `POST /api/scoped-resumes/:id/duplicate`) with basic tests
- [x] **2.3.8** Create nested scoped resume content endpoints (`GET/PUT /api/scoped-resumes/:id/skills`, `GET/PUT /api/scoped-resumes/:id/summary`, `GET/PUT /api/scoped-resumes/:id/work-experiences`) with basic tests

**Phase 2 Completion Criteria:**
- ✅ All Prisma models can be queried and modified with type safety
- ✅ API endpoints return consistent `{ data, error, message }` format with raw Zod errors in details
- ✅ Work experience operations use atomic transactions (experience + lines)
- ✅ Scoped resume endpoints follow nested structure under `/api/scoped-resumes/:id/`
- ✅ Basic endpoint testing validates core functionality
- ✅ Implementation follows basic-to-complex order (Contact/Summary → Skills/Education → Work Experience → Scoped Resumes)
- ✅ Atomic Prisma transactions work for work experience + lines operations
- ✅ Backend Zod validation returns raw error details for client-side message construction
- ✅ Scoped resume operations work with copy-on-write functionality using nested endpoint structure
- ✅ Basic endpoint tests validate CRUD operations and error handling

---

## Phase 3: Frontend State Management ✅ [13/13 completed]

**Goal**: Setup React application with proper state management and API integration.

### 3.1 Dependencies & Core Infrastructure
- [x] **3.1.1** Install Zustand and TanStack React Query packages
- [x] **3.1.2** Setup TanStack Query Provider in app root
- [x] **3.1.3** Generate TypeScript types from Prisma client for frontend use
- [x] **3.1.4** Setup API client using built-in fetch with TanStack Query error handling

### 3.2 Data Fetching (Priority Implementation)
- [x] **3.2.1** Create `useResumeData` hook for fetching complete resume
- [x] **3.2.2** Create API response types and error handling utilities
- [x] **3.2.3** Setup basic error boundary components with simple error catching
- [x] **3.2.4** Create mutation hooks for each data section (contact, summary, skills, education, work experience)

### 3.3 State Management & Validation
- [x] **3.3.1** Create resume store with Zustand for section editing state (router-based navigation, no activeTab state)
- [x] **3.3.2** Create compatible frontend Zod schemas for form validation (matching backend structure)
- [x] **3.3.3** Create `useSkillCategories` and `useSkillSubcategories` hooks
- [x] **3.3.4** Setup form validation schemas with Zod resolvers

### 3.4 Basic Frontend Structure (Completed)
- [x] **3.4.1** TanStack Router configuration with devtools
- [x] **3.4.2** Basic layout component with header navigation
- [x] **3.4.3** Route structure for main and scoped resume views

**Technical Specifications:**
- **Dependencies**: `zustand`, `@tanstack/react-query`
- **Type Generation**: Use Prisma Client generated types as source of truth
- **API Client**: Built-in fetch wrapped with TanStack Query for caching/error handling
- **Form Validation**: Frontend Zod schemas compatible with backend validation
- **Error Handling**: Basic error boundaries for graceful failure recovery
- **Implementation Priority**: Data fetching first, then state management and validation

**Phase 3 Completion Criteria:**
- ✅ Required packages (Zustand, TanStack React Query) installed and configured
- ✅ TypeScript types generated from Prisma client and integrated
- ✅ API client using built-in fetch with TanStack Query error handling works correctly
- ✅ Basic resume data fetching and caching functional via `useResumeData` hook
- ✅ Mutation hooks for all data sections (CRUD operations) working
- ✅ Zustand store manages section editing state correctly
- ✅ Compatible Zod schemas for form validation created and integrated
- ✅ Basic error boundaries catch and handle component failures gracefully
- ✅ Skills category/subcategory hooks support dynamic data fetching
- ✅ Frontend can successfully fetch, display, and modify resume data through API

---

## Phase 4: Basic UI Components ⏳ [10/19 completed]

**Goal**: Build the fundamental UI components and layout structure with modern form handling and conditional navigation.

**Component Architecture Guidelines:**
- **Single Component Pattern**: Each section uses one component handling both display/edit modes internally
- **200 Line Limit**: If components exceed 200 lines, extract sub-components within the main component
- **Local State Management**: React Hook Form state local to each section component
- **Unsaved Changes**: Colored border indicator on sections with unsaved changes
- **Implementation Order**: Header/navigation first, then main resume sections, finally scoped resume features

### 4.1 Header and Navigation (Priority Implementation)
- [x] **4.1.1** Setup Sonner toast container below Outlet in `__root.tsx`
- [x] **4.1.2** Update header with application title and export buttons (PDF/DOCX)
- [x] **4.1.3** Implement tab navigation using custom styled TanStack Router links (Main Resume • Scoped Resumes)
- [x] **4.1.4** Add loading states and error boundaries for main layout structure
- [x] **4.1.5** Fix navigation active state for main resume page routing

### 4.2 Main Resume Section Components (Single Component Pattern - Local Form State)
- [x] **4.2.1** Create `ContactSection` component with internal display/edit toggle, local React Hook Form state, colored border for unsaved changes
- [x] **4.2.2** Create `SummarySection` component with internal display/edit toggle, local React Hook Form state, colored border for unsaved changes
- [x] **4.2.3** Create `SkillsSection` component with internal display/edit toggle, local React Hook Form state, colored border for unsaved changes, category grouping
- [x] **4.2.4** Create `EducationSection` component with internal display/edit toggle, local React Hook Form state, colored border for unsaved changes, date handling
- [x] **4.2.5** Create `WorkExperienceSection` component with internal display/edit toggle, local React Hook Form state, colored border for unsaved changes, up/down arrow reordering
- [x] **4.2.6** Create main resume display page component integrating all sections

### 4.3 Scoped Resume Features (Implement After Main Resume Complete)
- [ ] **4.3.1** Add conditional scoped resume dropdown selector in header (shows all scoped resumes, disabled when none exist)
- [ ] **4.3.2** Add "Create Scoped Resume" button in header (visible on scoped page)
- [ ] **4.3.3** Create `ScopedResumeSelector` component using existing Shadcn Select component
- [ ] **4.3.4** Create `ScopedResumeManager` component (create, rename, duplicate, delete operations)

### 4.4 Form Infrastructure (Using New Dependencies)
- [ ] **4.4.1** Setup React Hook Form with Hookform Resolvers and Zod validation integration (inline field errors)
- [ ] **4.4.2** Create reusable form components using existing Shadcn UI components (check `/web/src/components/ui` first)
- [ ] **4.4.3** Create hybrid dropdown components for skill categories/subcategories using existing Select component
- [ ] **4.4.4** Setup date picker components using existing Shadcn Calendar component
- [ ] **4.4.5** Create work experience line editor with up/down arrow reordering (no drag-and-drop yet)

### 4.5 UI Polish and Styling
- [ ] **4.5.1** Apply consistent Tailwind CSS styling following design system
- [ ] **4.5.2** Use existing Shadcn UI components from `/web/src/components/ui` (Button, Dialog, Card, etc.) - check directory first before adding new components
- [ ] **4.5.3** Implement responsive design with vertical section stacking (no horizontal layouts)
- [ ] **4.5.4** Add hover states, transitions, and loading indicators

**Available Shadcn UI Components** (check `/web/src/components/ui` before adding new ones):
- Form components: Button, Input, Label, Textarea, Checkbox, Select, Calendar
- Layout components: Card, Separator, Tabs, Dialog, Drawer, Popover
- Feedback components: Alert, Badge, Skeleton, Sonner (toasts)
- Navigation components: Breadcrumb, Command

**Additional Dependencies:**
- React Hook Form + Hookform Resolvers for form handling
- Sonner for toast notifications (already available as Shadcn component)
- Next Themes for theme support (if needed)
- CMDK for command palette functionality (already available as Shadcn component)

**Phase 4 Completion Criteria:**
- ✅ Sonner toast container setup below Outlet in `__root.tsx`
- ✅ Header displays application title with PDF/DOCX export buttons
- ✅ Tab navigation works using custom styled TanStack Router links (Main Resume • Scoped Resumes)
- ✅ Navigation active state correctly highlights current page (main/scoped)
- ✅ Main resume sections use single component pattern with internal display/edit toggle (max 200 lines each)
- ✅ Local React Hook Form state management per section component
- ✅ Colored border indicators show unsaved changes on sections
- ✅ Save/cancel actions work explicitly per section (no auto-save)
- ✅ Toast notifications using Sonner directly in components for submission feedback
- ✅ Shadcn Calendar components work correctly for education and work experience dates
- ✅ Skill category/subcategory hybrid dropdowns support adding new items using existing Select component
- ✅ Work experience lines have up/down arrow reordering functionality
- ✅ UI uses vertical section stacking (no horizontal layouts) for all screen sizes
- ✅ All components use existing Shadcn UI components from `/web/src/components/ui`
- ✅ Forms validate and submit data successfully to backend API
- ✅ Work experience data structure mapping fixed for proper API integration
- [ ] Scoped resume features implemented after main resume completion (conditional selector, create button, manager)
- [ ] Form infrastructure completed with hybrid dropdowns and reusable components
- [ ] UI polish and styling applied consistently

---

## Phase 5: Advanced Features ⏳ [0/14 completed]

**Goal**: Add sophisticated functionality and user experience improvements.

### 5.1 Scoped Resume Management
- [ ] **5.1.1** Implement scoped resume creation and naming
- [ ] **5.1.2** Add scoped resume duplication functionality
- [ ] **5.1.3** Create skill filtering interface for scoped resumes
- [ ] **5.1.4** Create work experience filtering interface for scoped resumes
- [ ] **5.1.5** Implement scoped professional summary editing (copy-on-write)
- [ ] **5.1.6** Implement scoped work experience line editing (copy-on-write)

### 5.2 Work Experience Management
- [ ] **5.2.1** Implement adding/removing work experience entries
- [ ] **5.2.2** Add work experience line management (add, edit, delete)
- [ ] **5.2.3** Implement basic line ordering (up/down buttons)
- [ ] **5.2.4** Add markdown preview for work experience lines

### 5.3 Skills Management
- [ ] **5.3.1** Implement dynamic skill category/subcategory creation via hybrid dropdowns
- [ ] **5.3.2** Add skill grouping and filtering in UI
- [ ] **5.3.3** Create skill search/autocomplete functionality
- [ ] **5.3.4** Implement bulk skill operations

### 5.4 Data Persistence
- [ ] **5.4.1** Add auto-save functionality (debounced)
- [ ] **5.4.2** Implement optimistic UI updates where appropriate
- [ ] **5.4.3** Add data validation feedback
- [ ] **5.4.4** Create data backup/restore functionality

**Phase 5 Completion Criteria:**
- ✅ Scoped resume system works seamlessly (create, rename, duplicate, filter)
- ✅ Copy-on-write editing preserves original data while allowing customization
- ✅ Complex data operations work smoothly
- ✅ User can manage all resume sections efficiently
- ✅ Auto-save prevents data loss
- ✅ Advanced UI features enhance usability

---

## Phase 6: Export System ⏳ [0/12 completed]

**Goal**: Implement PDF and DOCX export functionality with template system.

### 6.1 Template System
- [ ] **6.1.1** Create export template directory structure
- [ ] **6.1.2** Design HTML template for PDF export (basic professional layout - specific formatting preferences to be addressed later)
- [ ] **6.1.3** Create CSS styling for PDF layout (clean, standard formatting)
- [ ] **6.1.4** Design DOCX template structure (basic professional layout)
- [ ] **6.1.5** Implement template engine (Handlebars or similar)

### 6.2 PDF Generation
- [ ] **6.2.1** Install and configure Puppeteer
- [ ] **6.2.2** Create PDF generation service
- [ ] **6.2.3** Implement template rendering for PDF
- [ ] **6.2.4** Add PDF styling and layout optimization
- [ ] **6.2.5** Create `/api/resume/export/pdf` endpoint

### 6.3 DOCX Generation
- [ ] **6.3.1** Install and configure docx library
- [ ] **6.3.2** Create DOCX generation service
- [ ] **6.3.3** Implement document structure template
- [ ] **6.3.4** Add formatting and styling for DOCX
- [ ] **6.3.5** Create `/api/resume/export/docx` endpoint

### 6.4 Frontend Export UI
- [ ] **6.4.1** Add export buttons to main interface (main + scoped resume support)
- [ ] **6.4.2** Implement download functionality
- [ ] **6.4.3** Add export loading states
- [ ] **6.4.4** Handle export errors gracefully

**Phase 6 Completion Criteria:**
- ✅ PDF exports generate properly formatted resumes (main and scoped)
- ✅ DOCX exports create editable documents (main and scoped)
- ✅ Templates can be easily modified
- ✅ Export process is fast and reliable
- ✅ Users can download exported files successfully
- ✅ Export UI clearly indicates which resume (main/scoped) is being exported

---

## Phase 7: Testing & Quality Assurance ⏳ [0/10 completed]

**Goal**: Ensure application reliability through comprehensive testing.

### 7.1 Backend Testing
- [ ] **7.1.1** Setup Jest for backend testing
- [ ] **7.1.2** Write unit tests for all service methods
- [ ] **7.1.3** Write integration tests for API endpoints
- [ ] **7.1.4** Test database transactions and rollbacks
- [ ] **7.1.5** Test export functionality with sample data

### 7.2 Frontend Testing
- [ ] **7.2.1** Setup Vitest testing environment
- [ ] **7.2.2** Write component tests for all major components
- [ ] **7.2.3** Test form validation and submission
- [ ] **7.2.4** Test state management and API integration
- [ ] **7.2.5** Test export download functionality

### 7.3 End-to-End Testing
- [ ] **7.3.1** Setup Playwright or Cypress for E2E tests
- [ ] **7.3.2** Test complete user workflows
- [ ] **7.3.3** Test Docker container functionality
- [ ] **7.3.4** Validate export file generation

**Phase 7 Completion Criteria:**
- ✅ All critical functionality is tested
- ✅ Test coverage meets quality standards
- ✅ CI/CD can run tests automatically
- ✅ Manual testing confirms all features work

---

## Phase 8: Polish & Documentation ⏳ [0/6 completed]

**Goal**: Finalize the application with documentation and performance optimization.

### 8.1 Performance Optimization
- [ ] **8.1.1** Optimize database queries and indexes
- [ ] **8.1.2** Implement frontend code splitting and lazy loading
- [ ] **8.1.3** Optimize export generation performance
- [ ] **8.1.4** Add performance monitoring and logging

### 8.2 Documentation
- [ ] **8.2.1** Write comprehensive README with setup instructions
- [ ] **8.2.2** Document API endpoints and schemas
- [ ] **8.2.3** Create user guide for resume management
- [ ] **8.2.4** Document deployment and maintenance procedures

### 8.3 Final Polish
- [ ] **8.3.1** Conduct thorough manual testing
- [ ] **8.3.2** Fix any remaining bugs or edge cases
- [ ] **8.3.3** Optimize UI/UX based on testing feedback
- [ ] **8.3.4** Prepare for production deployment

**Phase 8 Completion Criteria:**
- ✅ Application performs well under normal usage
- ✅ Documentation is complete and accurate
- ✅ No critical bugs remain
- ✅ Application is ready for production use

---

## Progress Tracking

### Overall Progress: 55/104 tasks completed (52.9%)

| Phase | Progress | Status |
|-------|----------|--------|
| Phase 1: Foundation Setup | 16/16 (100%) | ✅ Completed |
| Phase 2: Core Data Layer | 16/16 (100%) | ✅ Completed |
| Phase 3: Frontend State Management | 13/13 (100%) | ✅ Completed |
| Phase 4: Basic UI Components | 10/19 (52.6%) | ⏳ In Progress |
| Phase 5: Advanced Features | 0/14 (0%) | ⏳ Pending |
| Phase 6: Export System | 0/12 (0%) | ⏳ Pending |
| Phase 7: Testing & QA | 0/10 (0%) | ⏳ Pending |
| Phase 8: Polish & Documentation | 0/6 (0%) | ⏳ Pending |

### Current Focus
**Active Phase**: Phase 4 - Basic UI Components  
**Next Task**: 4.3.1 - Add conditional scoped resume dropdown selector in header
**Implementation Order**: ✅ Header/navigation → ✅ Main resume sections → Scoped resume features
**Component Pattern**: Single components (max 200 lines) with internal display/edit toggle and local form state
**Layout Reference**: See `plans/layout.txt` for exact design specifications

### Major Accomplishments
- **✅ Complete Backend API**: All database models, services, and REST endpoints implemented
- **✅ Database Layer**: Prisma with SQLite, full CRUD operations, atomic transactions
- **✅ Scoped Resume System**: Backend infrastructure for creating, managing, and filtering resume variations
- **✅ Development Environment**: Docker containerization with hot reloading for both frontend and backend
- **✅ Frontend Data Layer**: Complete state management with Zustand, TanStack Query, and typed API client
- **✅ TypeScript Integration**: Full type safety with generated types from Prisma client
- **✅ Form Validation**: Compatible Zod schemas for frontend validation matching backend structure
- **✅ Error Handling**: Functional component error boundaries with graceful failure recovery

### Development Environment Features
- **Hot Reloading**: Both frontend (Vite HMR with polling) and backend (ts-node-dev) support hot reloading in Docker
- **Auto-Start**: Single `docker-compose up` command starts both frontend and backend automatically
- **Data Seeding**: Realistic sample resume data with single comprehensive work experience using generic company (e.g., "Tech Solutions Inc") and flexible skill categorization
- **Database Persistence**: Prisma with SQLite stored in Docker volume, persistent across container rebuilds
- **Database Management**: Selective reset/reseed functionality preserving custom data
- **Volume Mounts**: Source code mounted for live development in containers (developers manually rebuild when dependencies change)
- **Multi-Environment**: Separate Docker configurations for development and production
- **TypeScript**: Full TypeScript support with ts-node-dev for backend development
- **Sequential Implementation**: Tasks follow exact sequence for optimal dependency management
- **Docker Compatibility**: OpenSSL compatibility resolved for Prisma across different base images
- **Network Access**: Frontend properly accessible from host machine at localhost:3000
- **File Watching**: Vite configured with polling for reliable file change detection in Docker volumes

### Success Metrics
- [ ] Application runs in Docker containers
- [ ] All resume sections can be edited and saved
- [ ] Scoped resume system works (create, filter, modify without affecting originals)
- [ ] Copy-on-write editing preserves original data integrity
- [ ] PDF and DOCX exports generate correctly (main and scoped resumes)
- [ ] No data loss during editing
- [ ] Application is responsive and user-friendly
- [ ] All tests pass consistently
- [ ] Documentation is comprehensive

### Risk Mitigation
- **Database Design**: Schema has been validated against requirements
- **State Management**: Proven patterns with Zustand + React Query
- **Export Functionality**: Template system allows for easy modifications
- **Docker Setup**: Standard containerization approach
- **Testing Strategy**: Multi-layer testing approach ensures reliability

---

## Future Phases (Post-MVP)

### Phase 9: Advanced Features (Future)
- [ ] Drag-and-drop reordering for work experience lines
- [ ] File upload support (profile photos, documents)
- [ ] Multiple resume templates/themes

## Technical Debt & Improvements

### Backend Improvements
- [ ] **Update Backend Zod to v4** - Upgrade backend from Zod v3 to v4 for consistency with frontend
  - Update package.json dependency
  - Update validation schemas to use new v4 syntax if needed
  - Test all API endpoints for compatibility
  - Update any breaking changes in validation logic

### Testing Infrastructure
- [ ] **Integrate Playwright for E2E Testing** - Add fixture-based integration testing
  - Install @playwright/test and configure for React applications
  - Setup Playwright config with test directory structure
  - Create test fixtures for database seeding and cleanup
  - Implement page object models for resume sections
  - Add tests for core user flows: editing sections, creating scoped resumes, export functionality
  - Configure CI/CD pipeline integration
  - Setup Docker support for headless testing

- [ ] **Integrate Storybook for Component Testing** - Add component development and testing environment
  - Install Storybook with React/Vite support
  - Configure Storybook with Tailwind CSS and Shadcn UI
  - Create stories for all resume section components
  - Add interaction testing with @storybook/testing-library
  - Implement visual regression testing with Chromatic
  - Document component props and usage patterns
  - Setup Storybook build and deployment
- [ ] Resume version history
- [ ] Data import/export (JSON, XML)

### Phase 10: Enhancement (Future)
- [ ] Resume analytics and suggestions
- [ ] Integration with job boards
- [ ] Collaboration features (sharing, feedback)
- [ ] Mobile application
- [ ] Cloud synchronization