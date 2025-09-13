import type { FullConfig } from '@playwright/test';
import { TestDatabase } from './test-db';

async function globalTeardown(_config: FullConfig) {
  console.log('Tearing down test environment...');
  
  try {
    // Cleanup test database
    await TestDatabase.cleanup();
    
    console.log('Test environment teardown completed successfully');
  } catch (error) {
    console.error('Failed to teardown test environment:', error);
  }
}

export default globalTeardown;