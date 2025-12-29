import { db } from './db';
import { 
  tblCategories, 
  tblUnits, 
  tblItems, 
  tblWarehouses, 
  tblVendors,
  users,
  tblModules,
  tblUserModulePermissions
} from './db/schema';
import bcrypt from 'bcrypt';

async function seed() {
    try {
        console.log('Seeding database...');

        // Seed users
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const userData = [
            {
                name: 'Admin User',
                email: 'admin@company.com',
                password: hashedPassword,
                role: 'admin' as const,
                isActive: true
            },
            {
                name: 'Employee User',
                email: 'employee@company.com', 
                password: await bcrypt.hash('employee123', 10),
                role: 'employee' as const,
                isActive: true
            }
        ];

        const insertedUsers = await db.insert(users).values(userData).onConflictDoNothing().returning();
        console.log('Users seeded');

        // Seed modules
        const moduleData = [
            {
                module_code: 'PROCUREMENT',
                module_name: 'Procurement',
                description: 'Purchase orders, requests, and supplier management',
                icon: 'ShoppingCart',
                route_path: '/procurement',
                display_order: 1,
                is_active: true
            },
            {
                module_code: 'INVENTORY',
                module_name: 'Inventory',
                description: 'Items, stock management, and transactions',
                icon: 'Package',
                route_path: '/inventory',
                display_order: 2,
                is_active: true
            },
            {
                module_code: 'MASTERS',
                module_name: 'Masters',
                description: 'Categories, units, warehouses, and vendors',
                icon: 'Settings',
                route_path: '/masters',
                display_order: 3,
                is_active: true
            },
            {
                module_code: 'REPORTS',
                module_name: 'Reports',
                description: 'Analytics and reporting dashboard',
                icon: 'BarChart',
                route_path: '/reports',
                display_order: 4,
                is_active: true
            },
            {
                module_code: 'FINANCE',
                module_name: 'Finance',
                description: 'Accounting, invoicing, and payments',
                icon: 'DollarSign',
                route_path: '/finance',
                display_order: 5,
                is_active: false // Future module
            }
        ];

        const insertedModules = await db.insert(tblModules).values(moduleData).onConflictDoNothing().returning();
        console.log('Modules seeded');

        // Seed user module permissions (Admin gets all, Employee gets limited)
        if (insertedUsers.length > 0 && insertedModules.length > 0) {
            const adminUser = insertedUsers.find(u => u.role === 'admin');
            const employeeUser = insertedUsers.find(u => u.role === 'employee');

            const permissionData = [];

            // Admin permissions - full access to all modules
            if (adminUser) {
                for (const module of insertedModules) {
                    permissionData.push({
                        user_id: adminUser.id,
                        module_id: module.id,
                        can_view: true,
                        can_create: true,
                        can_edit: true,
                        can_delete: true
                    });
                }
            }

            // Employee permissions - limited access
            if (employeeUser) {
                const employeeModules = insertedModules.filter(m => 
                    ['INVENTORY', 'REPORTS'].includes(m.module_code)
                );
                for (const module of employeeModules) {
                    permissionData.push({
                        user_id: employeeUser.id,
                        module_id: module.id,
                        can_view: true,
                        can_create: false,
                        can_edit: false,
                        can_delete: false
                    });
                }
            }

            await db.insert(tblUserModulePermissions).values(permissionData).onConflictDoNothing();
            console.log('User module permissions seeded');
        }

        // Seed units
        const unitData = [
            { unit_id: 'PC', name: 'Piece', abbreviation: 'PC' },
            { unit_id: 'BOX', name: 'Box', abbreviation: 'BOX' },
            { unit_id: 'KG', name: 'Kilogram', abbreviation: 'KG' },
            { unit_id: 'LITER', name: 'Liter', abbreviation: 'L' },
            { unit_id: 'METER', name: 'Meter', abbreviation: 'M' },
        ];

        await db.insert(tblUnits).values(unitData).onConflictDoNothing();
        console.log('Units seeded');

        // Seed categories
        const categoryData = [
            { category_name: 'Electronics', category_code: 'ELEC', description: 'Electronic items and components' },
            { category_name: 'Furniture', category_code: 'FURN', description: 'Office and home furniture' },
            { category_name: 'Supplies', category_code: 'SUPP', description: 'Office and general supplies' },
            { category_name: 'Safety', category_code: 'SAFE', description: 'Safety equipment and gear' },
            { category_name: 'Tools', category_code: 'TOOL', description: 'Tools and equipment' },
        ];

        await db.insert(tblCategories).values(categoryData).onConflictDoNothing();
        console.log('Categories seeded');

        // Seed some sample items
        const itemData = [
            {
                sku: 'LAPTOP001',
                item_name: 'Business Laptop',
                category_id: 1,
                unit_of_measure: 'PC',
                unit_cost: '800.00',
                selling_price: '999.99',
                vendor_code: 'VENDOR001',
                reorder_level: 5,
                safety_stock: 10,
                lead_time_days: 7,
                batch_tracking: false,
                is_active: true,
                discount_allowed: true,
                discount_rate: '5.00'
            },
            {
                sku: 'DESK001',
                item_name: 'Office Desk',
                category_id: 2,
                unit_of_measure: 'PC',
                unit_cost: '200.00',
                selling_price: '299.99',
                vendor_code: 'VENDOR002',
                reorder_level: 3,
                safety_stock: 5,
                lead_time_days: 14,
                batch_tracking: false,
                is_active: true,
                discount_allowed: false,
                discount_rate: '0.00'
            }
        ];

        await db.insert(tblItems).values(itemData).onConflictDoNothing();
        console.log('Items seeded');

        // Seed warehouses
        const warehouseData = [
            {
                warehouse_code: 'WH001',
                warehouse_name: 'Main Warehouse',
                street_address: '123 Industrial Ave',
                city: 'New York',
                country_code: 'US',
                is_active: true,
                date_opened: '2020-01-01'
            },
            {
                warehouse_code: 'WH002',
                warehouse_name: 'Secondary Warehouse',
                street_address: '456 Storage Blvd',
                city: 'Los Angeles',
                country_code: 'US',
                is_active: true,
                date_opened: '2021-06-15'
            }
        ];

        await db.insert(tblWarehouses).values(warehouseData).onConflictDoNothing();
        console.log('Warehouses seeded');

        // Seed vendors
        const vendorData = [
            {
                vendor_code: 'VEN001',
                vendor_name: 'Global Supply Co.',
                contact_person: 'John Smith',
                email: 'john@globalsupply.com',
                phone: '+1-555-0101',
                address: '123 Business Ave',
                city: 'New York',
                country: 'USA',
                payment_terms: 'net-30',
                is_active: true
            },
            {
                vendor_code: 'VEN002',
                vendor_name: 'Tech Hardware Ltd.',
                contact_person: 'Sarah Johnson',
                email: 'sarah@techhardware.com',
                phone: '+1-555-0102',
                address: '456 Tech Street',
                city: 'San Francisco',
                country: 'USA',
                payment_terms: 'net-60',
                is_active: true
            }
        ];

        await db.insert(tblVendors).values(vendorData).onConflictDoNothing();
        console.log('Vendors seeded');

        console.log('Database seeded successfully!');
        console.log('\nLogin credentials:');
        console.log('Admin: admin@company.com / admin123');
        console.log('Employee: employee@company.com / employee123');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seed();