# Development Patterns

This document outlines the development patterns and conventions to follow when building the digital resume management application.

## Frontend Patterns (React/TypeScript)

### Component Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── forms/           # Form-specific components
│   ├── sections/        # Resume section components
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

**Zustand for Client State (Section-based Editing):**
```typescript
// stores/resumeStore.ts
interface ResumeState {
  editingSection: string | null  // Only one section editable at a time
  setEditingSection: (section: string | null) => void
  isEditingSection: (section: string) => boolean
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  editingSection: null,
  setEditingSection: (section) => set({ editingSection: section }),
  isEditingSection: (section) => get().editingSection === section,
}))
```

**React Query for Server State (Standard Pattern):**
```typescript
// hooks/useResume.ts
export const useResumeData = () => {
  return useQuery({
    queryKey: ['resume'],
    queryFn: () => api.getResume(),
  })
}

export const useUpdateContact = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: ContactData) => api.updateContact(data),
    onSuccess: () => {
      // Standard React Query pattern - no optimistic updates
      queryClient.invalidateQueries({ queryKey: ['resume'] })
    },
  })
}
```

### Form Handling Pattern

**React Hook Form + Zod (Frontend Schema):**
```typescript
// lib/validations.ts - Frontend validation schemas
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
  linkedin: z.string().url().optional(),
})

// components/forms/ContactForm.tsx
const ContactForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', title: '', email: '', phone: '', github: '', website: '', linkedin: '' }
  })

  const updateContact = useUpdateContact()

  const onSubmit = (data: ContactData) => {
    updateContact.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input {...field} placeholder="Full Name" />
        )}
      />
      {errors.name && <span className="text-red-500">{errors.name.message}</span>}
    </form>
  )
}
```

### Component Patterns

