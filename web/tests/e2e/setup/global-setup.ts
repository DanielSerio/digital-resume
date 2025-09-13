import type { FullConfig } from '@playwright/test';
import { TestDatabase } from './test-db';

async function globalSetup(_config: FullConfig) {
  console.log('Setting up test environment...');
  
  try {
    // Setup test database with sample data
    await TestDatabase.setup();
    
    console.log('Test environment setup completed successfully');
  } catch (error) {
    console.error('Failed to setup test environment:', error);
    process.exit(1);
  }
}

export default globalSetup;