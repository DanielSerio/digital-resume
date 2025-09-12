import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export class TestDatabase {
  private static testDbPath = path.join(process.cwd(), '..', 'test.db');

  /**
   * Setup test database with fresh sample data
   */
  static async setup(): Promise<void> {
    try {
      // Change to backend directory and setup test database
      const backendDir = path.join(process.cwd(), '..', 'server');
      
      // Set test database URL
      process.env.DATABASE_URL = `file:${this.testDbPath}`;
      
      // Run database migration and seed with sample data
      const testEnv = { ...process.env, DATABASE_URL: `file:${this.testDbPath}` };
      await execAsync(`npx prisma db push --force-reset`, { cwd: backendDir, env: testEnv });
      await execAsync(`npx prisma db seed`, { cwd: backendDir, env: testEnv });
      
      console.log('Test database setup completed');
    } catch (error) {
      console.error('Failed to setup test database:', error);
      throw error;
    }
  }

  /**
   * Cleanup test database
   */
  static async cleanup(): Promise<void> {
    try {
      // Remove test database file
      const fs = await import('fs/promises');
      await fs.unlink(this.testDbPath).catch(() => {}); // Ignore if file doesn't exist
      
      console.log('Test database cleanup completed');
    } catch (error) {
      console.error('Failed to cleanup test database:', error);
      throw error;
    }
  }

  /**
   * Reset test database to fresh state
   */
  static async reset(): Promise<void> {
    await this.cleanup();
    await this.setup();
  }
}