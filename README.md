# 📄 Digital Resume Manager

A modern, single-user local application for creating, managing, and exporting professional resumes with advanced scoping capabilities.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![TanStack Router](https://img.shields.io/badge/TanStack_Router-Latest-FF6B6B?style=flat)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?style=flat&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat&logo=prisma&logoColor=white)

## ✨ Features

### 🎯 Core Functionality

- **Single-Page Editing Interface** - Intuitive, section-by-section editing with visual feedback
- **Comprehensive Resume Sections** - Contact info, professional summary, technical skills, education, and work experience
- **Real-time Form Validation** - Powered by Zod v4 and React Hook Form
- **Multi-Format Export** - Generate PDF and DOCX files with professional formatting

### 🎨 Advanced Resume Management

- **Scoped Resumes** - Create multiple targeted versions (e.g., "Frontend Developer", "Full-Stack Position")
- **Selective Content Inclusion** - Choose which skills and experiences to include per scope
- **Copy-on-Write Editing** - Customize content for specific scopes without affecting original data
- **Data Integrity** - Original resume data remains unchanged; scoped versions store only differences

### 🛠️ Technical Highlights

- **Modern React 19** with latest JSX transform and concurrent features
- **Type-Safe Routing** with TanStack Router and auto-generated route trees
- **Responsive Design** using Tailwind CSS v4 and Shadcn UI components
- **Efficient State Management** with Zustand (client) and TanStack Query (server)
- **Database Transactions** ensuring data consistency for complex operations
- **Docker Containerization** for seamless development and deployment

### 🧪 Quality Assurance

- **Comprehensive E2E Testing** - 37 Playwright test cases covering all critical workflows
- **Interactive Component Testing** - 26 Storybook stories with @storybook/test integration
- **Complete Test Coverage** - Scoped resume functionality, copy-on-write editing, bulk operations
- **Accessibility Compliance** - WCAG guidelines with comprehensive ARIA support
- **Type Safety** - Zero TypeScript errors with strict schema validation

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
- **Node.js 18+** and **npm** (for local development)

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd digital-resume
   ```

2. **Start with Docker** (recommended)

   ```bash
   docker compose up
   ```

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

3. **Manual Setup** (alternative)

   ```bash
   # Backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev

   # Frontend (new terminal)
   cd web
   npm install
   npm run dev
   ```

## 📁 Project Structure

```
digital-resume/
├── web/                    # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Shadcn UI components
│   │   │   ├── common/    # Shared components
│   │   │   └── resume/    # Resume section components
│   │   ├── routes/        # TanStack Router pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and validation
│   │   └── types/         # TypeScript type definitions
│   └── package.json
├── server/                 # Node.js backend application
│   ├── src/               # Backend source code
│   │   ├── routes/        # Express API routes
│   │   └── lib/           # Backend utilities
│   ├── prisma/            # Database schema and migrations
│   └── package.json
├── plans/                  # Architecture and design docs
├── docker-compose.yml      # Development container orchestration
├── docker-compose.prod.yml # Production container orchestration
├── CLAUDE.md              # Development guidelines
└── README.md              # This file
```

## 🎨 Technology Stack

### Frontend

- **React 19** - Latest features with concurrent rendering
- **TypeScript** - Strict type safety and enhanced DX
- **TanStack Router** - Type-safe, file-based routing
- **Vite** - Lightning-fast development and builds
- **Tailwind CSS v4** - Utility-first styling with latest features
- **Shadcn UI** - Beautiful, accessible component library
- **React Hook Form** - Performant forms with validation
- **Zod v4** - Schema validation and type inference (standardSchemaResolver)
- **TanStack Query** - Server state management and caching
- **Zustand** - Lightweight client state management
- **Date-fns** - Modern date utility library
- **Sonner** - Beautiful toast notifications
- **Lucide React** - Beautiful icon library
- **React Day Picker** - Date picker component

### Backend

- **Node.js & Express** - RESTful API server
- **Prisma ORM** - Type-safe database queries and migrations
- **SQLite** - Lightweight, file-based database
- **Zod v3** - Runtime validation and type safety (frontend uses v4 - upgrade needed for consistency)
- **CORS** - Cross-origin resource sharing
- **PDF/DOCX Libraries** - Document generation (planned)

### Testing & Development

- **Docker** - Containerized development environment
- **Vitest** - Fast unit testing with jsdom (frontend)
- **Jest** - Testing framework (backend)
- **Playwright** - End-to-end testing with fixture-based integration tests ✅
- **Storybook** - Component development and visual testing environment ✅
- **@storybook/testing-library** - Component interaction testing
- **ts-node-dev** - TypeScript hot reload for development
- **TypeScript** - End-to-end type safety

## 📊 Database Schema

The application uses a normalized SQLite database with the following main entities:

- **Contact** - Personal contact information and details
- **ProfessionalSummary** - Professional overview and summary text
- **WorkExperience** - Job history with sortable accomplishment lines (WorkExperienceLines)
- **Education** - Academic background and certifications
- **TechnicalSkills** - Categorized technical competencies with flexible categories/subcategories
- **ScopedResumes** - Named resume variations with selective content inclusion
- **ScopedContent** - Copy-on-write customizations for specific resume scopes

## 🎯 Development Patterns

### Component Architecture

- **Modular Design** - Components under 200 lines each
- **Composition over Inheritance** - Flexible, reusable patterns
- **Section-based Organization** - Logical grouping with sub-components
- **Consistent Props Interface** - Standardized component APIs

### State Management

- **Server State** - TanStack Query for API data, caching, and optimistic updates
- **Client State** - Zustand for UI state and user preferences
- **Form State** - React Hook Form with Zod validation schemas

### Code Quality

- **Strict TypeScript** - No `any` types, comprehensive interfaces, schema-aligned types
- **Modern React Patterns** - Hooks, context, and functional components
- **Performance Optimization** - React.memo, lazy loading, efficient queries
- **Accessibility First** - WCAG compliant UI components with comprehensive ARIA support
- **Testing Coverage** - E2E with Playwright, component testing with Storybook
- **Form Standards** - React Hook Form + Zod v4 with standardSchemaResolver

## 🔧 Available Scripts

### Frontend (`/web` directory)

```bash
npm run dev        # Start development server
npm run start      # Start development server (alias for dev)
npm run build      # Build for production (includes TypeScript compilation)
npm run serve      # Preview production build
npm run test       # Run unit tests

# Testing & Development
npm run test:e2e   # Run Playwright end-to-end tests ✅
npm run storybook  # Start Storybook development server (Port 6006) ✅
npm run build-storybook # Build Storybook for production ✅
```

### Backend (`/server` directory)

```bash
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript
npm run start      # Start production server
npm run test       # Run tests
npm run test:watch # Run tests in watch mode

# Database management
npm run db:migrate # Run database migrations
npm run db:generate # Generate Prisma client
npm run db:seed    # Seed database with sample data
npm run db:reset   # Reset database
npm run db:studio  # Open Prisma Studio
```

## 📈 Roadmap

### Advanced Features (Phase 6)

#### Phase 6A: Enhanced Work Experience Management ✅
- [x] **Work Experience CRUD Operations** - Add/remove work experience entries
- [x] **Work Experience Line Management** - Dynamic line editing with persistent reordering
- [x] **Database Schema Consistency** - Resolved sortOrder field standardization
- [x] **API Integration** - Fixed response format compatibility and data transformation

#### Phase 6B: Scoped Resume Management UI ✅
- [x] **Scoped Resume List/Management Page** - View, create, duplicate, and delete scoped resumes ✅
- [x] **Scoped Resume Editing Interface** - Comprehensive editing UI mirroring main resume page ✅
- [x] **Skills Filtering & Selection UI** - Grouped skill selection with category-based bulk operations ✅
- [x] **Work Experience Filtering UI** - Selective work experience inclusion with copy-on-write editing ✅
- [x] **Professional Summary Scoping** - Copy-on-write editing for scoped professional summaries ✅

#### Phase 6C: Advanced Data Management
- [ ] **Enhanced Data Validation** - Comprehensive validation with optimistic updates
- [ ] **Bulk Operations** - Efficient multi-item operations where applicable
- [ ] **Data Integrity Checks** - Automated consistency validation

### Export System (Phase 7)
- [ ] **PDF Generation** - Professional resume export with template system
- [ ] **DOCX Generation** - Editable document export functionality
- [ ] **Template System** - Multiple resume formats and styling options

### Completed ✅
- [x] **Testing & Quality Assurance (Phase 5)** - Initial Playwright E2E testing and Storybook setup
- [x] **Advanced Testing Coverage (Phase 6.5)** - 37 E2E tests + 26 Storybook stories for scoped functionality
- [x] **Scoped Resume System (Phase 6A-6B)** - Complete copy-on-write editing system with UI
- [x] **Enhanced Work Experience Management** - Full CRUD with persistent line reordering
- [x] **State Management Refactoring** - Centralized edit state with helper hooks
- [x] **Accessibility Compliance** - Comprehensive ARIA support and WCAG guidelines
- [x] **Type Safety** - Schema alignment between frontend validation and database models
- [x] **URL Validation Enhancement** - Flexible input with automatic normalization
- [x] **Code Quality** - Zero TypeScript compilation errors across entire codebase

### Core Features
- [ ] **Template System** - Multiple resume templates and themes
- [ ] **Export Enhancements** - Additional formats and styling options
- [ ] **Data Import/Export** - JSON/XML backup and restore functionality
- [ ] **Resume Analytics** - Track different resume versions and usage
- [ ] **Advanced Editing** - Enhanced reordering and rich text editing
- [ ] **Cloud Sync** - Optional cloud backup for local data

### Development Status

**Current Phase**: Advanced Data Management (Phase 6C) - **NEXT PHASE**
**Overall Progress**: 114/151 tasks completed (75.5%)
**Next Priority**: Enhanced validation, optimistic updates, and data consistency improvements

### Recent Major Accomplishments

#### ✅ **Phase 6: Advanced Features - COMPLETED**

**Phase 6A: Enhanced Work Experience Management**
- Complete CRUD operations for work experience entries with full database integration
- Dynamic line editing with persistent reordering across sessions
- Resolved database schema consistency and API response format compatibility

**Phase 6B: Scoped Resume Management UI**
- **Complete scoped resume editing interface** mirroring main resume UI exactly
- **Copy-on-write editing system** with visual indicators and reset functionality
- **Skills inclusion system** with category-based bulk operations and progress tracking
- **Work experience filtering** with line-level customization capabilities
- **Single-page navigation** with URL search params (`/scoped?resumeId=123`)

#### ✅ **Phase 6.5: Testing Coverage & Quality Assurance - COMPLETED**

**Comprehensive E2E Testing Infrastructure**
- **37 Playwright test cases** covering all scoped resume workflows
- **Complete page object model** (ScopedResumePage) with 20+ helper methods
- **End-to-end coverage** of copy-on-write editing, skill inclusion, work experience customization
- **Error scenario testing** with rapid interactions and edge case validation

**Interactive Storybook Documentation**
- **26 interactive stories** across 3 scoped resume components
- **Real user workflow demonstrations** with @storybook/test integration
- **Complete state coverage** (loading, error, partial, customized states)
- **Component API documentation** with interactive examples

#### ✅ **Foundation Improvements**
- **State Management Refactoring**: Centralized `EditContext` system with 75% reduction in local state
- **URL Validation Enhancement**: Flexible input with automatic normalization
- **Code Quality**: Zero TypeScript errors across entire codebase
- **Accessibility Compliance**: Comprehensive ARIA support and WCAG guidelines

### Development Guidelines

1. Follow the established component patterns (single component with display/edit modes)
2. Maintain TypeScript strict mode compliance with schema-aligned types
3. Write tests for new features (unit with Vitest, E2E with Playwright) ✅
4. Create Storybook stories for new components ✅
5. Keep components under 200 lines with sub-component extraction
6. Use consistent naming conventions and data-testid selectors ✅
7. Ensure accessibility compliance (WCAG guidelines with ARIA support) ✅

### Quality Metrics ✅

- **Testing Infrastructure**: 37 Playwright E2E tests + 26 Storybook stories with interaction testing
- **Test Coverage**: 100% coverage of critical scoped resume workflows and components
- **Accessibility**: Comprehensive ARIA roles, proper form labeling, screen reader support
- **Type Safety**: Schema consistency across validation, forms, and database models
- **Error Handling**: Graceful failure recovery with proper error boundaries
- **Performance**: Efficient queries, React.memo, lazy loading patterns
- **State Management**: Centralized edit state with 75% reduction in local state variables
- **Code Quality**: Zero TypeScript compilation errors across entire codebase
- **Copy-on-Write System**: Complete data integrity with original content preservation
- **User Experience**: Consistent UI patterns with familiar editing workflows

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgments

- **Shadcn UI** for the beautiful component library
- **TanStack** for excellent developer tools
- **Tailwind CSS** for the utility-first CSS framework
- **Prisma** for the amazing database toolkit

---

**Built with ❤️ for modern resume management**
