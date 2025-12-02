import { Request, Response } from 'express';
import { db } from '../db';
import { items, categories, units } from '../db/schema';
import { eq } from 'drizzle-orm';

export const getAllItems = async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(items);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

export const createItem = async (req: Request, res: Response) => {
    try {
        const itemData = { ...req.body };
        
        // Transform SKU to uppercase alphanumeric only
        if (itemData.sku) {
            itemData.sku = itemData.sku.toString().replace(/[^A-Z0-9]/g, '').toUpperCase();
            if (!itemData.sku) {
                return res.status(400).json({ error: 'SKU must contain at least one alphanumeric character' });
            }
        }
        
        // Convert string numbers to proper types
        if (itemData.categoryId) {
            itemData.categoryId = parseInt(itemData.categoryId);
        }
        if (itemData.reorderLevel) {
            itemData.reorderLevel = parseInt(itemData.reorderLevel);
        }
        if (itemData.safetyStock) {
            itemData.safetyStock = parseInt(itemData.safetyStock);
        }
        if (itemData.leadTimeDays) {
            itemData.leadTimeDays = parseInt(itemData.leadTimeDays);
        }
        
        console.log('Creating item with data:', itemData);
        const newItem = await db.insert(items).values(itemData).returning();
        res.status(201).json(newItem[0]);
    } catch (error: any) {
        console.error('Detailed item error:', error);
        if (error.code === '23503') {
            return res.status(400).json({ error: 'Invalid category or unit reference' });
        }
        if (error.code === '23505') {
            return res.status(400).json({ error: 'SKU already exists' });
        }
        if (error.code === '23514') {
            return res.status(400).json({ error: 'SKU must be uppercase alphanumeric only' });
        }
        res.status(500).json({ error: error.message || 'Failed to create item' });
    }
};

export const getItemById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await db.select().from(items).where(eq(items.id, Number(id)));
        if (result.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch item' });
    }
};
