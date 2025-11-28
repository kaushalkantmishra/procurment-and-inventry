import { Request, Response } from 'express';
import { db } from '../db';
import { warehouses } from '../db/schema';

export const getAllWarehouses = async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(warehouses);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch warehouses' });
    }
};

export const createWarehouse = async (req: Request, res: Response) => {
    try {
        console.log('Creating warehouse with data:', req.body);
        const newWarehouse = await db.insert(warehouses).values(req.body).returning();
        res.status(201).json(newWarehouse[0]);
    } catch (error: any) {
        console.error('Detailed warehouse error:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Warehouse code already exists' });
        }
        res.status(500).json({ error: error.message || 'Failed to create warehouse' });
    }
};