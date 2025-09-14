import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScopedWorkExperienceSection } from '@/components/resume/ScopedWorkExperienceSection/ScopedWorkExperienceSection';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { within, userEvent, expect } from '@storybook/test';

// Mock data for stories
const mockWorkExperiences = [
  {
    id: 1,
    companyName: 'Tech Solutions Inc',
    companyTagline: 'Innovative Technology Solutions',
    companyCity: 'San Francisco',
    companyState: 'CA',
    jobTitle: 'Senior Software Engineer',
    dateStarted: new Date('2022-01-15'),
    dateEnded: null, // Current job
    createdAt: new Date(),
    updatedAt: new Date(),
    lines: [
      {
        id: 1,
        workExperienceId: 1,
        lineText: 'Led development of microservices architecture serving 1M+ users',
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        workExperienceId: 1,
        lineText: 'Implemented CI/CD pipelines reducing deployment time by 80%',
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        workExperienceId: 1,
        lineText: 'Mentored team of 3 junior developers on React best practices',
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: 2,
    companyName: 'StartupCorp',
    companyTagline: null,
    companyCity: 'Austin',
    companyState: 'TX',
    jobTitle: 'Full Stack Developer',
    dateStarted: new Date('2020-06-01'),
    dateEnded: new Date('2021-12-31'),
    createdAt: new Date(),
    updatedAt: new Date(),
    lines: [
      {
        id: 4,
        workExperienceId: 2,
        lineText: 'Built responsive web applications using React and Node.js',
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        workExperienceId: 2,
        lineText: 'Collaborated with design team to implement pixel-perfect UIs',
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
];

const mockScopedResume = {
  id: 123,
  name: 'Frontend Developer Role',
  createdAt: new Date(),
  updatedAt: new Date(),
  scopedProfessionalSummaries: [],
  scopedSkills: [],
  scopedWorkExperiences: [
    { id: 1, scopedResumeId: 123, workExperienceId: 1 }, // Tech Solutions Inc included
  ],
  scopedWorkExperienceLines: [
    {
      id: 1,
      scopedResumeId: 123,
      workExperienceLineId: 1,
      lineText: 'Led frontend development of microservices architecture serving 1M+ users',
    },
    {
      id: 2,
      scopedResumeId: 123,
      workExperienceLineId: 3,
      lineText: 'Mentored team of 3 junior frontend developers on React and TypeScript',
    },
  ],
};

// Mock hooks
const createMockHooks = (scenario: 'loading' | 'empty' | 'partial' | 'customized' | 'error') => {
  let mockWorkExpHook: any;
  let mockScopedResumeHook: any;
  let mockItemEditHook: any;

  const baseEditHook = {
    isAdding: false,
    editingItemId: null,
    editingItem: null,
    canEdit: true,
    isEditingAnything: false,
    startAdd: () => {},
    startEditItem: () => {},
    cancelEdit: () => {},
    completeAdd: () => {},
    completeEditItem: () => {},
    deleteItem: () => {},
  };

  const baseMutations = {
    mutateAsync: async () => {},
    isPending: false,
  };

  switch (scenario) {
    case 'loading':
      mockWorkExpHook = { data: [], isLoading: true, error: null };
      mockScopedResumeHook = { data: null, isLoading: true };
      mockItemEditHook = { ...baseEditHook, canEdit: false };
      break;

    case 'error':
      mockWorkExpHook = { data: [], isLoading: false, error: new Error('Failed to load') };
      mockScopedResumeHook = { data: null, isLoading: false };
      mockItemEditHook = { ...baseEditHook, canEdit: false };
      break;

    case 'empty':
      mockWorkExpHook = { data: mockWorkExperiences, isLoading: false, error: null };
      mockScopedResumeHook = {
        data: { ...mockScopedResume, scopedWorkExperiences: [], scopedWorkExperienceLines: [] },
        isLoading: false
      };
      mockItemEditHook = baseEditHook;
      break;

    case 'partial':
      mockWorkExpHook = { data: mockWorkExperiences, isLoading: false, error: null };
      mockScopedResumeHook = {
        data: { ...mockScopedResume, scopedWorkExperienceLines: [] },
        isLoading: false
      };
      mockItemEditHook = baseEditHook;
      break;

    case 'customized':
      mockWorkExpHook = { data: mockWorkExperiences, isLoading: false, error: null };
      mockScopedResumeHook = { data: mockScopedResume, isLoading: false };
      mockItemEditHook = baseEditHook;
      break;
  }

  return {
    mockWorkExpHook,
    mockScopedResumeHook,
    mockItemEditHook,
    mockMutations: {
      createExperienceMutation: baseMutations,
      updateExperienceMutation: baseMutations,
      deleteExperienceMutation: baseMutations,
    }
  };
};

// Story component wrapper
const ScopedWorkExperienceSectionWrapper = ({ scenario = 'partial' }: {
  scenario: 'loading' | 'empty' | 'partial' | 'customized' | 'error'
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const { mockWorkExpHook, mockScopedResumeHook, mockItemEditHook, mockMutations } = createMockHooks(scenario);

  // Mock the hooks
  React.useEffect(() => {
    jest.doMock('@/hooks', () => ({
      ...jest.requireActual('@/hooks'),
      useWorkExperiencesData: () => mockWorkExpHook,
      useScopedResumeData: () => mockScopedResumeHook,
      useCreateWorkExperience: () => mockMutations.createExperienceMutation,
      useUpdateWorkExperience: () => mockMutations.updateExperienceMutation,
      useDeleteWorkExperience: () => mockMutations.deleteExperienceMutation,
    }));

    jest.doMock('@/hooks/edit/useItemEdit', () => ({
      useItemEdit: () => mockItemEditHook,
    }));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-4xl mx-auto p-4">
        <ScopedWorkExperienceSection scopedResumeId={123} />
      </div>
    </QueryClientProvider>
  );
};

const meta: Meta<typeof ScopedWorkExperienceSectionWrapper> = {
  title: 'Resume/Scoped-Components/ScopedWorkExperienceSection',
  component: ScopedWorkExperienceSectionWrapper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Scoped work experience section with inclusion toggles and line-level customization. Allows selecting specific work experiences and customizing individual accomplishment lines for scoped resumes.',
      },
    },
  },
  argTypes: {
    scenario: {
      control: 'select',
      options: ['loading', 'empty', 'partial', 'customized', 'error'],
      description: 'Different states of the scoped work experience section',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ScopedWorkExperienceSectionWrapper>;

export const PartialInclusion: Story = {
  args: {
    scenario: 'partial',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows work experiences with some included and some excluded. Displays progress badge and inclusion toggles.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify progress badge
    await expect(canvas.getByText(/\d+ of \d+ included/)).toBeInTheDocument();

    // Verify work experience cards are present
    await expect(canvas.getByText('Senior Software Engineer at Tech Solutions Inc')).toBeInTheDocument();
    await expect(canvas.getByText('Full Stack Developer at StartupCorp')).toBeInTheDocument();

    // Check for inclusion checkboxes
    const checkboxes = canvas.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  },
};

export const NoExperiencesIncluded: Story = {
  args: {
    scenario: 'empty',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows all work experiences available but none included in the scoped resume.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Should show "0 of X included"
    await expect(canvas.getByText(/0 of \d+ included/)).toBeInTheDocument();

    // All experiences should be grayed out (not included)
    const workExpCards = canvasElement.querySelectorAll('.bg-muted');
    expect(workExpCards.length).toBeGreaterThan(0);
  },
};

export const CustomizedLines: Story = {
  args: {
    scenario: 'customized',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows work experiences with customized accomplishment lines. Lines show "Customized" badges and have edit/reset options.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify included work experience is highlighted
    const includedCard = canvasElement.querySelector('.bg-green-50');
    expect(includedCard).toBeInTheDocument();

    // Look for customized badges on lines
    await expect(canvas.getByText('Customized')).toBeInTheDocument();

    // Customized content should be shown
    await expect(canvas.getByText(/Led frontend development/)).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: {
    scenario: 'loading',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with skeleton animation while work experience data is being fetched.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify loading skeleton is present
    const loadingSkeleton = canvasElement.querySelector('.animate-pulse');
    expect(loadingSkeleton).toBeInTheDocument();
  },
};

export const Error: Story = {
  args: {
    scenario: 'error',
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state when work experience data fails to load, with retry option.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify error message and retry button
    await expect(canvas.getByText('Failed to load work experience')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  },
};

export const InclusionToggleInteraction: Story = {
  args: {
    scenario: 'partial',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story demonstrating work experience inclusion toggle behavior.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find work experience checkboxes
    const checkboxes = canvas.getAllByRole('checkbox');

    // Toggle inclusion for the first experience
    if (checkboxes.length > 0) {
      const firstCheckbox = checkboxes[0];
      const wasChecked = await firstCheckbox.isChecked();

      await userEvent.click(firstCheckbox);

      // In a real implementation, this would update the inclusion state
      // For the story, we can verify the checkbox state changed
    }
  },
};

export const LineEditingInteraction: Story = {
  args: {
    scenario: 'customized',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story demonstrating line-level editing capabilities for included work experiences.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Look for edit buttons on work experience lines
    const editButtons = canvas.getAllByRole('button', { name: /Edit|✏️/ });

    if (editButtons.length > 0) {
      // Click edit on the first editable line
      await userEvent.click(editButtons[0]);

      // Should show textarea for editing
      // In real implementation, would show textarea input
    }
  },
};

export const ResetLineToOriginal: Story = {
  args: {
    scenario: 'customized',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story demonstrating the reset to original functionality for customized lines.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Look for reset buttons on customized lines
    const resetButtons = canvas.getAllByRole('button', { name: 'Reset' });

    if (resetButtons.length > 0) {
      await userEvent.click(resetButtons[0]);

      // In a real implementation, this would reset the line to original content
    }
  },
};

export const AddWorkExperienceWorkflow: Story = {
  args: {
    scenario: 'partial',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story showing the "Add Work Experience" workflow integration.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click "Add Work Experience" button
    const addButton = canvas.getByRole('button', { name: 'Add Work Experience' });
    await userEvent.click(addButton);

    // In a real implementation, this would show the WorkExperienceEntryForm
    // For the story, we can verify the button is interactive
    await expect(addButton).toBeInTheDocument();
  },
};

export const ExperienceDetailsView: Story = {
  args: {
    scenario: 'partial',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows detailed view of included work experiences with all accomplishment lines and metadata.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify work experience details are shown
    await expect(canvas.getByText('San Francisco, CA')).toBeInTheDocument();
    await expect(canvas.getByText(/Present/)).toBeInTheDocument(); // Current job indicator

    // Verify accomplishment lines are shown with bullet points
    const accomplishmentLines = canvasElement.querySelectorAll('p.text-sm');
    expect(accomplishmentLines.length).toBeGreaterThan(0);
  },
};

export const ProgressBadgeStates: Story = {
  args: {
    scenario: 'partial',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the progress badge accurately reflecting inclusion counts across different states.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify progress badge shows correct format
    const progressBadge = canvas.getByText(/\d+ of \d+ included/);
    const badgeText = await progressBadge.textContent;

    // Should match pattern "X of Y included"
    expect(badgeText).toMatch(/^\d+ of \d+ included$/);

    // Extract numbers and verify they make sense
    const match = badgeText?.match(/^(\d+) of (\d+) included$/);
    if (match) {
      const included = parseInt(match[1]);
      const total = parseInt(match[2]);
      expect(included).toBeLessThanOrEqual(total);
      expect(total).toBeGreaterThan(0);
    }
  },
};