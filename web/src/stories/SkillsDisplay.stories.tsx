import type { Meta, StoryObj } from '@storybook/react';
import { SkillsDisplay } from '@/components/resume/SkillsSection/SkillsDisplay';
import { mockTechnicalSkills, mockSkillCategories, mockSkillSubcategories } from '@/lib/mock-data';
import type { TechnicalSkill } from '@/types';

const meta = {
  title: 'Resume/Sub-Components/SkillsDisplay',
  component: SkillsDisplay,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Skills display component showing technical skills grouped by category.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SkillsDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default Skills',
  args: {
    skills: mockTechnicalSkills,
    getCategoryName: (id: number) => mockSkillCategories.find(cat => cat.id === id)?.name || 'Unknown',
    isEditing: false,
    onDeleteSkill: async () => console.log('Delete skill'),
  },
};

export const MinimalSkills: Story = {
  name: 'Few Skills',
  args: {
    skills: mockTechnicalSkills.slice(0, 3),
    getCategoryName: (id: number) => mockSkillCategories.find(cat => cat.id === id)?.name || 'Unknown',
    isEditing: false,
    onDeleteSkill: async () => console.log('Delete skill'),
  },
};

export const ManySkills: Story = {
  name: 'Many Skills',
  args: {
    skills: [
      ...mockTechnicalSkills,
      {
        id: 9,
        name: "Angular",
        categoryId: 1,
        subcategoryId: 1,
        category: mockSkillCategories[0],
        subcategory: mockSkillSubcategories[0],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 10,
        name: "Vue.js",
        categoryId: 1,
        subcategoryId: 1,
        category: mockSkillCategories[0],
        subcategory: mockSkillSubcategories[0],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 11,
        name: "Express.js",
        categoryId: 2,
        subcategoryId: 1,
        category: mockSkillCategories[1],
        subcategory: mockSkillSubcategories[0],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 12,
        name: "MongoDB",
        categoryId: 3,
        subcategoryId: 3,
        category: mockSkillCategories[2],
        subcategory: mockSkillSubcategories[2],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 13,
        name: "Redis",
        categoryId: 3,
        subcategoryId: 3,
        category: mockSkillCategories[2],
        subcategory: mockSkillSubcategories[2],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ] as TechnicalSkill[],
    getCategoryName: (id: number) => mockSkillCategories.find(cat => cat.id === id)?.name || 'Unknown',
    isEditing: false,
    onDeleteSkill: async () => console.log('Delete skill'),
  },
};

export const SingleCategory: Story = {
  name: 'Single Category',
  args: {
    skills: mockTechnicalSkills.filter(skill => skill.categoryId === 1),
    getCategoryName: (id: number) => mockSkillCategories.find(cat => cat.id === id)?.name || 'Unknown',
    isEditing: false,
    onDeleteSkill: async () => console.log('Delete skill'),
  },
};

export const EmptySkills: Story = {
  name: 'No Skills',
  args: {
    skills: [],
    getCategoryName: (id: number) => mockSkillCategories.find(cat => cat.id === id)?.name || 'Unknown',
    isEditing: false,
    onDeleteSkill: async () => console.log('Delete skill'),
  },
};