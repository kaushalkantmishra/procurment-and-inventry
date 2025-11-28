import { Request, Response } from 'express';
import { db } from '../db';
import { units } from '../db/schema';

export const getAllUnits = async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(units);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch units' });
    }
};

export const createUnit = async (req: Request, res: Response) => {
    try {
        const newUnit = await db.insert(units).values(req.body).returning();
        res.status(201).json(newUnit[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create unit' });
    }
};