import { db } from "../../../db";
import { tblStockBalances, tblInventoryTransactions } from "../../../db/inventory.schema";
import { eq, and } from "drizzle-orm";
import { TRANSACTION_TYPES, ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../constants";

export class StockBalanceService {
  async getStockBalance(itemId: number, warehouseId: number) {
    const [balance] = await db.select().from(tblStockBalances)
      .where(and(
        eq(tblStockBalances.item_id, itemId),
        eq(tblStockBalances.warehouse_id, warehouseId)
      ));
    return balance;
  }

  async reserveStock(itemId: number, warehouseId: number, quantity: number, reference: string) {
    return await db.transaction(async (tx) => {
      const balance = await this.getStockBalance(itemId, warehouseId);
      
      if (!balance) {
        throw new Error(ERROR_MESSAGES.STOCK_BALANCE_NOT_FOUND);
      }
      
      if ((balance.available_quantity ?? 0) < quantity) {
        throw new Error(`${ERROR_MESSAGES.INSUFFICIENT_STOCK}. Available: ${balance.available_quantity ?? 0}, Required: ${quantity}`);
      }

      await tx.update(tblStockBalances)
        .set({
          available_quantity: (balance.available_quantity ?? 0) - quantity,
          reserved_quantity: (balance.reserved_quantity ?? 0) + quantity,
          last_updated: new Date(),
          updated_at: new Date()
        })
        .where(eq(tblStockBalances.id, balance.id));

      await tx.insert(tblInventoryTransactions).values({
        item_id: itemId,
        transaction_type: TRANSACTION_TYPES.RESERVE,
        quantity: -quantity,
        reference,
        notes: `Reserved for ${reference}`,
      });

      return { success: true, message: SUCCESS_MESSAGES.STOCK_RESERVED };
    });
  }

  async releaseReservation(itemId: number, warehouseId: number, quantity: number, reference: string) {
    return await db.transaction(async (tx) => {
      const balance = await this.getStockBalance(itemId, warehouseId);
      
      if (!balance) {
        throw new Error(ERROR_MESSAGES.STOCK_BALANCE_NOT_FOUND);
      }

      await tx.update(tblStockBalances)
        .set({
          available_quantity: (balance.available_quantity ?? 0) + quantity,
          reserved_quantity: Math.max(0, (balance.reserved_quantity ?? 0) - quantity),
          last_updated: new Date(),
          updated_at: new Date()
        })
        .where(eq(tblStockBalances.id, balance.id));

      await tx.insert(tblInventoryTransactions).values({
        item_id: itemId,
        transaction_type: TRANSACTION_TYPES.RELEASE,
        quantity: quantity,
        reference,
        notes: `Released reservation for ${reference}`,
      });

      return { success: true, message: SUCCESS_MESSAGES.RESERVATION_RELEASED };
    });
  }

  async updateStockBalance(itemId: number, warehouseId: number, quantity: number, transactionType: string) {
    return await db.transaction(async (tx) => {
      const existing = await this.getStockBalance(itemId, warehouseId);
      
      if (existing) {
        const newQuantity = transactionType === 'IN' 
          ? (existing.available_quantity ?? 0) + quantity 
          : (existing.available_quantity ?? 0) - quantity;

        if (newQuantity < 0 && transactionType === 'OUT') {
          throw new Error(`${ERROR_MESSAGES.INSUFFICIENT_STOCK}. Available: ${existing.available_quantity ?? 0}, Required: ${quantity}`);
        }

        const [updated] = await tx.update(tblStockBalances)
          .set({
            available_quantity: newQuantity,
            last_updated: new Date(),
            updated_at: new Date()
          })
          .where(eq(tblStockBalances.id, existing.id))
          .returning();
        return updated;
      } else {
        const [created] = await tx.insert(tblStockBalances).values({
          item_id: itemId,
          warehouse_id: warehouseId,
          available_quantity: transactionType === 'IN' ? quantity : 0,
        }).returning();
        return created;
      }
    });
  }

  async syncStockBalances(warehouseId?: number) {
    const transactions = await db.select().from(tblInventoryTransactions);
    
    const balanceMap = new Map();
    
    for (const txn of transactions) {
      const key = `${txn.item_id}-${warehouseId || 1}`;
      const current = balanceMap.get(key) || 0;
      
      if (txn.transaction_type === TRANSACTION_TYPES.STOCK_IN || txn.transaction_type === TRANSACTION_TYPES.GRN) {
        balanceMap.set(key, current + txn.quantity);
      } else if (txn.transaction_type === TRANSACTION_TYPES.STOCK_OUT || txn.transaction_type === TRANSACTION_TYPES.ISSUE) {
        balanceMap.set(key, current - txn.quantity);
      }
    }

    for (const [key, quantity] of balanceMap) {
      const [itemId, whId] = key.split('-').map(Number);
      await this.updateStockBalance(itemId, whId, quantity, TRANSACTION_TYPES.SYNC);
    }

    return { message: SUCCESS_MESSAGES.STOCK_SYNCHRONIZED };
  }
}