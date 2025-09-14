import { test, expect } from './fixtures/database';
import { MainPage } from './page-objects/MainPage';

test.describe('Save Button Debug', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.waitForPageLoad();
  });

  test('should fire console logs when save button is clicked', async () => {
    const consoleLogs: string[] = [];

    // Capture all console messages
    mainPage.page.on('console', msg => {
      consoleLogs.push(msg.text());
      console.log('BROWSER:', msg.text());
    });

    // Start editing first work experience entry
    await mainPage.getWorkExperienceEditButton(0).click();
    await expect(mainPage.getWorkExperienceForm()).toBeVisible();

    // Wait for form to populate
    await mainPage.page.waitForTimeout(1000);

    // Click save button
    console.log('About to click save button');
    await mainPage.getSaveButton().click();

    // Wait a moment for any async operations
    await mainPage.page.waitForTimeout(2000);

    // Check if we got the expected console logs
    const saveButtonLogs = consoleLogs.filter(log => log.includes('Save button clicked'));
    const formSubmitLogs = consoleLogs.filter(log => log.includes('Form handleSubmit called'));
    const saveHandlerLogs = consoleLogs.filter(log => log.includes('Saving work experience data'));

    console.log('Save button click logs:', saveButtonLogs);
    console.log('Form submit logs:', formSubmitLogs);
    console.log('Save handler logs:', saveHandlerLogs);
    console.log('All console logs:', consoleLogs);

    // Verify that the save button was clicked
    expect(saveButtonLogs.length).toBeGreaterThan(0);
  });
});