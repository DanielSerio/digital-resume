import { test, expect } from '@playwright/test';
import { MainPage } from './page-objects/MainPage';

test.describe('Summary Section Editing - Priority 1', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.waitForPageLoad();
  });

  test.describe('Edit Mode Workflow', () => {
    test('should enter edit mode when Edit button is clicked', async () => {
      // Verify we start in display mode
      await expect(mainPage.summaryEditButton).toBeVisible();
      expect(await mainPage.isSummaryInEditMode()).toBe(false);

      // Enter edit mode
      await mainPage.enterSummaryEditMode();

      // Verify we're now in edit mode
      expect(await mainPage.isSummaryInEditMode()).toBe(true);
      await expect(mainPage.summaryTextarea).toBeVisible();
      await expect(mainPage.summarySaveButton).toBeVisible();
      await expect(mainPage.summaryCancelButton).toBeVisible();
      await expect(mainPage.summaryEditButton).not.toBeVisible();
    });

    test('should cancel changes and return to display mode', async () => {
      // Get original summary content
      const originalSummary = await mainPage.getSummaryContent();

      // Enter edit mode and make changes
      await mainPage.enterSummaryEditMode();
      await mainPage.fillSummaryText('This is a completely modified summary that should not be saved.');

      // Cancel changes
      await mainPage.cancelSummaryChanges();

      // Verify we're back in display mode
      expect(await mainPage.isSummaryInEditMode()).toBe(false);
      await expect(mainPage.summaryEditButton).toBeVisible();

      // Verify changes were not saved
      const currentSummary = await mainPage.getSummaryContent();
      expect(currentSummary).toBe(originalSummary);
    });
  });

  test.describe('Save Workflow', () => {
    test('should save valid summary changes', async () => {
      const newSummaryText = 'Experienced full-stack developer with 8+ years of expertise in React, TypeScript, and Node.js. Proven track record of delivering scalable web applications and leading cross-functional teams. Passionate about clean code, testing, and modern development practices.';

      // Enter edit mode
      await mainPage.enterSummaryEditMode();

      // Fill summary with new text
      await mainPage.fillSummaryText(newSummaryText);

      // Save changes
      await mainPage.saveSummaryChanges();

      // Verify we're back in display mode
      expect(await mainPage.isSummaryInEditMode()).toBe(false);
      await expect(mainPage.summaryEditButton).toBeVisible();

      // Verify changes were saved
      const savedSummary = await mainPage.getSummaryContent();
      expect(savedSummary).toContain(newSummaryText);
    });

    test('should persist changes after page reload', async () => {
      const testSummary = 'This summary should persist after page reload. Testing persistence functionality.';

      // Make and save changes
      await mainPage.enterSummaryEditMode();
      await mainPage.fillSummaryText(testSummary);
      await mainPage.saveSummaryChanges();

      // Reload page
      await mainPage.goto();
      await mainPage.waitForPageLoad();

      // Verify changes persisted
      const summary = await mainPage.getSummaryContent();
      expect(summary).toContain(testSummary);
    });
  });

  test.describe('Content Handling', () => {
    test('should handle long text content', async () => {
      const longSummary = 'This is a very long professional summary that contains multiple sentences and should be properly handled by the text area component. '.repeat(10);

      await mainPage.enterSummaryEditMode();
      await mainPage.fillSummaryText(longSummary);
      await mainPage.saveSummaryChanges();

      const savedSummary = await mainPage.getSummaryContent();
      expect(savedSummary).toContain(longSummary);
    });

    test('should handle empty summary', async () => {
      // Clear summary content
      await mainPage.enterSummaryEditMode();
      await mainPage.fillSummaryText('');
      await mainPage.saveSummaryChanges();

      // Verify empty content is handled appropriately
      const summary = await mainPage.getSummaryContent();
      expect(summary?.trim()).toBeFalsy();
    });

    test('should preserve formatting and line breaks', async () => {
      const formattedSummary = `Experienced developer with expertise in:

• Frontend: React, TypeScript, Vue.js
• Backend: Node.js, Python, Java
• Databases: PostgreSQL, MongoDB

Passionate about clean architecture and testing.`;

      await mainPage.enterSummaryEditMode();
      await mainPage.fillSummaryText(formattedSummary);
      await mainPage.saveSummaryChanges();

      const savedSummary = await mainPage.getSummaryContent();
      expect(savedSummary).toContain('Frontend: React');
      expect(savedSummary).toContain('Backend: Node.js');
    });
  });

  test.describe('Form Validation', () => {
    test('should handle special characters and unicode', async () => {
      const specialSummary = 'Developer with expertise in React ⚛️, Node.js 🚀, and Python 🐍. Fluent in English, Español, and 中文.';

      await mainPage.enterSummaryEditMode();
      await mainPage.fillSummaryText(specialSummary);
      await mainPage.saveSummaryChanges();

      const savedSummary = await mainPage.getSummaryContent();
      expect(savedSummary).toContain('⚛️');
      expect(savedSummary).toContain('Español');
      expect(savedSummary).toContain('中文');
    });

    test('should maintain textarea value during edit session', async () => {
      const testSummary = 'Testing that the textarea maintains its value during the edit session';

      await mainPage.enterSummaryEditMode();
      await mainPage.fillSummaryText(testSummary);

      // Check that the textarea contains the entered text
      const textareaValue = await mainPage.summaryTextarea.inputValue();
      expect(textareaValue).toBe(testSummary);
    });
  });

  test.describe('UI State Management', () => {
    test('should disable other section edit buttons during summary editing', async () => {
      // Enter summary edit mode
      await mainPage.enterSummaryEditMode();

      // Check that other section edit buttons are disabled
      await expect(mainPage.contactEditButton).toBeDisabled();
      await expect(mainPage.skillsEditButton).toBeDisabled();
      await expect(mainPage.educationEditButton).toBeDisabled();
    });

    test('should show current content in textarea when entering edit mode', async () => {
      // Get current summary content
      const currentSummary = await mainPage.getSummaryContent();

      // Enter edit mode
      await mainPage.enterSummaryEditMode();

      // Verify textarea is pre-filled with current content
      const textareaValue = await mainPage.summaryTextarea.inputValue();
      expect(textareaValue).toBe(currentSummary);
    });
  });

  test.describe('Integration with Contact Section', () => {
    test('should prevent simultaneous editing of multiple sections', async () => {
      // Enter summary edit mode
      await mainPage.enterSummaryEditMode();
      expect(await mainPage.isSummaryInEditMode()).toBe(true);

      // Contact edit button should be disabled
      await expect(mainPage.contactEditButton).toBeDisabled();
    });
  });
});