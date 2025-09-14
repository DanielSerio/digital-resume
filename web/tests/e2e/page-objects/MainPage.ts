import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model for the main resume page
 * Follows our planned testing order: Contact → Summary → Skills → Education → Work Experience
 */
export class MainPage {
  readonly page: Page;

  // Header elements
  readonly headerTitle: Locator;
  readonly exportPdfButton: Locator;
  readonly exportDocxButton: Locator;
  readonly mainResumeTab: Locator;
  readonly scopedResumesTab: Locator;

  // Contact Section
  readonly contactSection: Locator;
  readonly contactEditButton: Locator;
  readonly contactName: Locator;
  readonly contactTitle: Locator;
  readonly contactEmail: Locator;
  readonly contactPhone: Locator;
  readonly contactGithub: Locator;
  readonly contactWebsite: Locator;
  readonly contactLinkedin: Locator;

  // Contact Section - Edit Mode
  readonly contactNameInput: Locator;
  readonly contactTitleInput: Locator;
  readonly contactEmailInput: Locator;
  readonly contactPhoneInput: Locator;
  readonly contactGithubInput: Locator;
  readonly contactWebsiteInput: Locator;
  readonly contactLinkedinInput: Locator;
  readonly contactSaveButton: Locator;
  readonly contactCancelButton: Locator;

  // Summary Section
  readonly summarySection: Locator;
  readonly summaryEditButton: Locator;
  readonly summaryContent: Locator;

  // Summary Section - Edit Mode
  readonly summaryTextarea: Locator;
  readonly summarySaveButton: Locator;
  readonly summaryCancelButton: Locator;

  // Skills Section
  readonly skillsSection: Locator;
  readonly skillsEditButton: Locator;
  readonly skillsList: Locator;

  // Education Section
  readonly educationSection: Locator;
  readonly educationList: Locator;

  // Work Experience Section
  readonly workExperienceSection: Locator;
  readonly workExperienceList: Locator;
  readonly addWorkExperienceButton: Locator;

  // Work Experience Form Selectors
  getWorkExperienceForm() { return this.workExperienceSection.locator('[role="form"]'); }
  getCompanyNameInput() { return this.page.getByTestId('work-exp-company-name'); }
  getJobTitleInput() { return this.page.getByTestId('work-exp-job-title'); }
  getCompanyCityInput() { return this.page.getByTestId('work-exp-company-city'); }
  getCompanyStateInput() { return this.page.getByTestId('work-exp-company-state'); }
  getStartDateButton() { return this.getWorkExperienceForm().getByRole('button', { name: /start date/i }); }
  getEndDateButton() { return this.getWorkExperienceForm().getByRole('button', { name: /end date/i }); }
  getAddLineButton() { return this.page.getByTestId('work-exp-add-line'); }
  getSaveButton() { return this.page.getByTestId('work-exp-save'); }
  getCancelButton() { return this.page.getByTestId('work-exp-cancel'); }
  getDeleteButton() { return this.page.getByTestId('work-exp-delete'); }

  // Work Experience Line Selectors
  getLineTextarea(index: number) { return this.page.getByTestId(`line-textarea-${index}`); }
  getLineContainer(index: number) { return this.page.getByTestId(`work-exp-line-${index}`); }
  getLineRemoveButton(index: number) { return this.page.getByTestId(`line-remove-${index}`); }
  getLineMoveUpButton(index: number) { return this.page.getByTestId(`line-move-up-${index}`); }
  getLineMoveDownButton(index: number) { return this.page.getByTestId(`line-move-down-${index}`); }
  getAllLines() { return this.page.locator('[data-testid^="line-textarea-"]'); }

  // Work Experience Display Selectors
  getWorkExperienceEntry(index: number) { return this.workExperienceList.locator('.border').nth(index); }
  getWorkExperienceEditButton(index: number) { return this.getWorkExperienceEntry(index).getByRole('button', { name: 'Edit' }); }

  constructor(page: Page) {
    this.page = page;

    // Header elements
    this.headerTitle = page.getByText('Digital Resume Manager');
    this.exportPdfButton = page.getByRole('button', { name: 'Export PDF' });
    this.exportDocxButton = page.getByRole('button', { name: 'Export DOC' });
    this.mainResumeTab = page.getByRole('link', { name: 'Main Resume' });
    this.scopedResumesTab = page.getByRole('link', { name: 'Scoped Resumes' });

    // Contact Section
    this.contactSection = page.getByTestId('ContactCard');
    this.contactEditButton = this.contactSection.getByTestId('edit-button');
    this.contactName = this.contactSection.getByTestId('contact-name');
    this.contactTitle = this.contactSection.getByTestId('contact-title');
    this.contactEmail = this.contactSection.getByTestId('contact-email');
    this.contactPhone = this.contactSection.getByTestId('contact-phone');
    this.contactGithub = this.contactSection.getByTestId('contact-github');
    this.contactWebsite = this.contactSection.getByTestId('contact-website');
    this.contactLinkedin = this.contactSection.getByTestId('contact-linkedin');

    // Contact Section - Edit Mode
    this.contactNameInput = this.contactSection.getByRole('textbox', { name: /name/i });
    this.contactTitleInput = this.contactSection.getByRole('textbox', { name: /title/i });
    this.contactEmailInput = this.contactSection.getByRole('textbox', { name: /email/i });
    this.contactPhoneInput = this.contactSection.getByRole('textbox', { name: /phone/i });
    this.contactGithubInput = this.contactSection.getByRole('textbox', { name: /github/i });
    this.contactWebsiteInput = this.contactSection.getByRole('textbox', { name: /website/i });
    this.contactLinkedinInput = this.contactSection.getByRole('textbox', { name: /linkedin/i });
    this.contactSaveButton = this.contactSection.getByTestId('save-button');
    this.contactCancelButton = this.contactSection.getByTestId('cancel-button');

    // Summary Section
    this.summarySection = page.getByTestId('SummaryCard');
    this.summaryEditButton = this.summarySection.getByTestId('edit-button');
    this.summaryContent = this.summarySection.getByTestId('summary-content');

    // Summary Section - Edit Mode
    this.summaryTextarea = this.summarySection.getByRole('textbox', { name: /summary/i });
    this.summarySaveButton = this.summarySection.getByTestId('save-button');
    this.summaryCancelButton = this.summarySection.getByTestId('cancel-button');

    // Skills Section
    this.skillsSection = page.getByTestId('SkillsCard');
    this.skillsEditButton = this.skillsSection.getByTestId('edit-button');
    this.skillsList = this.skillsSection.getByTestId('skills-list');

    // Education Section
    this.educationSection = page.getByTestId('EducationCard');
    this.educationList = this.educationSection.getByTestId('education-list');

    // Work Experience Section
    this.workExperienceSection = page.getByTestId('WorkExpCard');
    this.workExperienceList = this.workExperienceSection.getByTestId('work-experience-list');
    this.addWorkExperienceButton = this.workExperienceSection.getByRole('button', { name: 'Add Work Experience' });
  }

