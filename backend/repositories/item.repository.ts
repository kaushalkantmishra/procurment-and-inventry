import { db } from '../src/db';
import { tblItems } from '../src/db/schema';
import { eq } from 'drizzle-orm';

export class ItemRepository {
  async findAll() {
    return await db.select().from(tblItems).where(eq(tblItems.is_deleted, false));
  }

  async findById(id: number) {
    const [item] = await db.select().from(tblItems).where(eq(tblItems.id, id));
    return item;
  }

  async create(itemData: any) {
    const [newItem] = await db.insert(tblItems).values(itemData).returning();
    return newItem;
  }
}
