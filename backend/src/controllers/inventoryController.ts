import { Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { items, tblInventoryTransactions } from "../db/schema";

export const stockIn = async (req: Request, res: Response) => {
  try {
    const { itemId, quantity, reference, notes } = req.body;

    // Get current stock
    const [currentItem] = await db
      .select()
      .from(items)
      .where(eq(items.id, itemId));
    if (!currentItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    const newStock = (currentItem.safety_stock || 0) + quantity;

    // Update item stock
    const [updatedItem] = await db
      .update(items)
      .set({ safety_stock: newStock })
      .where(eq(items.id, itemId))
      .returning();

    // Log transaction
    await db.insert(tblInventoryTransactions).values({
      item_id: itemId,
      transaction_type: "stock-in",
      quantity,
      reference,
      notes,
      performed_by: "System User",
    });

    res.json({
      success: true,
      message: "Stock updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Stock in error:", error);
    res.status(500).json({ error: "Failed to update stock" });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const result = await db.query.tblInventoryTransactions.findMany({
      with: {
        item: true,
      },
      orderBy: (transactions, { desc }) => [desc(transactions.transaction_date)],
    });
    res.json(result);
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

export const stockOut = async (req: Request, res: Response) => {
  try {
    const { itemId, quantity, reference, notes } = req.body;

    // Get current stock
    const [currentItem] = await db
      .select()
      .from(items)
      .where(eq(items.id, itemId));
    if (!currentItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    const newStock = (currentItem.safety_stock || 0) - quantity;
    if (newStock < 0) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    // Update item stock
    const [updatedItem] = await db
      .update(items)
      .set({ safety_stock: newStock })
      .where(eq(items.id, itemId))
      .returning();

    // Log transaction
    await db.insert(tblInventoryTransactions).values({
      item_id: itemId,
      transaction_type: "stock-out",
      quantity,
      reference,
      notes,
      performed_by: "System User",
    });

    res.json({
      success: true,
      message: "Stock updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Stock out error:", error);
    res.status(500).json({ error: "Failed to update stock" });
  }
};