**Scoped Resume Management Components:**
```typescript
// components/ScopedResumeSelector.tsx
const ScopedResumeSelector = () => {
  const [scopedResumes, setScopedResumes] = useState<ScopedResume[]>([])
  const [currentScope, setCurrentScope] = useState<number | null>(null) // null = main resume

  return (
    <div className="flex items-center gap-4">
      <Select value={currentScope?.toString() || 'main'} onValueChange={(val) => {
        setCurrentScope(val === 'main' ? null : parseInt(val))
      }}>
        <SelectItem value="main">Main Resume</SelectItem>
        {scopedResumes.map(resume => (
          <SelectItem key={resume.id} value={resume.id.toString()}>
            {resume.name}
          </SelectItem>
        ))}
      </Select>
      <Button onClick={() => createNewScopedResume()}>
        + New Scoped Resume
      </Button>
    </div>
  )
}

// components/ScopedSkillFilter.tsx
const ScopedSkillFilter = ({ scopedResumeId }: { scopedResumeId: number }) => {
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<number[]>([])

  return (
    <div className="space-y-2">
      <h3>Select Skills for this Resume</h3>
      {allSkills.map(skill => (
        <div key={skill.id} className="flex items-center space-x-2">
          <Checkbox 
            checked={selectedSkills.includes(skill.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedSkills([...selectedSkills, skill.id])
              } else {
                setSelectedSkills(selectedSkills.filter(id => id !== skill.id))
              }
            }}
          />
          <span>{skill.name} ({skill.category} - {skill.subcategory})</span>
        </div>
      ))}
    </div>
  )
}

// components/ScopedWorkExperienceLine.tsx
const ScopedWorkExperienceLine = ({ 
  lineId, 
  originalText, 
  scopedResumeId 
}: { 
  lineId: number, 
  originalText: string, 
  scopedResumeId: number | null 
}) => {
  const [scopedText, setScopedText] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const displayText = scopedText || originalText
  const isModified = scopedText !== null

  return (
    <div className="relative group">
      {!isEditing ? (
        <div className="flex items-start gap-2">
          <span className={isModified ? "text-blue-600" : ""}>{displayText}</span>
          {isModified && <Badge variant="outline">Modified</Badge>}
          {scopedResumeId && (
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              Edit for this scope
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Textarea 
            value={scopedText || originalText}
            onChange={(e) => setScopedText(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => saveScopedLine()}>Save</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            {isModified && (
              <Button size="sm" variant="destructive" onClick={() => revertToOriginal()}>
                Revert to Original
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

**Skills Management Components (Hybrid Dropdown Pattern):**
```typescript
// components/forms/SkillCategorySelect.tsx
const SkillCategorySelect = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  const [categories, setCategories] = useState<string[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)

  return (
    <div>
      {!isAddingNew ? (
        <Select value={value} onValueChange={(val) => {
          if (val === '__add_new__') {
            setIsAddingNew(true)
          } else {
            onChange(val)
          }
        }}>
          {categories.map(cat => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
          <SelectItem value="__add_new__">+ Add new category</SelectItem>
        </Select>
      ) : (
        <Input 
          placeholder="New category name"
          onBlur={(e) => {
            if (e.target.value) {
              onChange(e.target.value)
              // API call to create new category
            }
            setIsAddingNew(false)
          }}
        />
      )}
    </div>
  )
}
```

**Section-based Editing Components:**
```typescript
// components/sections/ResumeSection.tsx
interface ResumeSectionProps {
  sectionId: string
  title: string
  children: React.ReactNode
}

const ResumeSection = ({ sectionId, title, children }: ResumeSectionProps) => {
  const { editingSection, setEditingSection, isEditingSection } = useResumeStore()
  
  const isEditing = isEditingSection(sectionId)
  
  const handleEdit = () => {
    setEditingSection(isEditing ? null : sectionId)
  }
  
  return (
    <section className="mb-8 border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button 
          onClick={handleEdit}
          variant={isEditing ? "secondary" : "outline"}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      {children}
    </section>
  )
}
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
router.get('/api/resume', getResume)           // Get complete resume
router.put('/api/resume/contact', updateContact)
router.put('/api/resume/summary', updateSummary)
router.get('/api/resume/skills', getSkills)
router.post('/api/resume/skills', createSkill)
router.put('/api/resume/skills/:id', updateSkill)
router.delete('/api/resume/skills/:id', deleteSkill)
// Category/subcategory endpoints for hybrid dropdowns
router.get('/api/skill-categories', getSkillCategories)
router.post('/api/skill-categories', createSkillCategory)
router.get('/api/skill-subcategories', getSkillSubcategories)
router.post('/api/skill-subcategories', createSkillSubcategory)
// Scoped resume endpoints
router.get('/api/scoped-resumes', getScopedResumes)
router.post('/api/scoped-resumes', createScopedResume)
router.get('/api/scoped-resumes/:id', getScopedResume)
router.put('/api/scoped-resumes/:id', updateScopedResume)
router.delete('/api/scoped-resumes/:id', deleteScopedResume)
router.post('/api/scoped-resumes/:id/duplicate', duplicateScopedResume)
router.put('/api/scoped-resumes/:id/skills', updateScopedSkills)
router.put('/api/scoped-resumes/:id/work-experiences', updateScopedWorkExperiences)
router.put('/api/scoped-resumes/:id/summary', updateScopedSummary)
router.put('/api/scoped-resumes/:id/work-experience-lines/:lineId', updateScopedWorkExperienceLine)
router.post('/api/resume/export/pdf', exportPDF)  // supports ?scopedResumeId=X
router.post('/api/resume/export/docx', exportDOCX)  // supports ?scopedResumeId=X
```

**Controller Pattern (Backend Validation):**
```typescript
// controllers/resumeController.ts
// Backend schema - separate but compatible with frontend
const backendContactSchema = z.object({
  name: z.string().min(1),
  title: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
  linkedin: z.string().url().optional(),
})

export const updateContact = async (req: Request, res: Response) => {
  try {
    const contactData = backendContactSchema.parse(req.body)
    const result = await resumeService.updateContact(contactData)
    res.json({ data: result, error: null, message: 'Contact updated successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        data: null, 
        error: 'Validation failed', 
        details: error.errors  // Keep raw Zod error structure
      })
    } else {
      res.status(500).json({ 
        data: null, 
        error: 'Internal server error',
        message: error.message 
      })
    }
  }
}
```

**Service Layer Pattern (with Prisma Transactions):**
```typescript
// services/resumeService.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ResumeService {
  async updateContact(data: ContactData): Promise<Contact> {
    return await prisma.contacts.upsert({
      where: { id: 1 },  // Single user application
      create: {
        id: 1,
        ...data,
      },
      update: {
        ...data,
      }
    })
  }

  async updateWorkExperience(workExpId: number, data: WorkExperienceData, lines: WorkLineData[]) {
    // Use Prisma transaction for multi-table operations
    return await prisma.$transaction(async (tx) => {
      // Update work experience
      const workExp = await tx.workExperiences.update({
        where: { id: workExpId },
        data: data
      })

      // Delete existing lines and recreate
      await tx.workExperienceLines.deleteMany({
        where: { workExperienceId: workExpId }
      })

      await tx.workExperienceLines.createMany({
        data: lines.map((line, index) => ({
          workExperienceId: workExpId,
          lineText: line.text,
          lineId: index + 1,
        }))
      })

      // Return with lines included
      return await tx.workExperiences.findUnique({
        where: { id: workExpId },
        include: { lines: true }
      })
    })
  }

  // Scoped Resume Service Methods
  async createScopedResume(name: string) {
    return await prisma.scopedResumes.create({
      data: { name }
    })
  }

  async updateScopedWorkExperienceLine(scopedResumeId: number, workExpLineId: number, newText: string) {
    // Copy-on-write: create/update scoped version without affecting original
    return await prisma.scopedWorkExperienceLines.upsert({
      where: { 
        scopedResumeId_workExperienceLineId: { 
          scopedResumeId: scopedResumeId, 
          workExperienceLineId: workExpLineId 
        }
      },
      create: {
        scopedResumeId: scopedResumeId,
        workExperienceLineId: workExpLineId,
        lineText: newText,
      },
      update: {
        lineText: newText,
      }
    })
  }

  async getScopedResume(scopedResumeId: number) {
    // Complex query made simple with Prisma relations
    return await prisma.scopedResumes.findUnique({
      where: { id: scopedResumeId },
      include: {
        skills: {
          include: {
            technicalSkill: {
              include: {
                category: true,
                subcategory: true
              }
            }
          }
        },
        workExperiences: {
          include: {
            workExperience: {
              include: {
                lines: true
              }
            }
          }
        },
        professionalSummary: true,
        workExperienceLines: {
          include: {
            workExperienceLine: true
          }
        }
      }
    })
  }
}
```

### Database Pattern

**Prisma with SQLite and Seeding:**
```typescript
// models/database.ts
import Database from 'better-sqlite3'

