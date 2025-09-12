import { test, expect } from '@playwright/test';
import { MainPage } from './page-objects/MainPage';

test.describe('Main Resume Page', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test.describe('Page Load and Basic Structure', () => {
    test('should load main resume page successfully', async () => {
      // Wait for the page to load completely
      await mainPage.waitForPageLoad();

      // Check that the main title is visible
      await expect(mainPage.headerTitle).toBeVisible();
      await expect(mainPage.headerTitle).toContainText('Digital Resume Manager');
    });

    test('should display all main resume sections', async () => {
      await mainPage.waitForPageLoad();

      // Check that all sections are visible
      await expect(mainPage.contactSection).toBeVisible();
      await expect(mainPage.summarySection).toBeVisible();
      await expect(mainPage.skillsSection).toBeVisible();
      await expect(mainPage.educationSection).toBeVisible();
      await expect(mainPage.workExperienceSection).toBeVisible();
    });

    test('should have accessible navigation tabs', async () => {
      await mainPage.waitForPageLoad();

      // Check navigation tabs
      await expect(mainPage.mainResumeTab).toBeVisible();
      await expect(mainPage.scopedResumesTab).toBeVisible();

      // Main Resume tab should be active (current page)
      await expect(mainPage.mainResumeTab).toHaveClass(/border-primary/);
    });

    test('should display export buttons', async () => {
      await mainPage.waitForPageLoad();

      // Check export functionality
      await mainPage.checkExportButtons();
      await expect(mainPage.exportPdfButton).toBeVisible();
      await expect(mainPage.exportDocxButton).toBeVisible();
    });
  });

  test.describe('Contact Section - Priority 1', () => {
    test('should display contact information from test database', async () => {
      await mainPage.waitForPageLoad();

      // Check that contact section is visible and contains expected data
      await expect(mainPage.contactSection).toBeVisible();
      
      // Should display contact info from our test database
      const contactInfo = await mainPage.getContactInfo();
      expect(contactInfo.name).toBeTruthy();
      expect(contactInfo.title).toBeTruthy();
      expect(contactInfo.email).toBeTruthy();
    });

    test('should have edit button for contact section', async () => {
      await mainPage.waitForPageLoad();

      // Check that edit button is visible and functional
      await expect(mainPage.contactEditButton).toBeVisible();
      await expect(mainPage.contactEditButton).toBeEnabled();
    });
  });

  test.describe('Professional Summary Section - Priority 1', () => {
    test('should display professional summary content', async () => {
      await mainPage.waitForPageLoad();

      // Check that summary section is visible
      await expect(mainPage.summarySection).toBeVisible();

      // Should display summary content from test database
      const summaryContent = await mainPage.getSummaryContent();
      expect(summaryContent).toBeTruthy();
      expect(summaryContent.length).toBeGreaterThan(0);
    });

    test('should have edit button for summary section', async () => {
      await mainPage.waitForPageLoad();

      // Check that edit button is visible and functional
      await expect(mainPage.summaryEditButton).toBeVisible();
      await expect(mainPage.summaryEditButton).toBeEnabled();
    });
  });

  test.describe('Navigation and Accessibility', () => {
    test('should navigate to scoped resumes page', async () => {
      await mainPage.waitForPageLoad();

      // Navigate to scoped resumes
      await mainPage.navigateToScopedResumes();
      
      // Should be on scoped resumes page
      await expect(mainPage.page).toHaveURL('/scoped');
    });

    test('should maintain accessibility standards', async () => {
      await mainPage.waitForPageLoad();

      // Basic accessibility checks
      await mainPage.checkSectionsAccessibility();

      // Check for basic accessibility attributes
      await expect(mainPage.contactSection).toBeVisible();
      await expect(mainPage.summarySection).toBeVisible();
    });
  });

  test.describe('Responsive Layout', () => {
    test('should be responsive on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await mainPage.goto();
      await mainPage.waitForPageLoad();

      // All sections should still be visible on mobile
      await expect(mainPage.contactSection).toBeVisible();
      await expect(mainPage.summarySection).toBeVisible();
      await expect(mainPage.skillsSection).toBeVisible();
      await expect(mainPage.educationSection).toBeVisible();
      await expect(mainPage.workExperienceSection).toBeVisible();
    });

    test('should be responsive on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await mainPage.goto();
      await mainPage.waitForPageLoad();

      // All sections should be visible on tablet
      await expect(mainPage.contactSection).toBeVisible();
      await expect(mainPage.summarySection).toBeVisible();
    });
  });
});