  /**
   * Navigate to the main resume page
   */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for the page to be fully loaded with all sections visible
   */
  async waitForPageLoad() {
    await this.headerTitle.waitFor({ state: 'visible' });
    await this.contactSection.waitFor({ state: 'visible' });
    await this.summarySection.waitFor({ state: 'visible' });
    await this.skillsSection.waitFor({ state: 'visible' });
    await this.educationSection.waitFor({ state: 'visible' });
    await this.workExperienceSection.waitFor({ state: 'visible' });
  }

  /**
   * Check if all main sections are visible (accessibility check)
   */
  async checkSectionsAccessibility() {
    // Verify all sections have proper ARIA roles and are accessible
    await this.contactSection.isVisible();
    await this.summarySection.isVisible();
    await this.skillsSection.isVisible();
    await this.educationSection.isVisible();
    await this.workExperienceSection.isVisible();
  }

  /**
   * Get the current contact information displayed
   */
  async getContactInfo() {
    return {
      name: await this.contactName.textContent(),
      title: await this.contactTitle.textContent(),
      email: await this.contactEmail.textContent(),
      phone: await this.contactPhone.textContent(),
      github: await this.contactGithub.textContent(),
      website: await this.contactWebsite.textContent(),
      linkedin: await this.contactLinkedin.textContent(),
    };
  }

  /**
   * Get the current professional summary content
   */
  async getSummaryContent() {
    return await this.summaryContent.textContent();
  }

  /**
   * Navigate to scoped resumes page
   */
  async navigateToScopedResumes() {
    await this.scopedResumesTab.click();
    await this.page.waitForURL('/scoped');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if export buttons are functional (don't actually download)
   */
  async checkExportButtons() {
    await this.exportPdfButton.isVisible();
    await this.exportDocxButton.isVisible();
    await this.exportPdfButton.isEnabled();
    await this.exportDocxButton.isEnabled();
  }

  /**
   * Enter edit mode for contact section
   */
  async enterContactEditMode() {
    await this.contactEditButton.click();
    await this.contactNameInput.waitFor({ state: 'visible' });
  }

  /**
   * Fill contact form with provided data
   */
  async fillContactForm(contactData: {
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
    github?: string;
    website?: string;
    linkedin?: string;
  }) {
    if (contactData.name !== undefined) {
      await this.contactNameInput.fill(contactData.name);
    }
    if (contactData.title !== undefined) {
      await this.contactTitleInput.fill(contactData.title);
    }
    if (contactData.email !== undefined) {
      await this.contactEmailInput.fill(contactData.email);
    }
    if (contactData.phone !== undefined) {
      await this.contactPhoneInput.fill(contactData.phone);
    }
    if (contactData.github !== undefined) {
      await this.contactGithubInput.fill(contactData.github);
    }
    if (contactData.website !== undefined) {
      await this.contactWebsiteInput.fill(contactData.website);
    }
    if (contactData.linkedin !== undefined) {
      await this.contactLinkedinInput.fill(contactData.linkedin);
    }
  }

  /**
   * Save contact changes
   */
  async saveContactChanges() {
    await this.contactSaveButton.click();
    await this.contactEditButton.waitFor({ state: 'visible' });
  }

  /**
   * Cancel contact changes
   */
  async cancelContactChanges() {
    await this.contactCancelButton.click();
    await this.contactEditButton.waitFor({ state: 'visible' });
  }

  /**
   * Check if contact form is in edit mode
   */
  async isContactInEditMode(): Promise<boolean> {
    return await this.contactNameInput.isVisible();
  }

  /**
   * Enter edit mode for summary section
   */
  async enterSummaryEditMode() {
    await this.summaryEditButton.click();
    await this.summaryTextarea.waitFor({ state: 'visible' });
  }

  /**
   * Fill summary textarea with provided text
   */
  async fillSummaryText(summaryText: string) {
    await this.summaryTextarea.fill(summaryText);
  }

  /**
   * Save summary changes
   */
  async saveSummaryChanges() {
    await this.summarySaveButton.click();
    await this.summaryEditButton.waitFor({ state: 'visible' });
  }

  /**
   * Cancel summary changes
   */
  async cancelSummaryChanges() {
    await this.summaryCancelButton.click();
    await this.summaryEditButton.waitFor({ state: 'visible' });
  }

  /**
   * Check if summary form is in edit mode
   */
  async isSummaryInEditMode(): Promise<boolean> {
    return await this.summaryTextarea.isVisible();
  }
}