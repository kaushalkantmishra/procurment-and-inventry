import { db } from '../src/db';
import { tblItems, tblInventoryTransactions } from '../src/db/schema';
import { eq } from 'drizzle-orm';

export class InventoryService {
  async stockIn(data: any) {
    const { itemId, quantity, reference, notes } = data;

    const [currentItem] = await db.select().from(tblItems).where(eq(tblItems.id, itemId));
    if (!currentItem) throw new Error('Item not found');

    const newStock = (currentItem.safety_stock || 0) + quantity;

    const [updatedItem] = await db
      .update(tblItems)
      .set({ safety_stock: newStock })
      .where(eq(tblItems.id, itemId))
      .returning();

    await db.insert(tblInventoryTransactions).values({
      item_id: itemId,
      transaction_type: 'stock-in',
      quantity,
      reference,
      notes,
      performed_by: 'System User',
    });

    return { success: true, message: 'Stock updated successfully', item: updatedItem };
  }

  async stockOut(data: any) {
    const { itemId, quantity, reference, notes } = data;

    const [currentItem] = await db.select().from(tblItems).where(eq(tblItems.id, itemId));
    if (!currentItem) throw new Error('Item not found');

    const newStock = (currentItem.safety_stock || 0) - quantity;
    if (newStock < 0) throw new Error('Insufficient stock');

    const [updatedItem] = await db
      .update(tblItems)
      .set({ safety_stock: newStock })
      .where(eq(tblItems.id, itemId))
      .returning();

    await db.insert(tblInventoryTransactions).values({
      item_id: itemId,
      transaction_type: 'stock-out',
      quantity,
      reference,
      notes,
      performed_by: 'System User',
    });

    return { success: true, message: 'Stock updated successfully', item: updatedItem };
  }

  async getTransactions() {
    return await db.query.tblInventoryTransactions.findMany({
      with: { item: true },
      orderBy: (transactions, { desc }) => [desc(transactions.transaction_date)],
    });
  }
}
