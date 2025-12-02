import { Request, Response } from 'express';
import { db } from '../db';
import { tblGrnDetails, tblGrnHeaders } from '../db/schema';

export const createGRN = async (req: Request, res: Response) => {
    try {
        const { details, ...grnData } = req.body;

        const newGRN = await db.transaction(async (tx) => {
            const [grn] = await tx.insert(tblGrnHeaders).values(grnData).returning();

            if (details && details.length > 0) {
                const detailsWithGrnId = details.map((detail: any) => ({ ...detail, grnId: grn.id }));
                await tx.insert(tblGrnDetails).values(detailsWithGrnId);
            }
            return grn;
        });

        res.status(201).json(newGRN);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create GRN' });
    }
};

export const getAllGRNs = async (req: Request, res: Response) => {
    try {
        const result = await db.query.tblGrnHeaders.findMany({
            with: {
                details: true,
            }
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch GRNs' });
    }
};