class DatabaseManager {
  private db: Database.Database

  constructor(dbPath: string) {
    this.db = new Database(dbPath)
    this.db.pragma('journal_mode = WAL')
  }

  // Database utilities
  runMigrations() {
    // Run migration scripts
  }

  seedDatabase() {
    // Seed with realistic sample data
    this.seedSkillCategories()
    this.seedSampleResume()
  }

  selectiveReset() {
    // Preserve custom skill categories, refresh sample resume data
    this.db.prepare('DELETE FROM contacts WHERE id = 1').run()
    this.db.prepare('DELETE FROM professional_summaries WHERE id = 1').run()
    // Keep custom categories, reseed sample resume
    this.seedSampleResume()
  }

  private seedSkillCategories() {
    const categories = [
      'Back-end Development',
      'Front-end Development', 
      'Database Technologies',
      'Cloud & DevOps',
      'Project Management',
      'Methodologies'
    ]
    
    const subcategories = [
      'Language',
      'Framework',
      'Library',
      'Tool',
      'Platform',
      'Database',
      'Methodology',
      'Concept'
    ]
    
    // Insert categories and subcategories separately (no relationships)
    // Skills can use any pairing of category + subcategory
  }

  private seedSampleResume() {
    // Seed single comprehensive work experience with generic company
    // Example: "TechCorp Solutions" or "Digital Innovations Inc"
    // Include contact info, professional summary, education, and skills from all categories
  }

  getContact() {
    const stmt = this.db.prepare('SELECT * FROM contacts LIMIT 1')
    return stmt.get()
  }

