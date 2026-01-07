import { db } from "../../../db";
import { tblInventoryTransactions } from "../../../db/schema";
import { eq } from "drizzle-orm";

export class InventoryTransactionService {
  
  async stockIn(data: {
    item_id: number;
    quantity: number;
    reference_type: string;
    reference_id: number;
    reference_number: string;
    unit_cost?: number;
    notes?: string;
    created_by?: string;
  }) {
    try {
      const [transaction] = await db.insert(tblInventoryTransactions).values({
        item_id: data.item_id,
        transaction_type: 'STOCK_IN',
        quantity: data.quantity,
        reference: data.reference_number,
        notes: data.notes || '',
        performed_by: data.created_by || 'SYSTEM',
        transaction_date: new Date()
      }).returning();

      return transaction;
    } catch (error) {
      throw new Error('Failed to process stock in transaction');
    }
  }

  async stockOut(data: {
    item_id: number;
    quantity: number;
    reference_type: string;
    reference_id: number;
    reference_number: string;
    unit_cost?: number;
    notes?: string;
    created_by?: string;
  }) {
    try {
      const [transaction] = await db.insert(tblInventoryTransactions).values({
        item_id: data.item_id,
        transaction_type: 'STOCK_OUT',
        quantity: -Math.abs(data.quantity),
        reference: data.reference_number,
        notes: data.notes || '',
        performed_by: data.created_by || 'SYSTEM',
        transaction_date: new Date()
      }).returning();

      return transaction;
    } catch (error) {
      throw new Error('Failed to process stock out transaction');
    }
  }

  async getAll() {
    return await db.select().from(tblInventoryTransactions)
      .orderBy(tblInventoryTransactions.transaction_date);
  }

  async getByItem(itemId: number) {
    return await db.select().from(tblInventoryTransactions)
      .where(eq(tblInventoryTransactions.item_id, itemId))
      .orderBy(tblInventoryTransactions.transaction_date);
  }

  async getCurrentStock(itemId: number, warehouseId: number = 1) {
    const transactions = await db.select().from(tblInventoryTransactions)
      .where(eq(tblInventoryTransactions.item_id, itemId));
    
    const totalStock = transactions.reduce((sum, transaction) => {
      return sum + (transaction.quantity || 0);
    }, 0);

    return { item_id: itemId, current_stock: totalStock };
  }
}