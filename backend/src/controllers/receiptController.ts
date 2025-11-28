import { Request, Response } from 'express';
import { db } from '../db';
import { receiptHeaders, receiptLines, payments } from '../db/schema';

export const createReceipt = async (req: Request, res: Response) => {
    try {
        const { lines, payments: paymentData, ...receiptData } = req.body;

        const newReceipt = await db.transaction(async (tx) => {
            const [receipt] = await tx.insert(receiptHeaders).values(receiptData).returning();

            if (lines && lines.length > 0) {
                const linesWithReceiptId = lines.map((line: any) => ({ ...line, receiptId: receipt.receiptId }));
                await tx.insert(receiptLines).values(linesWithReceiptId);
            }

            if (paymentData && paymentData.length > 0) {
                const paymentsWithReceiptId = paymentData.map((payment: any) => ({ ...payment, receiptId: receipt.receiptId }));
                await tx.insert(payments).values(paymentsWithReceiptId);
            }

            return receipt;
        });

        res.status(201).json(newReceipt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create receipt' });
    }
};

export const getAllReceipts = async (req: Request, res: Response) => {
    try {
        const result = await db.query.receiptHeaders.findMany({
            with: {
                lines: true,
                payments: true,
            }
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch receipts' });
    }
};
