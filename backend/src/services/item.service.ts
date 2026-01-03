import { db } from '../db';
import { tblItems } from '../db/schema';
import { eq } from 'drizzle-orm';

export class ItemService {
  async getAllItems() {
    return await db.select().from(tblItems).where(eq(tblItems.is_deleted, false));
  }

  async createItem(itemData: any) {
    if (itemData.sku) {
      itemData.sku = itemData.sku.toString().replace(/[^A-Z0-9]/g, '').toUpperCase();
      if (!itemData.sku) {
        throw new Error('SKU must contain at least one alphanumeric character');
      }
    }

    if (itemData.category_id) itemData.category_id = parseInt(itemData.category_id);
    if (itemData.reorder_level) itemData.reorder_level = parseInt(itemData.reorder_level);
    if (itemData.safety_stock) itemData.safety_stock = parseInt(itemData.safety_stock);
    if (itemData.lead_time_days) itemData.lead_time_days = parseInt(itemData.lead_time_days);

    const [newItem] = await db.insert(tblItems).values(itemData).returning();
    return newItem;
  }

  async getItemById(id: number) {
    const [item] = await db.select().from(tblItems).where(eq(tblItems.id, id));
    if (!item) throw new Error('Item not found');
    return item;
  }

  async updateItem(id: number, itemData: any) {
    if (itemData.sku) {
      itemData.sku = itemData.sku.toString().replace(/[^A-Z0-9]/g, '').toUpperCase();
      if (!itemData.sku) {
        throw new Error('SKU must contain at least one alphanumeric character');
      }
    }

    if (itemData.category_id) itemData.category_id = parseInt(itemData.category_id);
    if (itemData.reorder_level) itemData.reorder_level = parseInt(itemData.reorder_level);
    if (itemData.safety_stock) itemData.safety_stock = parseInt(itemData.safety_stock);
    if (itemData.lead_time_days) itemData.lead_time_days = parseInt(itemData.lead_time_days);

    const [updatedItem] = await db.update(tblItems)
      .set({ ...itemData, updated_at: new Date() })
      .where(eq(tblItems.id, id))
      .returning();
    if (!updatedItem) throw new Error('Item not found');
    return updatedItem;
  }

  async deleteItem(id: number) {
    const [deletedItem] = await db.update(tblItems)
      .set({ is_deleted: true, deleted_at: new Date(), updated_at: new Date() })
      .where(eq(tblItems.id, id))
      .returning();
    if (!deletedItem) throw new Error('Item not found');
    return deletedItem;
  }
}
