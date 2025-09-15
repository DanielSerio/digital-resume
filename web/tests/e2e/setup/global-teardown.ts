import type { FullConfig } from '@playwright/test';
import { TestDatabase } from './test-db';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function globalTeardown(_config: FullConfig) {
  console.log('Tearing down test environment...');

  try {
    // Cleanup test database
    await TestDatabase.cleanup();

    // Stop test containers
    console.log('Stopping test containers...');
    await execAsync('cd .. && docker compose -f docker-compose.test.yml down').catch((error) => {
      console.warn('Failed to stop test containers:', error.message);
    });

    console.log('Test environment teardown completed successfully');
    console.log('Development containers remain running on docker-compose.yml');
  } catch (error) {
    console.error('Failed to teardown test environment:', error);
  }
}

export default globalTeardown;