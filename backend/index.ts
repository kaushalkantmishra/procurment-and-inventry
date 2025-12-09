import { db } from './src/db';

export const initBackend = async (): Promise<void> => {
  try {
    console.log('Initializing backend...');
    await db.execute('SELECT 1');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Failed to initialize backend:', error);
    throw error;
  }
};

export { db };
