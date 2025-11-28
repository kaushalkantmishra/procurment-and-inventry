import { Request, Response } from 'express';
import { db } from '../db';
import { items, inventoryTransactions } from '../db/schema';
import { eq } from 'drizzle-orm';

export const stockIn = async (req: Request, res: Response) => {
    try {
        const { itemId, quantity, reference, notes } = req.body;
        
        // Get current stock
        const [currentItem] = await db.select().from(items).where(eq(items.itemId, itemId));
        if (!currentItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const newStock = (currentItem.safetyStock || 0) + quantity;
        
        // Update item stock
        const [updatedItem] = await db
            .update(items)
            .set({ safetyStock: newStock })
            .where(eq(items.itemId, itemId))
            .returning();

        // Log transaction
        await db.insert(inventoryTransactions).values({
            itemId,
            transactionType: 'stock-in',
            quantity,
            reference,
            notes,
            performedBy: 'System User'
        });

        res.json({ 
            success: true, 
            message: 'Stock updated successfully',
            item: updatedItem 
        });
    } catch (error) {
        console.error('Stock in error:', error);
        res.status(500).json({ error: 'Failed to update stock' });
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const result = await db.query.inventoryTransactions.findMany({
            with: {
                item: true,
            },
            orderBy: (transactions, { desc }) => [desc(transactions.transactionDate)]
        });
        res.json(result);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

export const stockOut = async (req: Request, res: Response) => {
    try {
        const { itemId, quantity, reference, notes } = req.body;
        
        // Get current stock
        const [currentItem] = await db.select().from(items).where(eq(items.itemId, itemId));
        if (!currentItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const newStock = (currentItem.safetyStock || 0) - quantity;
        if (newStock < 0) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        // Update item stock
        const [updatedItem] = await db
            .update(items)
            .set({ safetyStock: newStock })
            .where(eq(items.itemId, itemId))
            .returning();

        // Log transaction
        await db.insert(inventoryTransactions).values({
            itemId,
            transactionType: 'stock-out',
            quantity,
            reference,
            notes,
            performedBy: 'System User'
        });

        res.json({ 
            success: true, 
            message: 'Stock updated successfully',
            item: updatedItem 
        });
    } catch (error) {
        console.error('Stock out error:', error);
        res.status(500).json({ error: 'Failed to update stock' });
    }
};