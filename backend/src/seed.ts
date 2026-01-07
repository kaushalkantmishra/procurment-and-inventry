import { db } from './db';
import { 
  tblCategories, 
  tblUnits, 
  tblItems, 
  tblWarehouses, 
  tblVendors,
  tblUsers,
  tblRoles,
  tblUserRoles,
  tblModules,
  tblUserModulePermissions,
  tblApprovalWorkflows,
  tblApprovalLevels,
  tblSystemEnums,
  tblDocumentSequences
} from './db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

async function seed() {
    try {
        console.log('Seeding database...');

        // Seed roles first
        const roleData = [
            { role_code: 'ADMIN', role_name: 'Administrator', description: 'System administrator with full access' },
            { role_code: 'REQUESTER', role_name: 'Requester', description: 'Can create purchase requests' },
            { role_code: 'APPROVER', role_name: 'Approver', description: 'Can approve requests and orders' },
            { role_code: 'PROCUREMENT', role_name: 'Procurement', description: 'Manages procurement processes' },
            { role_code: 'STORE', role_name: 'Store', description: 'Manages inventory and store operations' },
            { role_code: 'FINANCE', role_name: 'Finance', description: 'Handles financial operations' }
        ];

        const insertedRoles = await db.insert(tblRoles).values(roleData).onConflictDoNothing().returning();
        console.log('Roles seeded');

        // Seed users
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const userData = [
            {
                name: 'Admin User',
                email: 'admin@company.com',
                password_hash: hashedPassword,
                is_active: true
            },
            {
                name: 'Requester User',
                email: 'requester@company.com', 
                password_hash: await bcrypt.hash('requester123', 10),
                is_active: true
            },
            {
                name: 'Approver User',
                email: 'approver@company.com', 
                password_hash: await bcrypt.hash('approver123', 10),
                is_active: true
            },
            {
                name: 'Procurement User',
                email: 'procurement@company.com', 
                password_hash: await bcrypt.hash('procurement123', 10),
                is_active: true
            },
            {
                name: 'Store User',
                email: 'store@company.com', 
                password_hash: await bcrypt.hash('store123', 10),
                is_active: true
            },
            {
                name: 'Finance User',
                email: 'finance@company.com', 
                password_hash: await bcrypt.hash('finance123', 10),
                is_active: true
            }
        ];

        const insertedUsers = await db.insert(tblUsers).values(userData).onConflictDoNothing().returning();
        console.log('Users seeded');

        // Assign roles to users
        if (insertedUsers.length > 0 && insertedRoles.length > 0) {
            const userRoleData = [
                { user_id: insertedUsers[0].id, role_id: insertedRoles.find(r => r.role_code === 'ADMIN')!.id, is_primary: true },
                { user_id: insertedUsers[1].id, role_id: insertedRoles.find(r => r.role_code === 'REQUESTER')!.id, is_primary: true },
                { user_id: insertedUsers[2].id, role_id: insertedRoles.find(r => r.role_code === 'APPROVER')!.id, is_primary: true },
                { user_id: insertedUsers[3].id, role_id: insertedRoles.find(r => r.role_code === 'PROCUREMENT')!.id, is_primary: true },
                { user_id: insertedUsers[4].id, role_id: insertedRoles.find(r => r.role_code === 'STORE')!.id, is_primary: true },
                { user_id: insertedUsers[5].id, role_id: insertedRoles.find(r => r.role_code === 'FINANCE')!.id, is_primary: true }
            ];

            await db.insert(tblUserRoles).values(userRoleData).onConflictDoNothing();
            console.log('User roles assigned');
        }

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

        // Seed user module permissions (Admin gets all, others get role-specific)
        if (insertedUsers.length > 0 && insertedModules.length > 0) {
            const adminUser = insertedUsers[0]; // Admin user
            const permissionData = [];

            // Admin permissions - full access to all modules
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

            // Other users get limited permissions based on their roles
            const otherUsers = insertedUsers.slice(1);
            for (const user of otherUsers) {
                const userRole = await db.select().from(tblUserRoles).where(eq(tblUserRoles.user_id, user.id)).limit(1);
                if (userRole.length > 0) {
                    const role = await db.select().from(tblRoles).where(eq(tblRoles.id, userRole[0].role_id)).limit(1);
                    if (role.length > 0) {
                        const roleCode = role[0].role_code;
                        
                        // Role-specific module access
                        let allowedModules: string[] = [];
                        switch (roleCode) {
                            case 'REQUESTER':
                                allowedModules = ['PROCUREMENT', 'INVENTORY'];
                                break;
                            case 'APPROVER':
                                allowedModules = ['PROCUREMENT', 'REPORTS'];
                                break;
                            case 'PROCUREMENT':
                                allowedModules = ['PROCUREMENT', 'INVENTORY', 'MASTERS'];
                                break;
                            case 'STORE':
                                allowedModules = ['INVENTORY', 'MASTERS'];
                                break;
                            case 'FINANCE':
                                allowedModules = ['FINANCE', 'REPORTS'];
                                break;
                        }

                        const userModules = insertedModules.filter(m => allowedModules.includes(m.module_code));
                        for (const module of userModules) {
                            permissionData.push({
                                user_id: user.id,
                                module_id: module.id,
                                can_view: true,
                                can_create: roleCode === 'PROCUREMENT' || roleCode === 'STORE',
                                can_edit: roleCode === 'PROCUREMENT' || roleCode === 'STORE',
                                can_delete: false
                            });
                        }
                    }
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

        // Seed Approval Workflows
        const workflowData = [
            {
                workflow_code: "PO_APPROVAL",
                workflow_name: "Purchase Order Approval",
                document_type: "PO",
                is_active: true,
            },
            {
                workflow_code: "PR_APPROVAL", 
                workflow_name: "Purchase Request Approval",
                document_type: "PR",
                is_active: true,
            },
            {
                workflow_code: "INVOICE_APPROVAL",
                workflow_name: "Invoice Approval",
                document_type: "INVOICE", 
                is_active: true,
            }
        ];

        const insertedWorkflows = await db.insert(tblApprovalWorkflows).values(workflowData).onConflictDoNothing().returning();
        console.log('Approval workflows seeded');

        // Seed Approval Levels
        if (insertedWorkflows.length > 0) {
            const levelData = [
                { workflow_id: insertedWorkflows[0].id, level_sequence: 1, approver_role: "supervisor", min_amount: "0", max_amount: "10000", is_mandatory: true },
                { workflow_id: insertedWorkflows[0].id, level_sequence: 2, approver_role: "manager", min_amount: "10000", max_amount: "50000", is_mandatory: true },
                { workflow_id: insertedWorkflows[0].id, level_sequence: 3, approver_role: "director", min_amount: "50000", max_amount: null, is_mandatory: true },
            ];

            await db.insert(tblApprovalLevels).values(levelData).onConflictDoNothing();
            console.log('Approval levels seeded');
        }

        // Seed System Enums
        const enumData = [
            { enum_type: "DOCUMENT_STATUS", enum_key: "DRAFT", enum_value: "Draft", display_order: 1 },
            { enum_type: "DOCUMENT_STATUS", enum_key: "PENDING", enum_value: "Pending Approval", display_order: 2 },
            { enum_type: "DOCUMENT_STATUS", enum_key: "APPROVED", enum_value: "Approved", display_order: 3 },
            { enum_type: "DOCUMENT_STATUS", enum_key: "REJECTED", enum_value: "Rejected", display_order: 4 },
            { enum_type: "PAYMENT_STATUS", enum_key: "PENDING", enum_value: "Pending", display_order: 1 },
            { enum_type: "PAYMENT_STATUS", enum_key: "PAID", enum_value: "Paid", display_order: 2 },
            { enum_type: "PAYMENT_STATUS", enum_key: "OVERDUE", enum_value: "Overdue", display_order: 3 },
            { enum_type: "MATCH_STATUS", enum_key: "UNMATCHED", enum_value: "Unmatched", display_order: 1 },
            { enum_type: "MATCH_STATUS", enum_key: "MATCHED", enum_value: "Matched", display_order: 2 },
            { enum_type: "MATCH_STATUS", enum_key: "VARIANCE", enum_value: "Variance", display_order: 3 },
        ];

        await db.insert(tblSystemEnums).values(enumData).onConflictDoNothing();
        console.log('System enums seeded');

        // Seed Document Sequences
        const sequenceData = [
            { document_type: "PO", current_number: 1, prefix: "PO-", suffix: "" },
            { document_type: "PR", current_number: 1, prefix: "PR-", suffix: "" },
            { document_type: "GRN", current_number: 1, prefix: "GRN-", suffix: "" },
            { document_type: "INV", current_number: 1, prefix: "INV-", suffix: "" },
            { document_type: "MI", current_number: 1, prefix: "MI-", suffix: "" },
        ];

        await db.insert(tblDocumentSequences).values(sequenceData).onConflictDoNothing();
        console.log('Document sequences seeded');

        console.log('Database seeded successfully!');
        console.log('\nLogin credentials:');
        console.log('Admin: admin@company.com / admin123');
        console.log('Requester: requester@company.com / requester123');
        console.log('Approver: approver@company.com / approver123');
        console.log('Procurement: procurement@company.com / procurement123');
        console.log('Store: store@company.com / store123');
        console.log('Finance: finance@company.com / finance123');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seed();