import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SummaryForm } from '@/components/resume/SummarySection/SummaryForm';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { professionalSummarySchema, type ProfessionalSummaryFormData } from '@/lib/validation';

// Form wrapper component to provide form context
const SummaryFormWrapper = (args: { isEditing: boolean; initialText?: string }) => {
  const form = useForm<ProfessionalSummaryFormData>({
    resolver: standardSchemaResolver(professionalSummarySchema),
    defaultValues: { summaryText: args.initialText || '' },
  });
  return <SummaryForm isEditing={args.isEditing} form={form} />;
};

const meta = {
  title: 'Resume/Form-Components/SummaryForm',
  component: SummaryFormWrapper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Summary form component for editing professional summary content.',
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
  argTypes: {
    isEditing: {
      control: { type: 'boolean' },
    },
    initialText: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof SummaryFormWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default Form',
  render: SummaryFormWrapper,
  args: {
    isEditing: true,
    initialText: '',
  },
};

export const WithContent: Story = {
  name: 'Pre-filled Form',
  render: SummaryFormWrapper,
  args: {
    isEditing: true,
    initialText: "Experienced full-stack developer with 8+ years building scalable web applications. Specializes in React, Node.js, and cloud architecture with a proven track record of leading high-performing development teams and delivering complex projects on time.",
  },
};

export const WithError: Story = {
  name: 'Form with Validation Error',
  render: (args: any) => {
    const form = useForm<ProfessionalSummaryFormData>({
      resolver: standardSchemaResolver(professionalSummarySchema),
      defaultValues: { summaryText: '' },
    });
    
    // Trigger validation error
    React.useEffect(() => {
      form.trigger();
    }, [form]);

    return <SummaryForm {...args} form={form} />;
  },
  args: {
    isEditing: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form showing validation error when summary text is missing.',
      },
    },
  },
};

export const LongContent: Story = {
  name: 'Near Character Limit',
  render: SummaryFormWrapper,
  args: {
    isEditing: true,
    initialText: "Experienced full-stack developer with 8+ years building scalable web applications. Specializes in React, Node.js, and cloud architecture with a proven track record of leading high-performing development teams and delivering complex projects on time. Expert in modern JavaScript/TypeScript ecosystems, cloud-native architectures using AWS and Docker, and agile development methodologies. Passionate about code quality, performance optimization, and mentoring junior developers. Successfully led the migration of legacy monolithic systems to microservices architecture, resulting in 40% improved system performance and 60% reduction in deployment times. Strong background in API design, database optimization, and DevOps practices including CI/CD pipeline automation. Experienced with multiple programming languages including JavaScript, TypeScript, Python, and Go. Proficient in various databases including PostgreSQL, MongoDB, and Redis. Familiar with containerization technologies like Docker and Kubernetes for scalable deployments.",
  },
};

export const NotEditing: Story = {
  name: 'Not Editing Mode',
  render: SummaryFormWrapper,
  args: {
    isEditing: false,
    initialText: "This should not be visible when not editing",
  },
};