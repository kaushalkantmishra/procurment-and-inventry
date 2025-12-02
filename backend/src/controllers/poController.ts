import { Request, Response } from 'express';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { tblPoLines, tblPurchaseOrders } from '../db/schema';

export const createPO = async (req: Request, res: Response) => {
    try {
        const { lines, ...poData } = req.body;

        // Transactional insert would be better here
        const newPO = await db.transaction(async (tx) => {
            const [po] = await tx.insert(tblPurchaseOrders).values(poData).returning();

            if (lines && lines.length > 0) {
                const linesWithPoId = lines.map((line: any) => ({ ...line, poId: po.id }));
                await tx.insert(tblPoLines).values(linesWithPoId);
            }
            return po;
        });

        res.status(201).json(newPO);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create PO' });
    }
};

export const getAllPOs = async (req: Request, res: Response) => {
    try {
        const result = await db.query.tblPurchaseOrders.findMany({
            with: {
                lines: true,
            }
        });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch POs' });
    }
};
