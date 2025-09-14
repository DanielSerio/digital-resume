import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model for the scoped resume management and editing page
 * Supports both management interface and editing interface based on URL params
 */
export class ScopedResumePage {
  readonly page: Page;

  // Header and Navigation
  readonly headerTitle: Locator;
  readonly mainResumeTab: Locator;
  readonly scopedResumesTab: Locator;

  // Scoped Resume Selector
  readonly resumeSelectorLabel: Locator;
  readonly resumeSelector: Locator;
  readonly resumeSelectorTrigger: Locator;
  readonly currentSelectionInfo: Locator;

  // Management Interface Elements
  readonly createResumeButton: Locator;
  readonly managementSection: Locator;

  // Scoped Resume Cards (in management view)
  readonly resumeCards: Locator;

  // Editing Interface - Contact Section (read-only)
  readonly contactSection: Locator;

  // Editing Interface - Scoped Summary Section
  readonly scopedSummarySection: Locator;
  readonly scopedSummaryEditButton: Locator;
  readonly scopedSummaryCustomizedBadge: Locator;
  readonly scopedSummaryResetButton: Locator;
  readonly scopedSummaryTextarea: Locator;
  readonly scopedSummarySaveButton: Locator;
  readonly scopedSummaryCancelButton: Locator;

  // Editing Interface - Scoped Skills Section
  readonly scopedSkillsSection: Locator;
  readonly skillsIncludedBadge: Locator;
  readonly skillCategoryControls: Locator;
  readonly skillCheckboxes: Locator;
  readonly bulkSkillButtons: Locator;

  // Editing Interface - Scoped Work Experience Section
  readonly scopedWorkExperienceSection: Locator;
  readonly workExperienceIncludedBadge: Locator;
  readonly workExperienceCheckboxes: Locator;
  readonly workExperienceLineEditors: Locator;

  // Editing Interface - Education Section (read-only)
  readonly educationSection: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header and Navigation
    this.headerTitle = page.getByText('Digital Resume Manager');
    this.mainResumeTab = page.getByRole('link', { name: 'Main Resume' });
    this.scopedResumesTab = page.getByRole('link', { name: 'Scoped Resumes' });

    // Scoped Resume Selector
    this.resumeSelectorLabel = page.getByText('Select Scoped Resume:');
    this.resumeSelector = page.getByRole('combobox');
    this.resumeSelectorTrigger = page.getByRole('button', { name: /Select a scoped resume|[A-Za-z\s]+/ });
    this.currentSelectionInfo = page.locator('.bg-blue-50');

    // Management Interface
    this.createResumeButton = page.getByRole('button', { name: 'Create New Resume' });
    this.managementSection = page.getByText('Manage Scoped Resumes').locator('..');

    // Scoped Resume Cards
    this.resumeCards = page.locator('[data-testid*="resume-card"], .border.rounded, .transition-shadow');

    // Contact Section (read-only in scoped view)
    this.contactSection = page.getByTestId('ContactCard');

    // Scoped Summary Section
    this.scopedSummarySection = page.getByTestId('ScopedSummaryCard');
    this.scopedSummaryEditButton = this.scopedSummarySection.getByRole('button', { name: 'Edit' });
    this.scopedSummaryCustomizedBadge = this.scopedSummarySection.getByText('Customized');
    this.scopedSummaryResetButton = this.scopedSummarySection.getByRole('button', { name: 'Reset to Original' });
    this.scopedSummaryTextarea = this.scopedSummarySection.getByRole('textbox');
    this.scopedSummarySaveButton = this.scopedSummarySection.getByRole('button', { name: 'Save' });
    this.scopedSummaryCancelButton = this.scopedSummarySection.getByRole('button', { name: 'Cancel' });

    // Scoped Skills Section
    this.scopedSkillsSection = page.getByTestId('ScopedSkillsCard');
    this.skillsIncludedBadge = this.scopedSkillsSection.locator('text=/\\d+ of \\d+ included/');
    this.skillCategoryControls = this.scopedSkillsSection.locator('.bg-muted.rounded-lg');
    this.skillCheckboxes = this.scopedSkillsSection.getByRole('checkbox');
    this.bulkSkillButtons = this.scopedSkillsSection.getByRole('button', { name: /All|None/ });

    // Scoped Work Experience Section
    this.scopedWorkExperienceSection = page.getByTestId('ScopedWorkExperienceCard');
    this.workExperienceIncludedBadge = this.scopedWorkExperienceSection.locator('text=/\\d+ of \\d+ included/');
    this.workExperienceCheckboxes = this.scopedWorkExperienceSection.getByRole('checkbox');
    this.workExperienceLineEditors = this.scopedWorkExperienceSection.getByRole('textbox', { name: /line|content/i });

