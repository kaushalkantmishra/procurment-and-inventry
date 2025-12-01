import { Request, Response } from 'express';
import { db } from '../db';
import { tblReceiptHeaders, tblReceiptLines, tblPayments } from '../db/schema';

export const createReceipt = async (req: Request, res: Response) => {
    try {
        const { lines, payments: paymentData, ...receiptData } = req.body;

        const newReceipt = await db.transaction(async (tx) => {
            const [receipt] = await tx.insert(tblReceiptHeaders).values(receiptData).returning();

            if (lines && lines.length > 0) {
                const linesWithReceiptId = lines.map((line: any) => ({ ...line, receipt_id: receipt.id }));
                await tx.insert(tblReceiptLines).values(linesWithReceiptId);
            }

            if (paymentData && paymentData.length > 0) {
                const paymentsWithReceiptId = paymentData.map((payment: any) => ({ ...payment, receipt_id: receipt.id }));
                await tx.insert(tblPayments).values(paymentsWithReceiptId);
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
        const result = await db.query.tblReceiptHeaders.findMany({
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
