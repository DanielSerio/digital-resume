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
    this.resumeSelectorLabel = page.getByTestId('resume-selector-label');
    this.resumeSelector = page.getByTestId('resume-selector-content');
    this.resumeSelectorTrigger = page.getByTestId('resume-selector-trigger');
    this.currentSelectionInfo = page.getByTestId('current-selection-info');

    // Management Interface
    this.createResumeButton = page.getByTestId('create-resume-button');
    this.managementSection = page.getByTestId('scoped-resume-manager');

    // Scoped Resume Cards
    this.resumeCards = page.getByTestId('resume-cards-container').locator('[data-testid*="resume-card"]');

    // Contact Section (read-only in scoped view)
    this.contactSection = page.getByTestId('ContactCard');

    // Scoped Summary Section
    this.scopedSummarySection = page.getByTestId('ScopedSummaryCard');
    this.scopedSummaryEditButton = this.scopedSummarySection.getByTestId('edit-button');
    this.scopedSummaryCustomizedBadge = this.scopedSummarySection.getByTestId('summary-customized-badge');
    this.scopedSummaryResetButton = this.scopedSummarySection.getByTestId('summary-reset-button');
    this.scopedSummaryTextarea = this.scopedSummarySection.getByRole('textbox');
    this.scopedSummarySaveButton = this.scopedSummarySection.getByTestId('save-button');
    this.scopedSummaryCancelButton = this.scopedSummarySection.getByTestId('cancel-button');

    // Scoped Skills Section
    this.scopedSkillsSection = page.getByTestId('ScopedSkillsCard');
    this.skillsIncludedBadge = this.scopedSkillsSection.getByTestId('skills-included-badge');
    this.skillCategoryControls = this.scopedSkillsSection.locator('.bg-muted.rounded-lg');
    this.skillCheckboxes = this.scopedSkillsSection.getByRole('checkbox');
    this.bulkSkillButtons = this.scopedSkillsSection.getByRole('button', { name: /All|None/ });

    // Scoped Work Experience Section
    this.scopedWorkExperienceSection = page.getByTestId('ScopedWorkExperienceCard');
    this.workExperienceIncludedBadge = this.scopedWorkExperienceSection.getByTestId('work-experience-included-badge');
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
   * Create a new scoped resume (simplified for testing)
   */
  async createNewScopedResume(name: string) {
    // Click create button and wait for dialog
    await this.createResumeButton.click();

    // Wait for form elements to be ready
    const nameInput = this.page.getByTestId('resume-name-input');
    const submitButton = this.page.getByTestId('create-resume-submit-button');

    await nameInput.waitFor({ state: 'visible' });
    await submitButton.waitFor({ state: 'visible' });

    // Fill and submit form
    await nameInput.fill(name);
    await submitButton.click();

    // Wait for any success indicators
    try {
      await Promise.race([
        this.page.waitForURL(/\/scoped\?resumeId=/, { timeout: 10000 }),
        this.currentSelectionInfo.waitFor({ state: 'visible', timeout: 10000 })
      ]);
    } catch (error) {
      // If navigation fails, still try final check
    }

    // Final check: ensure we're in editing mode
    await this.currentSelectionInfo.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Select a scoped resume from the dropdown
   */
  async selectScopedResume(resumeName: string) {
    // First ensure we're in management mode
    await this.resumeSelectorTrigger.waitFor({ state: 'visible' });
    await this.resumeSelectorTrigger.click();

    // Wait for dropdown to appear
    const dropdown = this.page.getByTestId('resume-selector-content');
    await dropdown.waitFor({ state: 'visible' });

    // Select the resume by text content
    const option = dropdown.getByText(resumeName);
    await option.waitFor({ state: 'visible' });
    await option.click();

    // Wait for selection to complete and editing interface to load
    await this.currentSelectionInfo.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(500); // Allow UI to settle
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
    // First ensure the summary section exists
    await this.scopedSummarySection.waitFor({ state: 'visible' });

    await this.scopedSummaryEditButton.click();

    // Wait for edit mode to activate
    await this.scopedSummaryTextarea.waitFor({ state: 'visible' });
    await this.scopedSummarySaveButton.waitFor({ state: 'visible' });

    // Clear and fill the textarea
    await this.scopedSummaryTextarea.clear();
    await this.scopedSummaryTextarea.fill(newText);

    // Save and wait for edit mode to end
    await this.scopedSummarySaveButton.click();
    await this.scopedSummaryTextarea.waitFor({ state: 'hidden' });

    // Give the UI time to update after save
    await this.page.waitForTimeout(1000);
  }

  /**
   * Reset scoped summary to original
   */
  async resetScopedSummary() {
    await this.scopedSummaryResetButton.click();

    // Wait for customized badge to disappear
    await this.scopedSummaryCustomizedBadge.waitFor({ state: 'hidden' });

    // Wait for reset button to disappear (since it only shows when customized)
    await this.scopedSummaryResetButton.waitFor({ state: 'hidden' });
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
  async getIncludedSkillsCount(): Promise<{ included: number; total: number; }> {
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
  async getIncludedWorkExperiencesCount(): Promise<{ included: number; total: number; }> {
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
      // First ensure the summary section exists
      await this.scopedSummarySection.waitFor({ state: 'visible' });

      // Then check if customized badge is visible
      await this.scopedSummaryCustomizedBadge.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }
}