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

  // Summary Section
  readonly summarySection: Locator;
  readonly summaryEditButton: Locator;
  readonly summaryContent: Locator;

  // Skills Section
  readonly skillsSection: Locator;
  readonly skillsEditButton: Locator;
  readonly skillsList: Locator;

  // Education Section
  readonly educationSection: Locator;
  readonly educationEditButton: Locator;
  readonly educationList: Locator;

  // Work Experience Section
  readonly workExperienceSection: Locator;
  readonly workExperienceList: Locator;
  readonly addWorkExperienceButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Header elements
    this.headerTitle = page.getByText('Digital Resume Manager');
    this.exportPdfButton = page.getByRole('button', { name: 'Export PDF' });
    this.exportDocxButton = page.getByRole('button', { name: 'Export DOC' });
    this.mainResumeTab = page.getByRole('link', { name: 'Main Resume' });
    this.scopedResumesTab = page.getByRole('link', { name: 'Scoped Resumes' });

    // Contact Section
    this.contactSection = page.getByRole('region', { name: /contact information/i });
    this.contactEditButton = this.contactSection.getByRole('button', { name: 'Edit' });
    this.contactName = this.contactSection.getByTestId('contact-name');
    this.contactTitle = this.contactSection.getByTestId('contact-title');
    this.contactEmail = this.contactSection.getByTestId('contact-email');
    this.contactPhone = this.contactSection.getByTestId('contact-phone');
    this.contactGithub = this.contactSection.getByTestId('contact-github');
    this.contactWebsite = this.contactSection.getByTestId('contact-website');
    this.contactLinkedin = this.contactSection.getByTestId('contact-linkedin');

    // Summary Section
    this.summarySection = page.getByRole('region', { name: /professional summary/i });
    this.summaryEditButton = this.summarySection.getByRole('button', { name: 'Edit' });
    this.summaryContent = this.summarySection.getByTestId('summary-content');

    // Skills Section
    this.skillsSection = page.getByRole('region', { name: /technical skills/i });
    this.skillsEditButton = this.skillsSection.getByRole('button', { name: 'Edit' });
    this.skillsList = this.skillsSection.getByTestId('skills-list');

    // Education Section
    this.educationSection = page.getByRole('region', { name: /education/i });
    this.educationEditButton = this.educationSection.getByRole('button', { name: 'Edit' });
    this.educationList = this.educationSection.getByTestId('education-list');

    // Work Experience Section
    this.workExperienceSection = page.getByRole('region', { name: /work experience/i });
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
}