  updateContact(data: ContactData) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO contacts 
      (id, name, title, email, phone, github, website, linkedin, updated_at)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `)
    return stmt.run(data.name, data.title, data.email, data.phone, data.github, data.website, data.linkedin)
  }
}
```

## Export Patterns (Separate Template System)

### Template System Structure (Single Template)
```
exports/
├── templates/
│   ├── pdf/
│   │   ├── resume.html        # Single fixed HTML template
│   │   └── styles.css         # Fixed PDF styles
│   └── docx/
│       └── resume-template.ts # Single fixed DOCX structure
├── generators/
│   ├── pdfGenerator.ts
│   └── docxGenerator.ts
└── templateEngine.ts          # Simple template rendering
```

### PDF Generation with Templates
```typescript
// exports/templateEngine.ts
export const renderTemplate = (templatePath: string, data: ResumeData): string => {
  const template = fs.readFileSync(templatePath, 'utf-8')
  // Use a template engine like Handlebars or simple string replacement
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || ''
  })
}

// exports/generators/pdfGenerator.ts
import puppeteer from 'puppeteer'
import { renderTemplate } from '../templateEngine'

export const generateResumePDF = async (resumeData: ResumeData): Promise<Buffer> => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  const html = renderTemplate('./templates/pdf/resume.html', resumeData)
  const css = fs.readFileSync('./templates/pdf/styles.css', 'utf-8')
  
  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.addStyleTag({ content: css })
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
  })
  
  await browser.close()
  return pdf
}
```

### DOCX Generation with Templates
```typescript
// exports/templates/docx/resume-template.ts
export const createResumeDocument = (resumeData: ResumeData) => {
  return new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.contact.name,
              bold: true,
              size: 32
            })
          ]
        }),
        // Template structure defined separately
      ]
    }]
  })
}

// exports/generators/docxGenerator.ts
import { Packer } from 'docx'
import { createResumeDocument } from '../templates/docx/resume-template'

export const generateResumeDOCX = async (resumeData: ResumeData): Promise<Buffer> => {
  const doc = createResumeDocument(resumeData)
  return await Packer.toBuffer(doc)
}
```

## Error Handling Patterns

### Frontend Error Boundaries
```typescript
// components/ErrorBoundary.tsx
export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundaryComponent
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div className="text-center p-8">
              <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
              <p className="mb-4">{error.message}</p>
              <Button onClick={resetErrorBoundary}>Try again</Button>
            </div>
          )}
        >
          {children}
        </ErrorBoundaryComponent>
      )}
    </QueryErrorResetBoundary>
  )
}
```

### Backend Error Middleware
```typescript
// middleware/errorHandler.ts
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error)

  if (error instanceof z.ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    })
  }

  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
}
```

## Testing Patterns

### Frontend Testing with Vitest
```typescript
// components/__tests__/ContactForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ContactForm } from '../ContactForm'

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

test('should validate required fields', async () => {
  renderWithProviders(<ContactForm />)
  
  const submitButton = screen.getByRole('button', { name: /save/i })
  fireEvent.click(submitButton)
  
  await waitFor(() => {
    expect(screen.getByText('Name is required')).toBeInTheDocument()
  })
})
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

## Implementation Notes

- **File uploads**: Pattern will be added later (not currently implemented)
- **Line reordering**: Drag-and-drop patterns will be implemented later
- **Migration strategy**: Simple file-based migrations for SQLite (utilities come before migrations)
- **Template engine**: Use Handlebars or simple string replacement for HTML templates (single fixed template)
- **Error handling**: Frontend validation errors mapped from backend response format (keep raw Zod structure)
- **Development setup**: Use ts-node-dev for TypeScript backend hot reloading
- **Docker environments**: Separate development (hot reload + volumes) and production configurations
- **Docker workflow**: Single `docker-compose up` command auto-starts frontend and backend
- **Database persistence**: Prisma with SQLite stored in Docker volume, persistent across container rebuilds
- **Data seeding**: Single comprehensive work experience with generic company, flexible skill categorization (any category + subcategory pairing)
- **Skill management**: Hybrid dropdown pattern (existing options + "Add new") prevents duplicates while allowing flexibility
- **Scoped resumes**: Copy-on-write editing system preserves original data while allowing targeted customization
- **Export flexibility**: Templates support both main and scoped resume rendering via query parameters
- **Task sequence**: Follow exact implementation sequence for optimal dependency management