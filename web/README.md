# 📄 Digital Resume Manager - Frontend

Modern React 19 frontend for the Digital Resume Management application with advanced state management and comprehensive testing.

## 🚀 Getting Started

### Quick Start (From Root)
```bash
# Start with Docker (recommended)
docker compose up

# Frontend available at: http://localhost:3000
```

### Manual Development Setup
```bash
# From /web directory
npm install
npm run dev
```

## 🔧 Available Scripts

```bash
npm run dev        # Start development server (Vite)
npm run start      # Alias for dev
npm run build      # Build for production with TypeScript compilation
npm run serve      # Preview production build
npm run test       # Run unit tests (Vitest)
npm run test:e2e   # Run Playwright E2E tests ✅
npm run storybook  # Start Storybook (Port 6006) ✅
```

## 🏗️ Architecture

### State Management
- **Server State**: TanStack Query for API data and caching
- **Client State**: Zustand for UI state (centralized edit mode management)
- **Form State**: React Hook Form + Zod v4 validation

### Component Patterns
- **Single Component Design**: Display/edit modes within same component
- **Under 200 Lines**: Components stay focused with sub-component extraction
- **Centralized Edit State**: Global `EditContext` prevents editing conflicts

### Technology Stack
- **React 19** - Latest features with concurrent rendering
- **TypeScript** - Strict type safety throughout
- **TanStack Router** - Type-safe, file-based routing
- **Vite** - Lightning-fast development and builds
- **Tailwind CSS v4** - Utility-first styling
- **Shadcn UI** - Accessible component library
- **Zod v4** - Schema validation with standardSchemaResolver

## 🧭 Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes/`.

### Current Pages
- **Main Resume** (`/main`) - Single-page editing interface for the primary resume
- **Scoped Resumes** (`/scoped`) - Management and editing of targeted resume variations
- **Root Layout** (`__root.tsx`) - Shared layout with navigation tabs

### Adding A Route

To add a new route, create a new file in the `./src/routes` directory:

TanStack Router will automatically generate route trees and provide type-safe navigation.

### Navigation

Our application uses tab-based navigation in the root layout:

```tsx
import { Link } from "@tanstack/react-router";

// Main Resume tab
<Link to="/main" activeProps={{ className: "border-primary" }}>
  Main Resume
</Link>

// Scoped Resumes tab
<Link to="/scoped" activeProps={{ className: "border-primary" }}>
  Scoped Resumes
</Link>
```

### Layout Structure

The root layout (`src/routes/__root.tsx`) provides:
- Application header with title
- Tab navigation between main/scoped resume pages
- Export buttons (PDF/DOCX)
- Toast notifications container
- Error boundaries

Route content appears where the `<Outlet />` component is placed.


## 📊 Data Management

### API Integration
This frontend connects to a Node.js/Express backend API with comprehensive resume data management:

```tsx
// Example: Fetching resume data
import { useResumeData } from "@/hooks";

function ResumePage() {
  const { data: resume, isLoading, error } = useResumeData();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return <ResumeDisplay resume={resume} />;
}
```

### Data Fetching Patterns
- **TanStack Query**: Server state management with caching and optimistic updates
- **Custom Hooks**: Abstracted API calls (`useResumeData`, `useContactData`, etc.)
- **Route Loaders**: Pre-fetch data for scoped resume routes
- **Mutations**: Type-safe create/update/delete operations

### State Synchronization
- **Real-time Updates**: Automatic cache invalidation on mutations
- **Optimistic Updates**: Instant UI feedback with rollback on errors
- **Form Integration**: React Hook Form synced with server state

## 🧪 Testing

### Unit Testing (Vitest)
```bash
npm run test      # Run unit tests
npm run test:watch # Watch mode
```

### E2E Testing (Playwright) ✅
```bash
npm run test:e2e  # Full E2E test suite
```
- Database isolation with test fixtures
- Page object model pattern
- Contact → Summary → Skills → Education → Work Experience coverage

### Component Development (Storybook) ✅
```bash
npm run storybook # Start on port 6006
```
- All resume section components with display/edit modes
- Form components with validation states
- Mock data matching production structure

## 📁 Project Structure

```
web/
├── src/
│   ├── components/
│   │   ├── ui/           # Shadcn UI components
│   │   ├── common/       # Shared components
│   │   └── resume/       # Resume section components
│   ├── routes/           # TanStack Router pages
│   │   ├── main.tsx      # Main resume editing page
│   │   ├── scoped.tsx    # Scoped resume management
│   │   └── __root.tsx    # Root layout with navigation
│   ├── hooks/
│   │   └── edit/         # Edit state management hooks
│   ├── stores/           # Zustand state stores
│   ├── lib/              # Utilities and validation
│   └── types/            # TypeScript definitions
├── tests/
│   ├── unit/             # Vitest unit tests
│   └── e2e/              # Playwright E2E tests
├── stories/              # Storybook component stories
└── package.json
```

## 🔧 Development Guidelines

1. **Components under 200 lines** - Extract sub-components when needed
2. **Single edit mode** - Use centralized `EditContext` system
3. **Type safety** - Strict TypeScript with schema validation
4. **Accessibility** - Comprehensive ARIA support and WCAG compliance
5. **Testing** - Write unit tests and Storybook stories for new components

---

**Part of the Digital Resume Manager application. See root README for complete documentation.**
