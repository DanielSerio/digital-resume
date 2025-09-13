import { test } from './fixtures/database';

test.describe('Debug Page Elements', () => {
  test('should show actual page content', async ({ page }) => {
    await page.goto('http://localhost:3000/main');
    await page.waitForTimeout(5000); // Wait for page to load
    
    // Take a screenshot to see what's actually on the page
    await page.screenshot({ path: 'debug-page.png', fullPage: true });
    
    // Log the page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Log all visible text on the page
    const bodyText = await page.locator('body').textContent();
    console.log('Page content:', bodyText);
    
    // Check if page loaded at all
    const html = await page.locator('html').innerHTML();
    console.log('HTML length:', html.length);
    
    // Look for common elements that might exist
    const h1Elements = await page.locator('h1').count();
    console.log('Number of h1 elements:', h1Elements);
    
    if (h1Elements > 0) {
      const h1Text = await page.locator('h1').first().textContent();
      console.log('First h1 text:', h1Text);
    }
  });
});