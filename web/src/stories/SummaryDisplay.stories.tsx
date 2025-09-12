import type { Meta, StoryObj } from '@storybook/react';
import { SummaryContent } from '@/components/resume/SummarySection/SummaryContent';
import { mockProfessionalSummary } from '@/lib/mock-data';

const meta = {
  title: 'Resume/Sub-Components/SummaryDisplay',
  component: SummaryContent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Summary content display component showing professional summary text.',
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
} satisfies Meta<typeof SummaryContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default Summary',
  args: {
    summary: mockProfessionalSummary,
    isEditing: false,
    onEdit: () => console.log('Edit summary'),
  },
};

export const LongSummary: Story = {
  name: 'Long Summary',
  args: {
    summary: {
      ...mockProfessionalSummary,
      summaryText: "Experienced full-stack developer with 8+ years building scalable web applications. Specializes in React, Node.js, and cloud architecture with a proven track record of leading high-performing development teams and delivering complex projects on time. Expert in modern JavaScript/TypeScript ecosystems, cloud-native architectures using AWS and Docker, and agile development methodologies. Passionate about code quality, performance optimization, and mentoring junior developers. Successfully led the migration of legacy monolithic systems to microservices architecture, resulting in 40% improved system performance and 60% reduction in deployment times. Strong background in API design, database optimization, and DevOps practices including CI/CD pipeline automation.",
    },
    isEditing: false,
    onEdit: () => console.log('Edit summary'),
  },
};

export const ShortSummary: Story = {
  name: 'Short Summary',
  args: {
    summary: {
      ...mockProfessionalSummary,
      summaryText: "Full-stack developer with expertise in React and Node.js.",
    },
    isEditing: false,
    onEdit: () => console.log('Edit summary'),
  },
};

export const EmptySummary: Story = {
  name: 'Empty Summary',
  args: {
    summary: {
      ...mockProfessionalSummary,
      summaryText: "",
    },
    isEditing: false,
    onEdit: () => console.log('Edit summary'),
  },
};