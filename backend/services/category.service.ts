import { db } from '../src/db';
import { tblCategories } from '../src/db/schema';
import { eq } from 'drizzle-orm';

export class CategoryService {
  async getAllCategories() {
    return await db.select().from(tblCategories).where(eq(tblCategories.is_deleted, false));
  }

  async createCategory(categoryData: any) {
    const [newCategory] = await db.insert(tblCategories).values(categoryData).returning();
    return newCategory;
  }
}
