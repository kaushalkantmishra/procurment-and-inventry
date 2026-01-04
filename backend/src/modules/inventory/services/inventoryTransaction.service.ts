import { db } from "../../../db";
import { tblInventoryTransactions } from "../../../db/schema";
import { eq, and } from "drizzle-orm";

export class InventoryTransactionService {
  async getAll() {
    return await db
      .select()
      .from(tblInventoryTransactions)
      .where(eq(tblInventoryTransactions.is_deleted, false));
  }

  async getById(id: number) {
    const [transaction] = await db
      .select()
      .from(tblInventoryTransactions)
      .where(
        and(
          eq(tblInventoryTransactions.id, id),
          eq(tblInventoryTransactions.is_deleted, false)
        )
      );
    if (!transaction) {
      throw new Error("Inventory transaction not found");
    }
    return transaction;
  }

  async create(data: any) {
    const [transaction] = await db
      .insert(tblInventoryTransactions)
      .values(data)
      .returning();
    return transaction;
  }

  async stockIn(data: any) {
    const transactionData = {
      ...data,
      transaction_type: "IN",
      quantity: Math.abs(data.quantity),
    };
    const [transaction] = await db
      .insert(tblInventoryTransactions)
      .values(transactionData)
      .returning();
    return transaction;
  }

  async stockOut(data: any) {
    const transactionData = {
      ...data,
      transaction_type: "OUT",
      quantity: -Math.abs(data.quantity),
    };
    const [transaction] = await db
      .insert(tblInventoryTransactions)
      .values(transactionData)
      .returning();
    return transaction;
  }
}
