import type { FullConfig } from '@playwright/test';
import { TestDatabase } from './test-db';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function globalSetup(_config: FullConfig) {
  console.log('Setting up test environment...');

  try {
    // Stop any existing test containers
    console.log('Cleaning up existing test containers...');
    await execAsync('cd .. && docker compose -f docker-compose.test.yml down').catch(() => {
      // Ignore if containers aren't running
    });

    // Start test environment containers
    console.log('Starting test environment containers...');
    await execAsync('cd .. && docker compose -f docker-compose.test.yml up -d');

    // Wait for services to be ready
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Setup test database with sample data
    await TestDatabase.setup();

    console.log('Test environment setup completed successfully');
  } catch (error) {
    console.error('Failed to setup test environment:', error);
    process.exit(1);
  }
}

export default globalSetup;