import { Request, Response } from 'express';
import { db } from '../db';
import { categories } from '../db/schema';

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(categories);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const newCategory = await db.insert(categories).values(req.body).returning();
        res.status(201).json(newCategory[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};