import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScopedSummarySection } from '@/components/resume/ScopedSummarySection/ScopedSummarySection';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { within, userEvent, expect } from '@storybook/test';

// Mock data for stories
const mockMainSummary = {
  id: 1,
  summaryText: "Experienced full-stack developer with 5+ years building scalable web applications using React, Node.js, and cloud technologies. Strong background in agile methodologies and team leadership.",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockScopedSummary = {
  id: 1,
  summaryText: "Frontend-focused React developer with expertise in modern JavaScript frameworks and responsive design. Passionate about creating exceptional user experiences and performance optimization.",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockScopedResume = {
  id: 123,
  name: 'Frontend Developer Role',
  createdAt: new Date(),
  updatedAt: new Date(),
  scopedProfessionalSummaries: [mockScopedSummary],
  scopedSkills: [],
  scopedWorkExperiences: [],
  scopedWorkExperienceLines: [],
};

// Mock hooks
const createMockHooks = (scenario: 'loading' | 'original' | 'customized' | 'error') => {
  let mockMainSummaryHook: any;
  let mockScopedResumeHook: any;
  let mockEditState: any;

  switch (scenario) {
    case 'loading':
      mockMainSummaryHook = {
        data: null,
        isLoading: true,
        error: null,
      };
      mockScopedResumeHook = {
        data: null,
        isLoading: true,
      };
      mockEditState = {
        isEditing: false,
        canEdit: false,
        startEdit: () => false,
        cancelEdit: () => {},
        completeEdit: () => {},
      };
      break;

    case 'error':
      mockMainSummaryHook = {
        data: null,
        isLoading: false,
        error: new Error('Failed to load'),
      };
      mockScopedResumeHook = {
        data: null,
        isLoading: false,
      };
      mockEditState = {
        isEditing: false,
        canEdit: false,
        startEdit: () => false,
        cancelEdit: () => {},
        completeEdit: () => {},
      };
      break;

    case 'original':
      mockMainSummaryHook = {
        data: mockMainSummary,
        isLoading: false,
        error: null,
      };
      mockScopedResumeHook = {
        data: { ...mockScopedResume, scopedProfessionalSummaries: [] },
        isLoading: false,
      };
      mockEditState = {
        isEditing: false,
        canEdit: true,
        startEdit: () => true,
        cancelEdit: () => {},
        completeEdit: () => {},
      };
      break;

    case 'customized':
      mockMainSummaryHook = {
        data: mockMainSummary,
        isLoading: false,
        error: null,
      };
      mockScopedResumeHook = {
        data: mockScopedResume,
        isLoading: false,
      };
      mockEditState = {
        isEditing: false,
        canEdit: true,
        startEdit: () => true,
        cancelEdit: () => {},
        completeEdit: () => {},
      };
      break;
  }

  return { mockMainSummaryHook, mockScopedResumeHook, mockEditState };
};

// Story component wrapper
const ScopedSummarySectionWrapper = ({ scenario = 'original' }: { scenario: 'loading' | 'original' | 'customized' | 'error' }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const { mockMainSummaryHook, mockScopedResumeHook, mockEditState } = createMockHooks(scenario);

  // Mock the hooks
  React.useEffect(() => {
    // Mock useProfessionalSummaryData
    jest.doMock('@/hooks', () => ({
      ...jest.requireActual('@/hooks'),
      useProfessionalSummaryData: () => mockMainSummaryHook,
      useScopedResumeData: () => mockScopedResumeHook,
    }));

    // Mock useEditState
    jest.doMock('@/hooks/edit/useEditState', () => ({
      useEditState: () => mockEditState,
    }));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-4xl mx-auto p-4">
        <ScopedSummarySection scopedResumeId={123} />
      </div>
    </QueryClientProvider>
  );
};

const meta: Meta<typeof ScopedSummarySectionWrapper> = {
  title: 'Resume/Scoped-Components/ScopedSummarySection',
  component: ScopedSummarySectionWrapper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Scoped professional summary section with copy-on-write editing capabilities. Shows original content by default, allows customization for specific scoped resumes.',
      },
    },
  },
  argTypes: {
    scenario: {
      control: 'select',
      options: ['loading', 'original', 'customized', 'error'],
      description: 'Different states of the scoped summary section',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ScopedSummarySectionWrapper>;

export const Original: Story = {
  args: {
    scenario: 'original',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the original professional summary without any scoped customizations. The "Edit" button allows creating a scoped version.',
      },
    },
  },
};

export const Customized: Story = {
  args: {
    scenario: 'customized',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a customized professional summary for this scoped resume. Displays "Customized" badge and "Reset to Original" button.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify customized indicators are present
    await expect(canvas.getByText('Customized')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Reset to Original' })).toBeInTheDocument();

    // Should show the customized content
    await expect(canvas.getByText(/Frontend-focused React developer/)).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: {
    scenario: 'loading',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with skeleton animation while data is being fetched.',
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
        story: 'Error state when data fails to load, with retry option.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify error message and retry button
    await expect(canvas.getByText('Failed to load professional summary')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  },
};

export const EditingInteraction: Story = {
  args: {
    scenario: 'original',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story demonstrating the edit workflow for creating a scoped summary customization.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click edit button
    const editButton = canvas.getByRole('button', { name: 'Edit' });
    await userEvent.click(editButton);

    // Should show editing interface
    const textarea = canvas.getByRole('textbox');
    await expect(textarea).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();

    // Type some custom content
    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'This is a customized summary for testing interactions.');

    // Verify the content was typed
    await expect(textarea).toHaveValue('This is a customized summary for testing interactions.');
  },
};

export const ResetToOriginal: Story = {
  args: {
    scenario: 'customized',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story demonstrating the reset to original functionality.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify we start with customized state
    await expect(canvas.getByText('Customized')).toBeInTheDocument();

    // Click reset button
    const resetButton = canvas.getByRole('button', { name: 'Reset to Original' });
    await userEvent.click(resetButton);

    // Note: In a real implementation, this would trigger the API call and update the UI
    // For the story, we can at least verify the button click is handled
  },
};

export const ExpandOriginalContent: Story = {
  args: {
    scenario: 'customized',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the expandable details that let users view the original content when a summary is customized.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click the details summary to expand original content
    const detailsSummary = canvasElement.querySelector('summary');
    if (detailsSummary) {
      await userEvent.click(detailsSummary);

      // Should show original content
      await expect(canvas.getByText(/Experienced full-stack developer/)).toBeInTheDocument();
    }
  },
};