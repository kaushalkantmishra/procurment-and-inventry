import { Request, Response } from 'express';
import { db } from '../db';
import { vendors } from '../db/schema';

export const getAllVendors = async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(vendors);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vendors' });
    }
};

export const createVendor = async (req: Request, res: Response) => {
    try {
        const vendorData = { ...req.body };
        
        // Validate and truncate fields to match database constraints
        if (vendorData.vendorCode) {
            vendorData.vendorCode = vendorData.vendorCode.substring(0, 50);
        }
        if (vendorData.vendorName) {
            vendorData.vendorName = vendorData.vendorName.substring(0, 200);
        }
        if (vendorData.contactPerson) {
            vendorData.contactPerson = vendorData.contactPerson.substring(0, 100);
        }
        if (vendorData.email) {
            vendorData.email = vendorData.email.substring(0, 100);
        }
        if (vendorData.phone) {
            vendorData.phone = vendorData.phone.substring(0, 20);
        }
        if (vendorData.city) {
            vendorData.city = vendorData.city.substring(0, 100);
        }
        if (vendorData.country) {
            vendorData.country = vendorData.country.substring(0, 100);
        }
        if (vendorData.paymentTerms) {
            vendorData.paymentTerms = vendorData.paymentTerms.substring(0, 50);
        }
        
        console.log('Creating vendor with data:', vendorData);
        const newVendor = await db.insert(vendors).values(vendorData).returning();
        res.status(201).json(newVendor[0]);
    } catch (error: any) {
        console.error('Detailed vendor error:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Vendor code already exists' });
        }
        res.status(500).json({ error: error.message || 'Failed to create vendor' });
    }
};