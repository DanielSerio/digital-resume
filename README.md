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
- **Zod v3** - Runtime validation and type safety (to be upgraded to v4)
- **CORS** - Cross-origin resource sharing
- **PDF/DOCX Libraries** - Document generation (planned)

### Testing & Development

- **Docker** - Containerized development environment
- **Vitest** - Fast unit testing with jsdom (frontend)
- **Jest** - Testing framework (backend)
- **Playwright** - End-to-end testing with fixture-based integration tests (**NEXT PRIORITY**)
- **Storybook** - Component development and visual testing environment (**NEXT PRIORITY**)
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

### Advanced Features (Next Priority - Phase 6)
- [ ] **Enhanced Scoped Resume Management** - Full implementation of selective content filtering
- [ ] **Work Experience Management** - Enhanced line editing, reordering, and markdown support
- [ ] **Skills Management** - Dynamic category creation and advanced filtering
- [ ] **Data Persistence** - Auto-save functionality and optimistic updates

### Export System (Phase 7)
- [ ] **PDF Generation** - Professional resume export with template system
- [ ] **DOCX Generation** - Editable document export functionality
- [ ] **Template System** - Multiple resume formats and styling options

### Completed ✅
- [x] **Testing & Quality Assurance** - Playwright E2E testing and Storybook component development
- [x] **Accessibility Compliance** - Comprehensive ARIA support and WCAG guidelines
- [x] **Type Safety** - Schema alignment between frontend validation and database models
- [x] **E2E Test Infrastructure** - Working test suite with proper selectors and fixtures

### Core Features
- [ ] **Template System** - Multiple resume templates and themes
- [ ] **Export Enhancements** - Additional formats and styling options
- [ ] **Data Import/Export** - JSON/XML backup and restore functionality
- [ ] **Resume Analytics** - Track different resume versions and usage
- [ ] **Advanced Editing** - Drag-and-drop reordering and rich text
- [ ] **Cloud Sync** - Optional cloud backup for local data

### Development Status

**Current Phase**: Advanced Features (Phase 6)  
**Overall Progress**: 81/119 tasks completed (68.1%)  
**Next Priority**: Enhanced scoped resume management and work experience features

### Development Guidelines

1. Follow the established component patterns (single component with display/edit modes)
2. Maintain TypeScript strict mode compliance with schema-aligned types
3. Write tests for new features (unit with Vitest, E2E with Playwright) ✅
4. Create Storybook stories for new components ✅
5. Keep components under 200 lines with sub-component extraction
6. Use consistent naming conventions and data-testid selectors ✅
7. Ensure accessibility compliance (WCAG guidelines with ARIA support) ✅

### Quality Metrics ✅

- **Testing Infrastructure**: Playwright E2E and Storybook component testing working
- **Accessibility**: Comprehensive ARIA roles, proper form labeling, screen reader support
- **Type Safety**: Schema consistency across validation, forms, and database models  
- **Error Handling**: Graceful failure recovery with proper error boundaries
- **Performance**: Efficient queries, React.memo, lazy loading patterns

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgments

- **Shadcn UI** for the beautiful component library
- **TanStack** for excellent developer tools
- **Tailwind CSS** for the utility-first CSS framework
- **Prisma** for the amazing database toolkit

---

**Built with ❤️ for modern resume management**
