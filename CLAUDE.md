# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a **digital resume management application** with a React frontend built with modern tooling:

- **Frontend**: Located in `/web` directory
- **Technology Stack**: React 19, TypeScript, TanStack Router, Vite, Tailwind CSS v4, Shadcn UI
- **Backend**: Node.js/Express API application (outside `/web` directory) with Prisma ORM and SQLite database
- **Database**: Prisma ORM with SQLite for type-safe queries and simplified development
- **State Management**: Zustand for client state, TanStack React Query for server state
- **Forms**: React Hook Form + Hookform Resolvers + Zod v4 for validation
  - **IMPORTANT**: Using Zod v4 requires `standardSchemaResolver` from `@hookform/resolvers/standard-schema` instead of `zodResolver`
- **Authentication**: Local/single-user application (no authentication required)
- **Testing**: Vitest with jsdom environment, Playwright for E2E testing ✅, Storybook for component development ✅
- **Styling**: Tailwind CSS with utility-first approach and Shadcn components

## Application Purpose

The application allows users to manage their resume with five main sections:

1. **Header/Contact Info**: Name, title, email, phone, GitHub, website, LinkedIn
2. **Professional Summary**: Overview text section
3. **Technical Skills**: Flexible skill categorization with name, category (Back-end, Front-end, etc.), subcategory (Framework, Language, Tool, etc.) - any category can pair with any subcategory. Uses hybrid dropdown interface (existing options + "Add new")
4. **Education**: School details including name, location, degree information, dates
5. **Work Experience**: Company information with job titles and sortable accomplishment lines (stored as markdown text with line IDs for ordering)

## Scoped Resume System

The application supports creating **scoped resumes** - filtered and customized versions of the main resume:

- **Scoped Resume Management**: Create, name, duplicate, and delete multiple resume variations (e.g., "Frontend Developer Role", "Full-Stack Position")
- **Selective Content**: Include/exclude specific skills and work experiences per scoped resume
- **Copy-on-Write Editing**: Modify professional summaries and work experience lines for specific scopes without affecting the original data
- **Data Integrity**: Original resume data remains unchanged; scoped versions only store differences/customizations
- **Export Support**: PDF and DOCX exports work for both main and scoped resumes
- **Automatic Inclusion**: Contact info and education are always included as-is in scoped resumes

**Key Features:**

- Local single-user application (no authentication)
- Single resume management with standardized format
- Single-page editing interface
- Backend-handled PDF and DOCX export
- Docker containerization for local development

## Development Commands

All commands should be run from the `/web` directory:

```bash
# Development server (port 3000)
npm run dev
# or
npm run start

# Build for production (includes TypeScript compilation)
npm run build

# Run tests
npm run test

# Preview production build
npm run serve

# Add Shadcn components (check /web/src/components/ui first to see what's already available)
pnpx shadcn@latest add [component-name]
```

## Architecture

- **Routing**: File-based routing using TanStack Router

  - Routes are defined in `/web/src/routes/`
  - Root layout in `/web/src/routes/__root.tsx`
  - Auto-generated route tree in `routeTree.gen.ts`

- **Components**:

  - Custom components in `/web/src/components/`
  - Shadcn UI components in `/web/src/components/ui` with aliases (`@/components/ui`)
  - **IMPORTANT**: Always check `/web/src/components/ui` directory first to see existing Shadcn components before adding new ones
  - Available Shadcn components: Button, Input, Label, Textarea, Checkbox, Select, Calendar, Card, Separator, Tabs, Dialog, Drawer, Popover, Alert, Badge, Skeleton, Sonner, Breadcrumb, Command
  - Utility classes in `/web/src/lib/utils.ts`

- **State Management**:

  - Zustand stores for client-side state management
  - TanStack React Query for server state, caching, and API calls
  - Optimistic updates for contact form (instant UI feedback with automatic rollback on errors)
  - React Hook Form with Zod validation for form handling

- **Data Flow**:

  - Single-page interface with toggle edit modes per section
  - Node.js/Express API with SQLite database for data persistence
  - Database transactions for multi-table operations (work experience + lines)
  - Backend-handled export functionality with separate template system
  - Standard React Query pattern for server state management
  - Single standardized resume format/template

- **Styling**:
  - Tailwind CSS v4 configuration
  - Path aliases: `@/` maps to `./src/`
  - CSS variables enabled for theming

## Code Standards

The project follows strict TypeScript and React conventions defined in Cursor rules:

- **TypeScript**: Strict typing enforced, prefer interfaces over types, avoid `any`
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Performance**: Use React.memo, lazy loading, efficient data structures
- **UI**: Responsive design, accessibility compliance, Tailwind utility classes
- **Code Style**: Latest stable React/TypeScript features, clear and readable code

## Key Configuration Files

- **Vite Config**: `/web/vite.config.ts` - includes TanStack Router plugin, Tailwind, path aliases
- **TypeScript**: `/web/tsconfig.json` - strict configuration with path mapping
- **Shadcn**: `/web/components.json` - New York style, TypeScript enabled
- **Package Management**: Uses npm with lock file

## Development Notes

- The project uses React 19 with modern JSX transform
- TanStack Router provides type-safe routing with auto-completion
- Devtools are enabled in development for both React and Router
- File-based routing means adding a new route requires creating a file in `/web/src/routes/`
- Local development environment with Docker containerization
- Separate Docker configurations for development (hot reload + volumes) and production
- Backend uses ts-node-dev for TypeScript hot reloading in development
- SQLite database provides simple, file-based data persistence
- No authentication system needed (single-user local application)
- Backend handles document export using Node.js PDF/DOCX libraries
- Form validation uses separate but compatible Zod schemas for frontend/backend layers
- State management pattern: Zustand for UI state, React Query for server state (standard pattern)
- Single standardized resume template with separate template system for exports
- Edit modes toggle per section rather than simultaneous editing
- Database transactions ensure data consistency for complex operations
- Realistic sample data seeding with single comprehensive work experience using generic company (e.g., "Tech Solutions Inc") and flexible skill categorization
- Selective database reset preserves custom data while refreshing sample resume
- Prisma ORM with SQLite database stored in Docker volume (gitignored) for persistence across container rebuilds
- Docker compose auto-starts both frontend and backend services (developers manually rebuild containers when dependencies change)
- Implementation tasks follow exact sequence for optimal dependency management
- Export templates use single fixed format (simple approach)
- API validation errors preserve raw Zod error structure in response details
- File upload patterns will be added later (not currently implemented)
- Reference the `plans` directory for information about our application plan, architecture patterns, and design decisions
- Reference `plans/documentation.md` for comprehensive project documentation and implementation status
- Reference `plans/layout.txt` for an ascii image of the main page layout and `plans/scoped-layout.txt` for scoped resume page layout
- Reference `plans/schema.dbml` for database schema and relationships
- Keep files under 200 lines
- **Current Development Phase**: Advanced Features (Phase 6) - enhanced scoped resume management and user experience improvements
  - **Phase 6A**: Enhanced Work Experience Management ✅ - Completed all work experience CRUD operations and line reordering
  - **Phase 6B**: Scoped Resume Management UI - Dedicated interface for creating/managing scoped resumes with selective content filtering
  - **Phase 6C**: Advanced Data Management ✅ - Optimistic updates for improved UX (contact form shows instant feedback)
- **Previous Phase**: Testing & Quality Assurance ✅ - Playwright E2E testing and Storybook component development completed
- **Recent Major Accomplishment**: Phase 6C completion with optimistic updates implementation for better user experience
