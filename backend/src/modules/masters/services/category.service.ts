import { db } from "../../../db/index";
import { tblCategories } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { CreateCategoryRequest, UpdateCategoryRequest } from '../types';

export class CategoryService {
  async getAllCategories() {
    return await db
      .select()
      .from(tblCategories)
      .where(eq(tblCategories.is_deleted, false));
  }

  async createCategory(categoryData: CreateCategoryRequest) {
    const [newCategory] = await db
      .insert(tblCategories)
      .values(categoryData)
      .returning();
    return newCategory;
  }

  async getCategoryById(id: number) {
    const [category] = await db
      .select()
      .from(tblCategories)
      .where(and(eq(tblCategories.id, id), eq(tblCategories.is_deleted, false)));
    if (!category) throw new Error("Category not found");
    return category;
  }

  async updateCategory(id: number, categoryData: UpdateCategoryRequest) {
    const [updatedCategory] = await db
      .update(tblCategories)
      .set({ ...categoryData, updated_at: new Date() })
      .where(eq(tblCategories.id, id))
      .returning();
    if (!updatedCategory) throw new Error("Category not found");
    return updatedCategory;
  }

  async deleteCategory(id: number) {
    const [deletedCategory] = await db
      .update(tblCategories)
      .set({ is_deleted: true, deleted_at: new Date(), updated_at: new Date() })
      .where(eq(tblCategories.id, id))
      .returning();
    if (!deletedCategory) throw new Error("Category not found");
    return deletedCategory;
  }
}