    // Education Section (read-only in scoped view)
    this.educationSection = page.getByTestId('EducationCard');
  }

  /**
   * Navigate to the scoped resume page
   */
  async goto() {
    await this.page.goto('/scoped');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad() {
    await this.headerTitle.waitFor();
    await this.resumeSelectorLabel.waitFor();
  }

  /**
   * Create a new scoped resume
   */
  async createNewScopedResume(name: string) {
    await this.createResumeButton.click();

    // Wait for dialog to appear
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor();

    // Fill in the name
    const nameInput = dialog.getByRole('textbox', { name: /resume name/i });
    await nameInput.fill(name);

    // Submit
    const createButton = dialog.getByRole('button', { name: 'Create' });
    await createButton.click();

    // Wait for dialog to close
    await dialog.waitFor({ state: 'hidden' });
  }

  /**
   * Select a scoped resume from the dropdown
   */
  async selectScopedResume(resumeName: string) {
    await this.resumeSelectorTrigger.click();

    // Wait for dropdown to appear
    const dropdown = this.page.getByRole('listbox');
    await dropdown.waitFor();

    // Select the resume
    const option = dropdown.getByRole('option', { name: resumeName });
    await option.click();

    // Wait for selection to complete
    await this.currentSelectionInfo.waitFor();
  }

  /**
   * Check if we're in editing mode (resume selected)
   */
  async isInEditingMode(): Promise<boolean> {
    try {
      await this.currentSelectionInfo.waitFor({ timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if we're in management mode (no resume selected)
   */
  async isInManagementMode(): Promise<boolean> {
    try {
      await this.managementSection.waitFor({ timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Toggle a skill's inclusion in the scoped resume
   */
  async toggleSkillInclusion(skillName: string) {
    const skillRow = this.scopedSkillsSection.locator(`text=${skillName}`).locator('..');
    const checkbox = skillRow.getByRole('checkbox');
    await checkbox.click();
  }

  /**
   * Toggle a work experience's inclusion in the scoped resume
   */
  async toggleWorkExperienceInclusion(jobTitle: string, companyName: string) {
    const experienceRow = this.scopedWorkExperienceSection
      .locator(`text=${jobTitle} at ${companyName}`)
      .locator('..');
    const checkbox = experienceRow.getByRole('checkbox');
    await checkbox.click();
  }

  /**
   * Edit the scoped summary
   */
  async editScopedSummary(newText: string) {
    await this.scopedSummaryEditButton.click();
    await this.scopedSummaryTextarea.waitFor();
    await this.scopedSummaryTextarea.clear();
    await this.scopedSummaryTextarea.fill(newText);
    await this.scopedSummarySaveButton.click();
    await this.scopedSummaryTextarea.waitFor({ state: 'hidden' });
  }

  /**
   * Reset scoped summary to original
   */
  async resetScopedSummary() {
    await this.scopedSummaryResetButton.click();
    // Wait for reset confirmation or UI update
    await this.page.waitForTimeout(500);
  }

  /**
   * Use bulk skill selection for a category
   */
  async bulkSelectSkillsInCategory(categoryName: string, action: 'all' | 'none') {
    const categoryControl = this.skillCategoryControls
      .filter({ hasText: categoryName });

    const button = categoryControl.getByRole('button', {
      name: action === 'all' ? 'All' : 'None'
    });
    await button.click();
  }

  /**
   * Get the count of included skills
   */
  async getIncludedSkillsCount(): Promise<{ included: number; total: number }> {
    const badgeText = await this.skillsIncludedBadge.textContent();
    const match = badgeText?.match(/(\d+) of (\d+) included/);
    return {
      included: match ? parseInt(match[1]) : 0,
      total: match ? parseInt(match[2]) : 0
    };
  }

  /**
   * Get the count of included work experiences
   */
  async getIncludedWorkExperiencesCount(): Promise<{ included: number; total: number }> {
    const badgeText = await this.workExperienceIncludedBadge.textContent();
    const match = badgeText?.match(/(\d+) of (\d+) included/);
    return {
      included: match ? parseInt(match[1]) : 0,
      total: match ? parseInt(match[2]) : 0
    };
  }

  /**
   * Check if a scoped summary is customized
   */
  async isSummaryCustomized(): Promise<boolean> {
    try {
      await this.scopedSummaryCustomizedBadge.waitFor({ timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }
}