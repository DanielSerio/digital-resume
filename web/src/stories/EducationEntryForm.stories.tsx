import type { Meta, StoryObj } from '@storybook/react';
import { EducationEntryForm } from '@/components/resume/EducationSection/EducationEntryForm';
import { mockEducation } from '@/lib/mock-data';
import { fn } from '@vitest/spy';

const meta = {
  title: 'Resume/Form-Components/EducationEntryForm',
  component: EducationEntryForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Education entry form component for adding or editing education entries.',
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
} satisfies Meta<typeof EducationEntryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock handlers
const mockHandlers = {
  onSave: fn(),
  onCancel: fn(),
  onDelete: fn(),
};

export const NewEducation: Story = {
  name: 'New Education Entry',
  args: {
    ...mockHandlers,
    isSubmitting: false,
  },
};

export const EditEducation: Story = {
  name: 'Edit Education Entry',
  args: {
    education: mockEducation[0],
    ...mockHandlers,
    isSubmitting: false,
  },
};

export const CurrentEducation: Story = {
  name: 'Current Education (No End Date)',
  args: {
    education: {
      ...mockEducation[0],
      dateFinished: null,
      degreeType: "PhD",
      degreeTitle: "Machine Learning",
    },
    ...mockHandlers,
    isSubmitting: false,
  },
};

export const GraduateEducation: Story = {
  name: 'Graduate Education',
  args: {
    education: {
      ...mockEducation[0],
      schoolName: "MIT",
      schoolCity: "Cambridge",
      schoolState: "MA",
      degreeType: "Master of Science",
      degreeTitle: "Artificial Intelligence",
      dateStarted: new Date('2018-09-01'),
      dateFinished: new Date('2020-06-15'),
    },
    ...mockHandlers,
    isSubmitting: false,
  },
};

export const OnlineEducation: Story = {
  name: 'Online Education/Certificate',
  args: {
    education: {
      id: 1,
      schoolName: "Coursera - Stanford University",
      schoolCity: "Online",
      schoolState: "CA",
      degreeType: "Certificate",
      degreeTitle: "Machine Learning",
      dateStarted: new Date('2023-01-15'),
      dateFinished: new Date('2023-04-20'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    ...mockHandlers,
    isSubmitting: false,
  },
};

export const SubmittingState: Story = {
  name: 'Submitting Form',
  args: {
    education: mockEducation[0],
    ...mockHandlers,
    isSubmitting: true,
  },
};

export const WithDeleteOption: Story = {
  name: 'With Delete Button',
  args: {
    education: mockEducation[0],
    onSave: fn(),
    onCancel: fn(),
    onDelete: fn(),
    isSubmitting: false,
  },
};