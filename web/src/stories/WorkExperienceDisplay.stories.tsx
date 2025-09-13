import type { Meta, StoryObj } from '@storybook/react';
import { WorkExperienceDisplay } from '@/components/resume/WorkExperienceSection/WorkExperienceDisplay';
import { mockWorkExperience } from '@/lib/mock-data';
import type { WorkExperience, WorkExperienceLine } from '@/types';

const meta = {
  title: 'Resume/Sub-Components/WorkExperienceDisplay',
  component: WorkExperienceDisplay,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Work experience display component showing work history entries with accomplishment lines.',
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
} satisfies Meta<typeof WorkExperienceDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default Work Experience',
  args: {
    workExperiences: mockWorkExperience,
    isEditing: false,
    onEditWorkExperience: () => console.log('Edit work experience'),
  },
};

export const SingleJob: Story = {
  name: 'Single Job',
  args: {
    workExperiences: [mockWorkExperience[0]],
    isEditing: false,
    onEditWorkExperience: () => console.log('Edit work experience'),
  },
};

export const CurrentJob: Story = {
  name: 'Current Job',
  args: {
    workExperiences: [{
      ...mockWorkExperience[0],
      dateEnded: null, // Still working
    }] as WorkExperience[],
    isEditing: false,
    onEditWorkExperience: () => console.log('Edit work experience'),
  },
};

export const RemoteJob: Story = {
  name: 'Remote Job',
  args: {
    workExperiences: [{
      ...mockWorkExperience[0],
      companyName: "GlobalTech Remote",
      companyCity: "Remote",
      companyState: "",
      jobTitle: "Senior Remote Developer",
    }] as WorkExperience[],
    isEditing: false,
    onEditWorkExperience: () => console.log('Edit work experience'),
  },
};

export const ManyJobs: Story = {
  name: 'Many Jobs',
  args: {
    workExperiences: [
      ...mockWorkExperience,
      {
        id: 3,
        companyName: "InnovateCorp",
        jobTitle: "Junior Developer",
        companyCity: "Austin",
        companyState: "TX",
        dateStarted: new Date('2014-06-01'),
        dateEnded: new Date('2016-05-31'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        lines: [
          {
            id: 7,
            workExperienceId: 3,
            lineText: "Developed responsive web applications using HTML, CSS, and JavaScript",
            lineId: 1,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
          {
            id: 8,
            workExperienceId: 3,
            lineText: "Collaborated with designers to implement pixel-perfect UI components",
            lineId: 2,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        ] as WorkExperienceLine[],
      },
      {
        id: 4,
        companyName: "Freelance",
        jobTitle: "Web Developer",
        companyCity: "Various",
        companyState: "",
        dateStarted: new Date('2012-01-01'),
        dateEnded: new Date('2014-05-31'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        lines: [
          {
            id: 9,
            workExperienceId: 4,
            lineText: "Built custom WordPress themes and plugins for small businesses",
            lineId: 1,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        ] as WorkExperienceLine[],
      },
    ] as WorkExperience[],
    isEditing: false,
    onEditWorkExperience: () => console.log('Edit work experience'),
  },
};

export const JobWithManyLines: Story = {
  name: 'Job with Many Accomplishments',
  args: {
    workExperiences: [{
      ...mockWorkExperience[0],
      lines: [
        ...mockWorkExperience[0].lines,
        {
          id: 10,
          workExperienceId: 1,
          lineText: "Established comprehensive testing strategy reducing production bugs by 70%",
          lineId: 5,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 11,
          workExperienceId: 1,
          lineText: "Optimized database queries improving application response time by 50%",
          lineId: 6,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 12,
          workExperienceId: 1,
          lineText: "Led cross-functional team of 8 developers across multiple time zones",
          lineId: 7,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ] as WorkExperienceLine[],
    }] as WorkExperience[],
    isEditing: false,
    onEditWorkExperience: () => console.log('Edit work experience'),
  },
};

export const EmptyWorkExperience: Story = {
  name: 'No Work Experience',
  args: {
    workExperiences: [],
    isEditing: false,
    onEditWorkExperience: () => console.log('Edit work experience'),
  },
};