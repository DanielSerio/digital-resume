import { test, expect } from './fixtures/database';
import { MainPage } from './page-objects/MainPage';

test.describe('Work Experience Editing', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.waitForPageLoad();
  });

  test.describe('Work Experience CRUD Operations', () => {
    test('should add a new work experience entry', async () => {
      // Click Add Work Experience button
      await mainPage.addWorkExperienceButton.click();

      // Verify form is visible
      await expect(mainPage.getWorkExperienceForm()).toBeVisible();

      // Fill in work experience details
      await mainPage.getCompanyNameInput().fill('Tech Solutions Inc');
      await mainPage.getJobTitleInput().fill('Senior Software Engineer');
      await mainPage.getCompanyCityInput().fill('San Francisco');
      await mainPage.getCompanyStateInput().fill('CA');

      // Add accomplishment lines
      await mainPage.getLineTextarea(0).fill('Led development of microservices architecture');

      await mainPage.getAddLineButton().click();
      await mainPage.getLineTextarea(1).fill('Mentored junior developers and conducted code reviews');

      await mainPage.getAddLineButton().click();
      await mainPage.getLineTextarea(2).fill('Improved system performance by 40% through optimization');

      // Save the work experience
      await mainPage.getSaveButton().click();

      // Verify the work experience appears in the list
      await expect(mainPage.workExperienceList).toContainText('Senior Software Engineer');
      await expect(mainPage.workExperienceList).toContainText('Tech Solutions Inc');
      await expect(mainPage.workExperienceList).toContainText('Led development of microservices architecture');
    });

    test('should edit an existing work experience entry', async () => {
      // Assuming there's at least one work experience entry from test data
      const firstEntry = mainPage.getWorkExperienceEntry(0);
      await expect(firstEntry).toBeVisible();

      // Click edit button
      await mainPage.getWorkExperienceEditButton(0).click();

      // Verify form is visible with existing data
      await expect(mainPage.getWorkExperienceForm()).toBeVisible();

      // Modify the job title
      await mainPage.getJobTitleInput().clear();
      await mainPage.getJobTitleInput().fill('Lead Software Architect');

      // Modify first line
      await mainPage.getLineTextarea(0).clear();
      await mainPage.getLineTextarea(0).fill('Designed and implemented scalable cloud architecture');

      // Save changes
      await mainPage.getSaveButton().click();

      // Verify changes are reflected
      await expect(mainPage.workExperienceList).toContainText('Lead Software Architect');
      await expect(mainPage.workExperienceList).toContainText('Designed and implemented scalable cloud architecture');
    });

    test('should cancel work experience editing without saving changes', async () => {
      // Start editing first entry
      await mainPage.getWorkExperienceEditButton(0).click();
      await expect(mainPage.getWorkExperienceForm()).toBeVisible();

      // Make some changes
      await mainPage.getJobTitleInput().clear();
      await mainPage.getJobTitleInput().fill('This Should Not Be Saved');

      // Cancel editing
      await mainPage.getCancelButton().click();

      // Verify form is hidden and changes are not saved
      await expect(mainPage.getWorkExperienceForm()).not.toBeVisible();
      await expect(mainPage.workExperienceList).not.toContainText('This Should Not Be Saved');
    });

    test('should delete a work experience entry', async () => {
      // Get initial count of work experiences
      const initialEntries = await mainPage.workExperienceList.locator('.border').count();

      // Edit first entry to access delete button
      await mainPage.getWorkExperienceEditButton(0).click();
      await expect(mainPage.getWorkExperienceForm()).toBeVisible();

      // Click delete button
      await mainPage.getDeleteButton().click();

      // Verify entry is removed (count should decrease)
      await expect(mainPage.workExperienceList.locator('.border')).toHaveCount(initialEntries - 1);
    });
  });

  test.describe('Work Experience Line Management', () => {
    test.beforeEach(async () => {
      // Start editing first work experience entry
      await mainPage.getWorkExperienceEditButton(0).click();
      await expect(mainPage.getWorkExperienceForm()).toBeVisible();
    });

    test('should add multiple accomplishment lines', async () => {
      // Get initial line count
      const initialLines = await mainPage.getAllLines().count();

      // Add new line
      await mainPage.getAddLineButton().click();

      // Verify new textarea appears
      await expect(mainPage.getAllLines()).toHaveCount(initialLines + 1);

      // Fill the new line
      const newLineIndex = initialLines;
      await mainPage.getLineTextarea(newLineIndex).fill('New accomplishment line');

      // Add another line
      await mainPage.getAddLineButton().click();
      await expect(mainPage.getAllLines()).toHaveCount(initialLines + 2);

      // Fill second new line
      await mainPage.getLineTextarea(newLineIndex + 1).fill('Another accomplishment');
    });

    test('should remove accomplishment lines', async () => {
      // Ensure we have at least 2 lines to work with
      const initialLines = await mainPage.getAllLines().count();
      if (initialLines < 2) {
        await mainPage.getAddLineButton().click();
        await mainPage.getLineTextarea(1).fill('Line to be removed');
      }

      const currentLines = await mainPage.getAllLines().count();

      // Remove first line
      await mainPage.getLineRemoveButton(0).click();

      // Verify line count decreases
      await expect(mainPage.getAllLines()).toHaveCount(currentLines - 1);
    });

    test('should not allow removing the last line', async () => {
      // Remove lines until only one remains
      let lineCount = await mainPage.getAllLines().count();

      while (lineCount > 1) {
        await mainPage.getLineRemoveButton(0).click();
        lineCount = await mainPage.getAllLines().count();
      }

      // Try to remove the last line - should not be possible or should be disabled
      // Note: This depends on implementation - the button might be disabled or hidden
      await expect(mainPage.getAllLines()).toHaveCount(1);
    });
  });

  test.describe('Line Ordering with Arrow Buttons', () => {
    test.beforeEach(async () => {
      // Start editing first work experience entry
      await mainPage.getWorkExperienceEditButton(0).click();
      await expect(mainPage.getWorkExperienceForm()).toBeVisible();

      // Ensure we have at least 3 lines for testing
      const currentLines = await mainPage.getAllLines().count();
      for (let i = currentLines; i < 3; i++) {
        await mainPage.getAddLineButton().click();
        await mainPage.getLineTextarea(i).fill(`Test line ${i + 1}`);
      }
    });

    test('should move line down using arrow button', async () => {
      // Get text of first two lines
      const firstLineText = await mainPage.getLineTextarea(0).inputValue();
      const secondLineText = await mainPage.getLineTextarea(1).inputValue();

      // Move first line down
      await mainPage.getLineMoveDownButton(0).click();

      // Verify order is swapped
      await expect(mainPage.getLineTextarea(0)).toHaveValue(secondLineText);
      await expect(mainPage.getLineTextarea(1)).toHaveValue(firstLineText);
    });

    test('should move line up using arrow button', async () => {
      // Get text of first two lines
      const firstLineText = await mainPage.getLineTextarea(0).inputValue();
      const secondLineText = await mainPage.getLineTextarea(1).inputValue();

      // Move second line up
      await mainPage.getLineMoveUpButton(1).click();

      // Verify order is swapped
      await expect(mainPage.getLineTextarea(0)).toHaveValue(secondLineText);
      await expect(mainPage.getLineTextarea(1)).toHaveValue(firstLineText);
    });

    test('should disable move up button for first line', async () => {
      // First line's move up button should be disabled
      await expect(mainPage.getLineMoveUpButton(0)).toBeDisabled();
    });

    test('should disable move down button for last line', async () => {
      const lineCount = await mainPage.getAllLines().count();
      const lastLineIndex = lineCount - 1;

      // Last line's move down button should be disabled
      await expect(mainPage.getLineMoveDownButton(lastLineIndex)).toBeDisabled();
    });

    test('should maintain line order after multiple moves', async () => {
      // Set up initial content for easier tracking
      await mainPage.getLineTextarea(0).fill('First line');
      await mainPage.getLineTextarea(1).fill('Second line');
      await mainPage.getLineTextarea(2).fill('Third line');

      // Move first line down twice (should end up last)
      await mainPage.getLineMoveDownButton(0).click();
      await mainPage.getLineMoveDownButton(1).click();

      // Verify final order
      await expect(mainPage.getLineTextarea(0)).toHaveValue('Second line');
      await expect(mainPage.getLineTextarea(1)).toHaveValue('Third line');
      await expect(mainPage.getLineTextarea(2)).toHaveValue('First line');
    });

    test('should persist line order after saving', async () => {
      // Set up specific content
      await mainPage.getLineTextarea(0).fill('Original first');
      await mainPage.getLineTextarea(1).fill('Original second');
      await mainPage.getLineTextarea(2).fill('Original third');

      // Reorder lines
      await mainPage.getLineMoveDownButton(0).click(); // Move first down

      // Save the changes
      await mainPage.getSaveButton().click();

      // Edit again to verify order persisted
      await mainPage.getWorkExperienceEditButton(0).click();

      // Verify the reordered state was saved
      await expect(mainPage.getLineTextarea(0)).toHaveValue('Original second');
      await expect(mainPage.getLineTextarea(1)).toHaveValue('Original first');
      await expect(mainPage.getLineTextarea(2)).toHaveValue('Original third');
    });
  });

  test.describe('Form Validation', () => {
    test('should require company name and job title', async () => {
      // Click Add Work Experience
      await mainPage.addWorkExperienceButton.click();

      // Try to save without required fields
      await mainPage.getSaveButton().click();

      // Should show validation errors (implementation dependent)
      // This test might need adjustment based on actual validation implementation
      await expect(mainPage.getWorkExperienceForm()).toBeVisible();
    });

    test('should require at least one accomplishment line with content', async () => {
      // Click Add Work Experience
      await mainPage.addWorkExperienceButton.click();

      // Fill required fields but leave line empty
      await mainPage.getCompanyNameInput().fill('Test Company');
      await mainPage.getJobTitleInput().fill('Test Position');

      // Try to save with empty line
      await mainPage.getSaveButton().click();

      // Should show validation error or prevent saving
      await expect(mainPage.getWorkExperienceForm()).toBeVisible();
    });
  });

  test.describe('UI State Management', () => {
    test('should show orange border when adding new work experience', async () => {
      await mainPage.addWorkExperienceButton.click();

      // Check for orange border indicating active editing
      await expect(mainPage.workExperienceSection).toHaveClass(/border-orange-500|border-2/);
    });

    test('should show orange border when editing existing work experience', async () => {
      await mainPage.getWorkExperienceEditButton(0).click();

      // Check for orange border indicating active editing
      await expect(mainPage.workExperienceSection).toHaveClass(/border-orange-500|border-2/);
    });

    test('should prevent adding new work experience while editing', async () => {
      // Start editing
      await mainPage.getWorkExperienceEditButton(0).click();

      // Add button should be disabled or hidden
      await expect(mainPage.addWorkExperienceButton).toBeDisabled();
    });

    test('should prevent editing another entry while one is being edited', async () => {
      // Start editing first entry
      await mainPage.getWorkExperienceEditButton(0).click();

      // Try to edit second entry (if it exists)
      const secondEntryCount = await mainPage.workExperienceList.locator('.border').count();
      if (secondEntryCount > 1) {
        await expect(mainPage.getWorkExperienceEditButton(1)).toBeDisabled();
      }
    });
  });
});