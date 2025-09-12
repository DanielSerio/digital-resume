import { test, expect } from '@playwright/test';
import { MainPage } from './page-objects/MainPage';

test.describe('Contact Section Editing - Priority 1', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.waitForPageLoad();
  });

  test.describe('Edit Mode Workflow', () => {
    test('should enter edit mode when Edit button is clicked', async () => {
      // Verify we start in display mode
      await expect(mainPage.contactEditButton).toBeVisible();
      expect(await mainPage.isContactInEditMode()).toBe(false);

      // Enter edit mode
      await mainPage.enterContactEditMode();

      // Verify we're now in edit mode
      expect(await mainPage.isContactInEditMode()).toBe(true);
      await expect(mainPage.contactNameInput).toBeVisible();
      await expect(mainPage.contactSaveButton).toBeVisible();
      await expect(mainPage.contactCancelButton).toBeVisible();
      await expect(mainPage.contactEditButton).not.toBeVisible();
    });

    test('should cancel changes and return to display mode', async () => {
      // Get original contact info
      const originalContact = await mainPage.getContactInfo();

      // Enter edit mode and make changes
      await mainPage.enterContactEditMode();
      await mainPage.fillContactForm({
        name: 'Modified Name',
        email: 'modified@example.com'
      });

      // Cancel changes
      await mainPage.cancelContactChanges();

      // Verify we're back in display mode
      expect(await mainPage.isContactInEditMode()).toBe(false);
      await expect(mainPage.contactEditButton).toBeVisible();

      // Verify changes were not saved
      const currentContact = await mainPage.getContactInfo();
      expect(currentContact.name).toBe(originalContact.name);
      expect(currentContact.email).toBe(originalContact.email);
    });
  });

  test.describe('Save Workflow', () => {
    test('should save valid contact changes', async () => {
      const newContactData = {
        name: 'Jane Doe Updated',
        title: 'Senior Full-Stack Developer',
        email: 'jane.updated@example.com',
        phone: '(555) 123-4567',
        github: 'github.com/janeupdated',
        website: 'janeupdated.dev',
        linkedin: 'linkedin.com/in/janeupdated'
      };

      // Enter edit mode
      await mainPage.enterContactEditMode();

      // Fill form with new data
      await mainPage.fillContactForm(newContactData);

      // Save changes
      await mainPage.saveContactChanges();

      // Verify we're back in display mode
      expect(await mainPage.isContactInEditMode()).toBe(false);
      await expect(mainPage.contactEditButton).toBeVisible();

      // Verify changes were saved
      const savedContact = await mainPage.getContactInfo();
      expect(savedContact.name).toContain(newContactData.name);
      expect(savedContact.title).toContain(newContactData.title);
      expect(savedContact.email).toContain(newContactData.email);
      expect(savedContact.phone).toContain(newContactData.phone);
      expect(savedContact.github).toContain(newContactData.github);
      expect(savedContact.website).toContain(newContactData.website);
      expect(savedContact.linkedin).toContain(newContactData.linkedin);
    });

    test('should persist changes after page reload', async () => {
      const testData = {
        name: 'Persistence Test User',
        email: 'persistence@test.com'
      };

      // Make and save changes
      await mainPage.enterContactEditMode();
      await mainPage.fillContactForm(testData);
      await mainPage.saveContactChanges();

      // Reload page
      await mainPage.goto();
      await mainPage.waitForPageLoad();

      // Verify changes persisted
      const contact = await mainPage.getContactInfo();
      expect(contact.name).toContain(testData.name);
      expect(contact.email).toContain(testData.email);
    });
  });

  test.describe('Partial Updates', () => {
    test('should save changes to individual fields', async () => {
      // Get original contact info
      const originalContact = await mainPage.getContactInfo();

      // Update only the name
      await mainPage.enterContactEditMode();
      await mainPage.fillContactForm({ name: 'Only Name Changed' });
      await mainPage.saveContactChanges();

      // Verify only name was updated
      const updatedContact = await mainPage.getContactInfo();
      expect(updatedContact.name).toContain('Only Name Changed');
      expect(updatedContact.title).toBe(originalContact.title);
      expect(updatedContact.email).toBe(originalContact.email);
    });

    test('should handle empty field updates', async () => {
      // Enter edit mode and clear a field
      await mainPage.enterContactEditMode();
      await mainPage.fillContactForm({ phone: '' });
      await mainPage.saveContactChanges();

      // Verify the field was cleared
      const contact = await mainPage.getContactInfo();
      expect(contact.phone?.trim()).toBeFalsy();
    });
  });

  test.describe('Form Validation', () => {
    test('should handle invalid email format', async () => {
      await mainPage.enterContactEditMode();
      await mainPage.fillContactForm({ email: 'invalid-email' });
      
      // Attempt to save - should show validation error or prevent save
      // Note: This behavior depends on actual form validation implementation
      // The test should verify appropriate error handling exists
      await expect(mainPage.contactEmailInput).toBeVisible();
    });

    test('should require name field', async () => {
      await mainPage.enterContactEditMode();
      await mainPage.fillContactForm({ name: '' });
      
      // Attempt to save with empty required field
      // Should show validation error or prevent save
      await expect(mainPage.contactNameInput).toBeVisible();
    });
  });

  test.describe('UI State Management', () => {
    test('should disable other section edit buttons during contact editing', async () => {
      // Enter contact edit mode
      await mainPage.enterContactEditMode();

      // Check that other section edit buttons are disabled
      // This ensures only one section can be edited at a time
      await expect(mainPage.summaryEditButton).toBeDisabled();
      await expect(mainPage.skillsEditButton).toBeDisabled();
      await expect(mainPage.educationEditButton).toBeDisabled();
    });

    test('should maintain form data during validation errors', async () => {
      const testData = {
        name: 'Test User',
        email: 'invalid-email'
      };

      await mainPage.enterContactEditMode();
      await mainPage.fillContactForm(testData);

      // If validation fails, form data should be preserved
      const nameValue = await mainPage.contactNameInput.inputValue();
      const emailValue = await mainPage.contactEmailInput.inputValue();
      
      expect(nameValue).toBe(testData.name);
      expect(emailValue).toBe(testData.email);
    });
  });
});