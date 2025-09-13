import { test as base } from '@playwright/test';
import { TestDatabase } from '../setup/test-db';

// Extend the base test with database fixtures
export const test = base.extend<{
  cleanDatabase: void;
}>({
  cleanDatabase: [async ({}, use) => {
    // Reset database to clean state before each test
    await TestDatabase.reset();

    // Run the test
    await use();

    // Optionally cleanup after test (if needed)
    // await TestDatabase.reset();
  }, { auto: true }],
});

export { expect } from '@playwright/test';