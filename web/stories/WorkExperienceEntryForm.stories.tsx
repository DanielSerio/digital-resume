import type { Meta, StoryObj } from '@storybook/react';
import { WorkExperienceEntryForm } from '@/components/resume/WorkExperienceSection/WorkExperienceEntryForm';
import { mockWorkExperience } from '@/lib/mock-data';
import { fn } from '@vitest/spy';

const meta = {
  title: 'Resume/Form-Components/WorkExperienceEntryForm',
  component: WorkExperienceEntryForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Work experience entry form component for adding or editing work experience entries.',
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
} satisfies Meta<typeof WorkExperienceEntryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock handlers
const mockHandlers = {
  onSave: fn(),
  onCancel: fn(),
  onDelete: fn(),
};

export const NewWorkExperience: Story = {
  name: 'New Work Experience Entry',
  args: {
    ...mockHandlers,
    isSubmitting: false,
  },
};

export const EditWorkExperience: Story = {
  name: 'Edit Work Experience Entry',
  args: {
    workExperience: mockWorkExperience[0],
    ...mockHandlers,
    isSubmitting: false,
  },
};

export const CurrentJob: Story = {
  name: 'Current Job (No End Date)',
  args: {
    workExperience: {
      ...mockWorkExperience[0],
      endDate: null,
      jobTitle: "Senior Software Architect",
      companyName: "InnovativeTech Solutions",
    },
    ...mockHandlers,
    isSubmitting: false,
  },
};

export const RemotePosition: Story = {
  name: 'Remote Position',
  args: {
    workExperience: {
      ...mockWorkExperience[0],
      companyName: "RemoteTech Inc",
      companyCity: "Remote",
      companyState: "",
      jobTitle: "Full-Stack Developer",
    },
    ...mockHandlers,
    isSubmitting: false,
  },
};

export const FreelanceWork: Story = {
  name: 'Freelance Work',
  args: {
    workExperience: {
      ...mockWorkExperience[0],
      companyName: "Freelance",
      companyCity: "Various",
      companyState: "",
      jobTitle: "Web Developer Consultant",
      startDate: new Date('2020-01-01'),
      endDate: new Date('2022-12-31'),
    },
    ...mockHandlers,
    isSubmitting: false,
  },
};

export const InternshipPosition: Story = {
  name: 'Internship Position',
  args: {
    workExperience: {
      ...mockWorkExperience[0],
      companyName: "Google",
      companyCity: "Mountain View",
      companyState: "CA",
      jobTitle: "Software Engineering Intern",
      startDate: new Date('2019-06-01'),
      endDate: new Date('2019-08-31'),
    },
    ...mockHandlers,
    isSubmitting: false,
  },
};

export const SubmittingState: Story = {
  name: 'Submitting Form',
  args: {
    workExperience: mockWorkExperience[0],
    ...mockHandlers,
    isSubmitting: true,
  },
};

export const WithDeleteOption: Story = {
  name: 'With Delete Button',
  args: {
    workExperience: mockWorkExperience[0],
    onSave: fn(),
    onCancel: fn(),
    onDelete: fn(),
    isSubmitting: false,
  },
};