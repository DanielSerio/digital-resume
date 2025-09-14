import { test, expect } from './fixtures/database';
import { MainPage } from './page-objects/MainPage';
import { ScopedResumePage } from './page-objects/ScopedResumePage';

test.describe('Scoped Resume Workflows - Priority 1', () => {
  let mainPage: MainPage;
  let scopedPage: ScopedResumePage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    scopedPage = new ScopedResumePage(page);

    // Start from main page to ensure clean state
    await mainPage.goto();
    await mainPage.waitForPageLoad();
  });

  test.describe('Navigation and Basic Structure', () => {
    test('should navigate to scoped resumes page', async () => {
      // Navigate to scoped resumes
      await mainPage.navigateToScopedResumes();

      // Verify we're on the right page
      expect(scopedPage.page.url()).toContain('/scoped');
      await expect(scopedPage.headerTitle).toBeVisible();
      await expect(scopedPage.resumeSelectorLabel).toBeVisible();
    });

    test('should show management interface when no resume selected', async () => {
      await scopedPage.goto();
      await scopedPage.waitForPageLoad();

      // Should be in management mode initially
      expect(await scopedPage.isInManagementMode()).toBe(true);
      expect(await scopedPage.isInEditingMode()).toBe(false);

      await expect(scopedPage.createResumeButton).toBeVisible();
      await expect(scopedPage.managementSection).toBeVisible();
    });

    test('should show editing interface when resume is selected', async () => {
      await scopedPage.goto();
      await scopedPage.waitForPageLoad();

      // Create a test scoped resume
      await scopedPage.createNewScopedResume('Test Resume for Editing');

      // Should automatically switch to editing mode
      expect(await scopedPage.isInEditingMode()).toBe(true);
      expect(await scopedPage.isInManagementMode()).toBe(false);

      // All editing sections should be visible
      await expect(scopedPage.contactSection).toBeVisible();
      await expect(scopedPage.scopedSummarySection).toBeVisible();
      await expect(scopedPage.scopedSkillsSection).toBeVisible();
      await expect(scopedPage.scopedWorkExperienceSection).toBeVisible();
      await expect(scopedPage.educationSection).toBeVisible();
    });
  });

  test.describe('Scoped Resume Management', () => {
    test('should create a new scoped resume', async () => {
      await scopedPage.goto();
      await scopedPage.waitForPageLoad();

      const resumeName = 'Frontend Developer Position';

      // Create new scoped resume
      await scopedPage.createNewScopedResume(resumeName);

      // Should switch to editing mode
      expect(await scopedPage.isInEditingMode()).toBe(true);

      // Should show the current selection
      await expect(scopedPage.currentSelectionInfo).toContainText(resumeName);
    });

    test('should be able to switch between scoped resumes', async () => {
      await scopedPage.goto();
      await scopedPage.waitForPageLoad();

      // Create two scoped resumes
      await scopedPage.createNewScopedResume('Backend Role');
      await scopedPage.goto(); // Go back to management
      await scopedPage.createNewScopedResume('Full Stack Role');

      // Switch between them
      await scopedPage.selectScopedResume('Backend Role');
      await expect(scopedPage.currentSelectionInfo).toContainText('Backend Role');

      await scopedPage.selectScopedResume('Full Stack Role');
      await expect(scopedPage.currentSelectionInfo).toContainText('Full Stack Role');
    });
  });

  test.describe('Professional Summary Copy-on-Write', () => {
    test('should allow customizing professional summary for scoped resume', async () => {
      await scopedPage.goto();
      await scopedPage.createNewScopedResume('Custom Summary Test');

      const customSummary = 'This is a customized summary for a specific role targeting React development.';

      // Edit the scoped summary
      await scopedPage.editScopedSummary(customSummary);

      // Should show customized badge
      expect(await scopedPage.isSummaryCustomized()).toBe(true);
      await expect(scopedPage.scopedSummaryCustomizedBadge).toBeVisible();

      // Reset button should be available
      await expect(scopedPage.scopedSummaryResetButton).toBeVisible();

      // Summary content should be updated
      await expect(scopedPage.scopedSummarySection).toContainText(customSummary);
    });

    test('should reset scoped summary to original', async () => {
      await scopedPage.goto();
      await scopedPage.createNewScopedResume('Reset Summary Test');

      // Customize the summary first
      await scopedPage.editScopedSummary('Temporary custom summary');
      expect(await scopedPage.isSummaryCustomized()).toBe(true);

      // Reset to original
      await scopedPage.resetScopedSummary();

      // Should no longer show customized badge
      expect(await scopedPage.isSummaryCustomized()).toBe(false);
    });
  });

  test.describe('Skills Inclusion and Filtering', () => {
    test('should show skills inclusion progress badge', async () => {
      await scopedPage.goto();
      await scopedPage.createNewScopedResume('Skills Test');

      // Should show skills count badge
      await expect(scopedPage.skillsIncludedBadge).toBeVisible();

      const counts = await scopedPage.getIncludedSkillsCount();
      expect(counts.total).toBeGreaterThan(0);
      expect(counts.included).toBeLessThanOrEqual(counts.total);
    });

    test('should toggle individual skill inclusion', async () => {
      await scopedPage.goto();
      await scopedPage.createNewScopedResume('Individual Skill Toggle');

      const initialCounts = await scopedPage.getIncludedSkillsCount();

      // Find and toggle a skill (assuming React exists in seed data)
      const skillCheckboxes = await scopedPage.skillCheckboxes.all();
      if (skillCheckboxes.length > 0) {
        const isInitiallyChecked = await skillCheckboxes[0].isChecked();
        await skillCheckboxes[0].click();

        // Wait for update
        await scopedPage.page.waitForTimeout(500);

        const newCounts = await scopedPage.getIncludedSkillsCount();

        // Count should have changed
        if (isInitiallyChecked) {
          expect(newCounts.included).toBe(initialCounts.included - 1);
        } else {
          expect(newCounts.included).toBe(initialCounts.included + 1);
        }
      }
    });

    test('should support bulk skill selection by category', async () => {
      await scopedPage.goto();
      await scopedPage.createNewScopedResume('Bulk Skills Test');

      // Wait for skills to load
      await expect(scopedPage.skillCategoryControls.first()).toBeVisible();

      const initialCounts = await scopedPage.getIncludedSkillsCount();

      // Try bulk selecting "All" for the first category
      const categoryControls = await scopedPage.skillCategoryControls.all();
      if (categoryControls.length > 0) {
        const allButton = categoryControls[0].getByRole('button', { name: 'All' });
        if (await allButton.isVisible()) {
          await allButton.click();

          // Wait for update
          await scopedPage.page.waitForTimeout(500);

          const newCounts = await scopedPage.getIncludedSkillsCount();
          expect(newCounts.included).toBeGreaterThanOrEqual(initialCounts.included);
        }
      }
    });
  });

  test.describe('Work Experience Selection and Customization', () => {
    test('should show work experience inclusion progress badge', async () => {
      await scopedPage.goto();
      await scopedPage.createNewScopedResume('Work Experience Test');

      // Should show work experience count badge
      await expect(scopedPage.workExperienceIncludedBadge).toBeVisible();

      const counts = await scopedPage.getIncludedWorkExperiencesCount();
      expect(counts.total).toBeGreaterThan(0);
      expect(counts.included).toBeLessThanOrEqual(counts.total);
    });

    test('should toggle work experience inclusion', async () => {
      await scopedPage.goto();
      await scopedPage.createNewScopedResume('Work Experience Toggle');

      const initialCounts = await scopedPage.getIncludedWorkExperiencesCount();

      // Find and toggle a work experience
      const workExpCheckboxes = await scopedPage.workExperienceCheckboxes.all();
      if (workExpCheckboxes.length > 0) {
        const isInitiallyChecked = await workExpCheckboxes[0].isChecked();
        await workExpCheckboxes[0].click();

        // Wait for update
        await scopedPage.page.waitForTimeout(500);

        const newCounts = await scopedPage.getIncludedWorkExperiencesCount();

        // Count should have changed
        if (isInitiallyChecked) {
          expect(newCounts.included).toBe(initialCounts.included - 1);
        } else {
          expect(newCounts.included).toBe(initialCounts.included + 1);
        }
      }
    });
  });

  test.describe('Data Persistence and Navigation', () => {
    test('should persist scoped resume selections across page reloads', async () => {
      await scopedPage.goto();
      const resumeName = 'Persistence Test Resume';

      // Create and customize a scoped resume
      await scopedPage.createNewScopedResume(resumeName);
      await scopedPage.editScopedSummary('Persisted custom summary');

      // Reload the page with the same resume selected
      await scopedPage.page.reload();
      await scopedPage.waitForPageLoad();

      // Should still be in editing mode for the same resume
      expect(await scopedPage.isInEditingMode()).toBe(true);
      await expect(scopedPage.currentSelectionInfo).toContainText(resumeName);

      // Customizations should persist
      expect(await scopedPage.isSummaryCustomized()).toBe(true);
      await expect(scopedPage.scopedSummarySection).toContainText('Persisted custom summary');
    });

    test('should navigate back to main resume and return to scoped', async () => {
      await scopedPage.goto();
      await scopedPage.createNewScopedResume('Navigation Test');

      // Navigate to main resume
      await scopedPage.mainResumeTab.click();
      await mainPage.page.waitForURL('/main');
      await expect(mainPage.contactSection).toBeVisible();

      // Navigate back to scoped resumes
      await mainPage.navigateToScopedResumes();

      // Should return to management mode (no resume pre-selected)
      expect(await scopedPage.isInManagementMode()).toBe(true);
    });
  });

  test.describe('Error Scenarios and Edge Cases', () => {
    test('should handle empty scoped resume creation gracefully', async () => {
      await scopedPage.goto();

      // Try to create resume with empty name
      await scopedPage.createResumeButton.click();

      const dialog = scopedPage.page.getByRole('dialog');
      const createButton = dialog.getByRole('button', { name: 'Create' });
      await createButton.click();

      // Should show validation error and not create resume
      // Dialog should remain open
      await expect(dialog).toBeVisible();

      // Cancel the dialog
      const cancelButton = dialog.getByRole('button', { name: 'Cancel' });
      await cancelButton.click();
      await expect(dialog).not.toBeVisible();
    });

    test('should handle rapid skill toggle clicks', async () => {
      await scopedPage.goto();
      await scopedPage.createNewScopedResume('Rapid Toggle Test');

      const skillCheckboxes = await scopedPage.skillCheckboxes.all();
      if (skillCheckboxes.length > 0) {
        const checkbox = skillCheckboxes[0];

        // Rapidly toggle the same skill
        await checkbox.click();
        await checkbox.click();
        await checkbox.click();

        // Should still be responsive and not crash
        await expect(scopedPage.skillsIncludedBadge).toBeVisible();

        // Final state should be deterministic
        const finalCounts = await scopedPage.getIncludedSkillsCount();
        expect(finalCounts.included).toBeGreaterThanOrEqual(0);
      }
    });
  });
});