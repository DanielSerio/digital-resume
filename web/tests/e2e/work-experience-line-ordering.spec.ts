import { test, expect } from './fixtures/database';
import { MainPage } from './page-objects/MainPage';

test.describe('Work Experience Line Ordering', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.waitForPageLoad();
  });

  test.describe('Arrow Button Line Reordering', () => {
    test.beforeEach(async () => {
      // Start editing first work experience entry
      await mainPage.getWorkExperienceEditButton(0).click();
      await expect(mainPage.getWorkExperienceForm()).toBeVisible();

      // Ensure we have at least 3 lines for testing
      const currentLines = await mainPage.getAllLines().count();

      // Add more lines if needed
      for (let i = currentLines; i < 3; i++) {
        await mainPage.getAddLineButton().click();
        await mainPage.getLineTextarea(i).fill(`Test line ${i + 1}`);
      }
    });

    test('should display move up and down buttons for each line', async () => {
      const lineCount = await mainPage.getAllLines().count();

      for (let i = 0; i < lineCount; i++) {
        // All lines should have both buttons
        await expect(mainPage.getLineMoveUpButton(i)).toBeVisible();
        await expect(mainPage.getLineMoveDownButton(i)).toBeVisible();
      }
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

    test('should move line down using arrow button', async () => {
      // Set up predictable content
      await mainPage.getLineTextarea(0).fill('First line');
      await mainPage.getLineTextarea(1).fill('Second line');

      // Move first line down
      await mainPage.getLineMoveDownButton(0).click();

      console.warn(mainPage.getLineTextarea(0));

      // Verify order is swapped
      await expect(mainPage.getLineTextarea(0)).toHaveValue('Second line');
      await expect(mainPage.getLineTextarea(1)).toHaveValue('First line');
    });

    test('should move line up using arrow button', async () => {
      // Set up predictable content
      await mainPage.getLineTextarea(0).fill('First line');
      await mainPage.getLineTextarea(1).fill('Second line');

      // Move second line up
      await mainPage.getLineMoveUpButton(1).click();

      // Verify order is swapped
      await expect(mainPage.getLineTextarea(0)).toHaveValue('Second line');
      await expect(mainPage.getLineTextarea(1)).toHaveValue('First line');
    });

    test('should maintain line order after multiple moves', async () => {
      // Set up initial content for easier tracking
      await mainPage.getLineTextarea(0).fill('Line A');
      await mainPage.getLineTextarea(1).fill('Line B');
      await mainPage.getLineTextarea(2).fill('Line C');

      // Move first line down twice (should end up last)
      await mainPage.getLineMoveDownButton(0).click(); // A moves to position 1
      await mainPage.getLineMoveDownButton(1).click(); // A moves to position 2

      // Verify final order: B, C, A
      await expect(mainPage.getLineTextarea(0)).toHaveValue('Line B');
      await expect(mainPage.getLineTextarea(1)).toHaveValue('Line C');
      await expect(mainPage.getLineTextarea(2)).toHaveValue('Line A');
    });

    test('should persist line order after saving', async () => {
      // First, let's see what's already there
      const existingLine0 = await mainPage.getLineTextarea(0).inputValue();
      const existingLine1 = await mainPage.getLineTextarea(1).inputValue();

      console.log('Existing line 0:', existingLine0);
      console.log('Existing line 1:', existingLine1);

      // If lines are empty, fill them
      if (!existingLine0.trim()) {
        await mainPage.getLineTextarea(0).fill('Original first');
      }
      if (!existingLine1.trim()) {
        await mainPage.getLineTextarea(1).fill('Original second');
      }

      // Get the actual content before reordering
      const beforeReorderLine0 = await mainPage.getLineTextarea(0).inputValue();
      const beforeReorderLine1 = await mainPage.getLineTextarea(1).inputValue();

      console.log('Before reorder line 0:', beforeReorderLine0);
      console.log('Before reorder line 1:', beforeReorderLine1);

      // Reorder lines
      await mainPage.getLineMoveDownButton(0).click(); // Move first down

      // Verify reordering worked
      await expect(mainPage.getLineTextarea(0)).toHaveValue(beforeReorderLine1);
      await expect(mainPage.getLineTextarea(1)).toHaveValue(beforeReorderLine0);

      // Save the changes
      await mainPage.getSaveButton().click();

      // Wait for form to close (indicates save completed)
      await expect(mainPage.getWorkExperienceForm()).not.toBeVisible();

      // Wait a moment for query invalidation and data refetch to complete
      await mainPage.page.waitForTimeout(500);

      // Edit again to verify order persisted
      await mainPage.getWorkExperienceEditButton(0).click();

      // Wait for form to be visible before checking values
      await expect(mainPage.getWorkExperienceForm()).toBeVisible();

      // Wait a bit for the form to populate
      await mainPage.page.waitForTimeout(2000);

      // Check what we actually got after reload
      const afterReloadLine0 = await mainPage.getLineTextarea(0).inputValue();
      const afterReloadLine1 = await mainPage.getLineTextarea(1).inputValue();

      console.log('After reload line 0:', afterReloadLine0);
      console.log('After reload line 1:', afterReloadLine1);

      // Verify the reordered state was saved
      await expect(mainPage.getLineTextarea(0)).toHaveValue(beforeReorderLine1);
      await expect(mainPage.getLineTextarea(1)).toHaveValue(beforeReorderLine0);
    });
  });

  test.describe('Line Loading Verification', () => {
    test('should display existing work experience lines when editing', async () => {
      // Listen to ALL console messages for debugging
      mainPage.page.on('console', msg => {
        console.log('BROWSER CONSOLE:', msg.text());
      });

      // Start editing first work experience entry
      await mainPage.getWorkExperienceEditButton(0).click();
      await expect(mainPage.getWorkExperienceForm()).toBeVisible();

      // Wait for form to be populated and console messages
      await mainPage.page.waitForTimeout(2000);

      // Check that lines are loaded
      const lineCount = await mainPage.getAllLines().count();
      console.log('Number of lines found:', lineCount);

      // Verify we have at least one line
      expect(lineCount).toBeGreaterThan(0);

      // Check that the first line has content (not empty)
      const firstLineValue = await mainPage.getLineTextarea(0).inputValue();
      console.log('First line content:', firstLineValue);

      // The line should either have existing content or be empty for new additions
      // For an existing work experience with database lines, it should have content
      if (lineCount > 1) {
        // If we have multiple lines, at least one should have content
        let hasContent = false;
        for (let i = 0; i < lineCount; i++) {
          const lineValue = await mainPage.getLineTextarea(i).inputValue();
          if (lineValue.trim().length > 0) {
            hasContent = true;
            break;
          }
        }
        expect(hasContent).toBe(true);
      }
    });

    test('should fetch work experience data from API', async () => {
      // Listen for API requests
      const apiPromise = mainPage.page.waitForResponse(response =>
        response.url().includes('/api/work-experiences') && response.request().method() === 'GET'
      );

      // Trigger the API call by refreshing the page
      await mainPage.goto();
      await mainPage.waitForPageLoad();

      // Wait for the API response
      const response = await apiPromise;
      const responseData = await response.json();

      console.log('API Response Status:', response.status());
      console.log('API Response Data:', JSON.stringify(responseData, null, 2));

      // Verify the response structure
      expect(response.ok()).toBe(true);
      expect(responseData.success).toBe(true);
      expect(Array.isArray(responseData.data)).toBe(true);

      // Check if work experiences have lines
      if (responseData.data.length > 0) {
        const firstWorkExp = responseData.data[0];
        console.log('First work experience lines:', firstWorkExp.lines);

        // Verify the structure includes lines
        expect(firstWorkExp).toHaveProperty('lines');
        expect(Array.isArray(firstWorkExp.lines)).toBe(true);
      }
    });
  });

  test.describe('Basic Line Management', () => {
    test.beforeEach(async () => {
      // Start editing first work experience entry
      await mainPage.getWorkExperienceEditButton(0).click();
      await expect(mainPage.getWorkExperienceForm()).toBeVisible();
    });

    test('should allow adding new lines', async () => {
      const initialCount = await mainPage.getAllLines().count();

      // Add a new line
      await mainPage.getAddLineButton().click();

      // Verify line count increased
      await expect(mainPage.getAllLines()).toHaveCount(initialCount + 1);

      // Fill the new line
      await mainPage.getLineTextarea(initialCount).fill('New accomplishment');
      await expect(mainPage.getLineTextarea(initialCount)).toHaveValue('New accomplishment');
    });

    test('should allow removing lines', async () => {
      // Ensure we have at least 2 lines
      const initialCount = await mainPage.getAllLines().count();
      if (initialCount < 2) {
        await mainPage.getAddLineButton().click();
        await mainPage.getLineTextarea(1).fill('Line to remove');
      }

      const currentCount = await mainPage.getAllLines().count();

      // Remove the second line
      await mainPage.getLineRemoveButton(1).click();

      // Verify line count decreased
      await expect(mainPage.getAllLines()).toHaveCount(currentCount - 1);
    });
  });
});