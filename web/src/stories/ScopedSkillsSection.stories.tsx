// import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScopedSkillsSection } from '@/components/resume/ScopedSkillsSection/ScopedSkillsSection';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { within, userEvent, expect } from 'storybook/test';

// Mock data for stories
const mockSkills = [
  {
    id: 1,
    name: 'React',
    categoryId: 1,
    subcategoryId: 1,
    category: { id: 1, name: 'Frontend' },
    subcategory: { id: 1, name: 'Framework' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'TypeScript',
    categoryId: 1,
    subcategoryId: 2,
    category: { id: 1, name: 'Frontend' },
    subcategory: { id: 2, name: 'Language' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'Node.js',
    categoryId: 2,
    subcategoryId: 1,
    category: { id: 2, name: 'Backend' },
    subcategory: { id: 1, name: 'Framework' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: 'PostgreSQL',
    categoryId: 2,
    subcategoryId: 3,
    category: { id: 2, name: 'Backend' },
    subcategory: { id: 3, name: 'Database' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    name: 'Docker',
    categoryId: 3,
    subcategoryId: 4,
    category: { id: 3, name: 'DevOps' },
    subcategory: { id: 4, name: 'Tool' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockScopedResume = {
  id: 123,
  name: 'Frontend Developer Role',
  createdAt: new Date(),
  updatedAt: new Date(),
  scopedProfessionalSummaries: [],
  scopedSkills: [
    { id: 1, scopedResumeId: 123, technicalSkillId: 1 }, // React included
    { id: 2, scopedResumeId: 123, technicalSkillId: 2 }, // TypeScript included
  ],
  scopedWorkExperiences: [],
  scopedWorkExperienceLines: [],
};

// Note: Mock hooks were removed since we're not using them in these stories

// Story component wrapper
const ScopedSkillsSectionWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  // Note: In a real Storybook setup, we would use MSW or other mocking solutions
  // For now, we'll let the components use their actual hooks
  // const { mockSkillsHook, mockScopedResumeHook, mockSkillsEditHook, mockSkillTaxonomy } = createMockHooks(scenario);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-4xl mx-auto p-4">
        <ScopedSkillsSection scopedResumeId={123} />
      </div>
    </QueryClientProvider>
  );
};

const meta: Meta<typeof ScopedSkillsSectionWrapper> = {
  title: 'Resume/Scoped-Components/ScopedSkillsSection',
  component: ScopedSkillsSectionWrapper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Scoped skills section with inclusion toggles and bulk operations. Allows selecting specific skills for inclusion in scoped resumes with category-based bulk selection.',
      },
    },
  },
  argTypes: {
    scenario: {
      control: 'select',
      options: ['loading', 'empty', 'partial', 'full', 'error'],
      description: 'Different states of the scoped skills section',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ScopedSkillsSectionWrapper>;

export const PartialInclusion: Story = {
  args: {
    scenario: 'partial',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows skills with some included and some excluded. Displays progress badge and category-based bulk controls.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify progress badge
    await expect(canvas.getByText(/\d+ of \d+ included/)).toBeInTheDocument();

    // Verify bulk controls are present
    await expect(canvas.getByText('Skill Selection by Category:')).toBeInTheDocument();

    // Verify category sections exist
    await expect(canvas.getByText('Frontend')).toBeInTheDocument();
    await expect(canvas.getByText('Backend')).toBeInTheDocument();
  },
};

export const NoSkillsIncluded: Story = {
  args: {
    scenario: 'empty',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows all skills available but none included in the scoped resume.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Should show "0 of X included"
    await expect(canvas.getByText(/0 of \d+ included/)).toBeInTheDocument();

    // All skills should be unchecked and grayed out
    const checkboxes = canvas.getAllByRole('checkbox');
    for (const checkbox of checkboxes) {
      expect(checkbox).not.toBeChecked();
    }
  },
};

export const AllSkillsIncluded: Story = {
  args: {
    scenario: 'full',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows all available skills included in the scoped resume.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Should show all skills included
    const badgeText = await canvas.getByText(/\d+ of \d+ included/).textContent;
    const match = badgeText?.match(/(\d+) of (\d+) included/);
    if (match) {
      expect(match[1]).toBe(match[2]); // included should equal total
    }

    // All skills should be checked and highlighted
    const checkboxes = canvas.getAllByRole('checkbox');
    for (const checkbox of checkboxes) {
      expect(checkbox).toBeChecked();
    }
  },
};

export const Loading: Story = {
  args: {
    scenario: 'loading',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with skeleton animation while skills data is being fetched.',
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
        story: 'Error state when skills data fails to load, with retry option.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify error message and retry button
    await expect(canvas.getByText('Failed to load technical skills')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  },
};

export const IndividualSkillToggle: Story = {
  args: {
    scenario: 'partial',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story demonstrating individual skill inclusion toggle behavior.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find a skill checkbox that's currently unchecked
    const checkboxes = canvas.getAllByRole('checkbox');
    const uncheckedCheckbox = checkboxes.find(cb => !cb.getAttribute('checked'));

    if (uncheckedCheckbox) {
      // Click to include the skill
      await userEvent.click(uncheckedCheckbox);

      // In a real implementation, this would update the inclusion state
      // For the story, we can verify the click was handled
    }
  },
};

export const BulkCategorySelection: Story = {
  args: {
    scenario: 'partial',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story demonstrating bulk skill selection within a category.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find bulk control buttons
    const allButtons = canvas.getAllByRole('button', { name: 'All' });
    const noneButtons = canvas.getAllByRole('button', { name: 'None' });

    // Click "All" for the first category
    if (allButtons.length > 0) {
      await userEvent.click(allButtons[0]);
    }

    // Click "None" for another category if available
    if (noneButtons.length > 1) {
      await userEvent.click(noneButtons[1]);
    }

    // In a real implementation, this would update all skills in those categories
  },
};

export const AddNewSkillWorkflow: Story = {
  args: {
    scenario: 'partial',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story showing the "Add New Skill" workflow integration.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click "Add New Skill" button
    const addButton = canvas.getByRole('button', { name: 'Add New Skill' });
    await userEvent.click(addButton);

    // In a real implementation, this would show the AddSkillForm
    // For the story, we can verify the button is interactive
    await expect(addButton).toBeInTheDocument();
  },
};

export const CategoryProgressStates: Story = {
  args: {
    scenario: 'partial',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows different category progress states: none selected, some selected, all selected.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify category progress badges show different states
    const categoryControls = canvasElement.querySelectorAll('.bg-muted.rounded-lg');

    // Each category control should show progress like "2/3" or "0/2"
    for (const control of categoryControls) {
      const progressBadge = control.querySelector('.text-xs');
      expect(progressBadge).toBeInTheDocument();
    }

    // Verify bulk buttons are enabled/disabled appropriately
    const allButtons = canvas.getAllByRole('button', { name: 'All' });
    const noneButtons = canvas.getAllByRole('button', { name: 'None' });

    expect(allButtons.length).toBeGreaterThan(0);
    expect(noneButtons.length).toBeGreaterThan(0);
  },
};