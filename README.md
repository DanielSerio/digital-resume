# 📄 Digital Resume Manager

A modern, full-stack application for creating, managing, and exporting professional resumes with advanced scoping capabilities.

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
├── src/                    # Node.js backend application
│   ├── routes/            # Express API routes
│   ├── lib/               # Backend utilities
│   └── prisma/            # Database schema and migrations
├── plans/                  # Architecture and design docs
├── docker-compose.yml      # Container orchestration
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
- **Zod v4** - Schema validation and type inference
- **TanStack Query** - Server state management and caching
- **Zustand** - Lightweight client state management

### Backend
- **Node.js & Express** - RESTful API server
- **Prisma ORM** - Type-safe database queries
- **SQLite** - Lightweight, file-based database
- **Zod** - Runtime validation and type safety
- **PDF/DOCX Libraries** - Document generation

### Development
- **Docker** - Containerized development environment
- **Vitest** - Fast unit testing with jsdom
- **ESLint & Prettier** - Code quality and formatting
- **TypeScript** - End-to-end type safety

## 📊 Database Schema

The application uses a normalized SQLite database with the following main entities:

- **Users** - Basic user information and settings
- **WorkExperience** - Job history with sortable accomplishment lines
- **Education** - Academic background and certifications
- **TechnicalSkills** - Categorized technical competencies
- **ScopedResumes** - Named resume variations with selective content
- **ScopedContent** - Customized content for specific resume scopes

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
- **Strict TypeScript** - No `any` types, comprehensive interfaces
- **Modern React Patterns** - Hooks, context, and functional components
- **Performance Optimization** - React.memo, lazy loading, efficient queries
- **Accessibility First** - WCAG compliant UI components

## 🔧 Available Scripts

### Frontend (`/web` directory)
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run test       # Run unit tests
npm run lint       # Lint code
```

### Backend (root directory)
```bash
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript
npm run start      # Start production server
npm run test       # Run tests
```

## 📈 Roadmap

- [ ] **Authentication System** - Multi-user support with secure login
- [ ] **Template System** - Multiple resume templates and themes
- [ ] **Collaboration Features** - Share and collaborate on resumes
- [ ] **Analytics Dashboard** - Track resume performance and engagement
- [ ] **Cloud Storage** - Online backup and synchronization
- [ ] **Mobile App** - React Native companion application

## 🤝 Contributing

We welcome contributions! Please see our development guidelines in `CLAUDE.md` and architecture patterns in `plans/patterns.md`.

### Development Guidelines
1. Follow the established component patterns
2. Maintain TypeScript strict mode compliance
3. Write tests for new features
4. Keep components under 200 lines
5. Use consistent naming conventions

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgments

- **Shadcn UI** for the beautiful component library
- **TanStack** for excellent developer tools
- **Tailwind CSS** for the utility-first CSS framework
- **Prisma** for the amazing database toolkit

---

**Built with ❤️ for modern resume management**