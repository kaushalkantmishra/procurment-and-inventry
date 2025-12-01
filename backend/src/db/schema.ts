import {
  pgTable,
  serial,
  text,
  integer,
  decimal,
  boolean,
  date,
  timestamp,
  varchar,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// exporting user schema
export { users } from "./schema/user.schema";

// --- 5. Unit of Measure Master ---
export const tblUnits = pgTable("tbl_units", {
  id: serial("id").primaryKey(),
  unit_id: varchar("unit_id", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  abbreviation: varchar("abbreviation", { length: 20 }),
  status: integer("status").default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

// --- 2. Category Master ---
export const tblCategories = pgTable("tbl_categories", {
  id: serial("id").primaryKey(),
  category_name: varchar("category_name", { length: 100 }).notNull().unique(),
  category_code: varchar("category_code", { length: 20 }).notNull().unique(),
  parent_category_id: integer("parent_category_id").references(
    (): any => tblCategories.id
  ),
  description: text("description"),
  status: integer("status").default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const categoriesRelations = relations(
  tblCategories,
  ({ one, many }) => ({
    parent: one(tblCategories, {
      fields: [tblCategories.parent_category_id],
      references: [tblCategories.id],
      relationName: "parent_child",
    }),
    children: many(tblCategories, {
      relationName: "parent_child",
    }),
  })
);

// --- 4. Warehouse Master ---
export const tblWarehouses = pgTable("tbl_warehouses", {
  id: serial("id").primaryKey(),
  warehouse_code: varchar("warehouse_code", { length: 20 }).notNull().unique(),
  warehouse_name: varchar("warehouse_name", { length: 100 }).notNull(),
  street_address: text("street_address"),
  city: varchar("city", { length: 100 }),
  country_code: varchar("country_code", { length: 10 }),
  is_active: boolean("is_active").default(true),
  date_opened: date("date_opened"),
  status: integer("status").default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

// --- 1. Product Master / Item Master ---
export const tblItems = pgTable("tbl_items", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 20 }).notNull().unique(),
  item_name: varchar("item_name", { length: 100 }).notNull(),
  category_id: integer("category_id").references(() => tblCategories.id),
  unit_of_measure: varchar("unit_of_measure", { length: 20 }).references(
    () => tblUnits.unit_id
  ),
  unit_cost: decimal("unit_cost", { precision: 15, scale: 2 }).default("0"),
  selling_price: decimal("selling_price", { precision: 15, scale: 2 }).default(
    "0"
  ),
  vendor_code: varchar("vendor_code", { length: 50 }),
  reorder_level: integer("reorder_level").default(0),
  safety_stock: integer("safety_stock").default(0),
  lead_time_days: integer("lead_time_days").default(0),
  storage_location: varchar("storage_location", { length: 100 }),
  batch_tracking: boolean("batch_tracking").default(false),
  is_active: boolean("is_active").default(true),
  photo_path: text("photo_path"),
  expiry_date: date("expiry_date"),
  discount_allowed: boolean("discount_allowed").default(false),
  discount_rate: decimal("discount_rate", { precision: 5, scale: 2 }).default(
    "0"
  ),
  status: integer("status").default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const itemsRelations = relations(tblItems, ({ one }) => ({
  category: one(tblCategories, {
    fields: [tblItems.category_id],
    references: [tblCategories.id],
  }),
  unit: one(tblUnits, {
    fields: [tblItems.unit_of_measure],
    references: [tblUnits.unit_id],
  }),
}));

// --- 6. Purchase Request (PR) ---
export const tblPurchaseRequests = pgTable("tbl_purchase_requests", {
  id: serial("id").primaryKey(),
  requesting_department: varchar("requesting_department", { length: 100 }),
  requester_employee_code: varchar("requester_employee_code", { length: 50 }),
  date_of_request: timestamp("date_of_request").defaultNow(),
  required_date: date("required_date"),
  item_id: integer("item_id").references(() => tblItems.id),
  quantity: integer("quantity").notNull(),
  estimated_unit_price: decimal("estimated_unit_price", {
    precision: 15,
    scale: 2,
  }),
  total_estimated_cost: decimal("total_estimated_cost", {
    precision: 15,
    scale: 2,
  }),
  justification: text("justification"),
  maintenance_work_order: varchar("maintenance_work_order", { length: 50 }),
  status: varchar("status", { length: 20 }).default("Saved"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const purchaseRequestsRelations = relations(
  tblPurchaseRequests,
  ({ one }) => ({
    item: one(tblItems, {
      fields: [tblPurchaseRequests.item_id],
      references: [tblItems.id],
    }),
  })
);

// --- 3. Purchase Order (PO) ---
export const tblPurchaseOrders = pgTable("tbl_purchase_orders", {
  id: serial("id").primaryKey(),
  po_number: varchar("po_number", { length: 50 }).notNull().unique(),
  supplier_id: varchar("supplier_id", { length: 50 }),
  po_date: timestamp("po_date").defaultNow(),
  buyer_id: varchar("buyer_id", { length: 50 }),
  total_amount: decimal("total_amount", { precision: 15, scale: 2 }).default(
    "0"
  ),
  status: varchar("status", { length: 20 }).default("Draft"),
  terms_id: varchar("terms_id", { length: 50 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const tblPoLines = pgTable("tbl_po_lines", {
  id: serial("id").primaryKey(),
  po_id: integer("po_id")
    .references(() => tblPurchaseOrders.id)
    .notNull(),
  line_number: integer("line_number").notNull(),
  item_id: integer("item_id")
    .references(() => tblItems.id)
    .notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull(),
  unit_price: decimal("unit_price", { precision: 15, scale: 2 }).notNull(),
  line_total: decimal("line_total", { precision: 15, scale: 2 }).notNull(),
  status: integer("status").default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const tblPoDistributions = pgTable("tbl_po_distributions", {
  id: serial("id").primaryKey(),
  po_line_id: integer("po_line_id")
    .references(() => tblPoLines.id)
    .notNull(),
  ship_to_location: varchar("ship_to_location", { length: 100 }),
  account_code: varchar("account_code", { length: 50 }),
  distribution_quantity: integer("distribution_quantity").notNull(),
  due_date: date("due_date"),
  status: integer("status").default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const purchaseOrdersRelations = relations(
  tblPurchaseOrders,
  ({ many }) => ({
    lines: many(tblPoLines),
  })
);

export const poLinesRelations = relations(tblPoLines, ({ one, many }) => ({
  po: one(tblPurchaseOrders, {
    fields: [tblPoLines.po_id],
    references: [tblPurchaseOrders.id],
  }),
  item: one(tblItems, {
    fields: [tblPoLines.item_id],
    references: [tblItems.id],
  }),
  distributions: many(tblPoDistributions),
}));

export const poDistributionsRelations = relations(
  tblPoDistributions,
  ({ one }) => ({
    poLine: one(tblPoLines, {
      fields: [tblPoDistributions.po_line_id],
      references: [tblPoLines.id],
    }),
  })
);

// --- 8. Goods Receipt Note (GRN) ---
export const tblGrnHeaders = pgTable("tbl_grn_headers", {
  id: serial("id").primaryKey(),
  grn_number: varchar("grn_number", { length: 50 }).notNull().unique(),
  receipt_date: timestamp("receipt_date").defaultNow(),
  po_id: integer("po_id").references(() => tblPurchaseOrders.id),
  supplier_id: varchar("supplier_id", { length: 50 }),
  delivery_note_ref: varchar("delivery_note_ref", { length: 100 }),
  vehicle_reg_no: varchar("vehicle_reg_no", { length: 20 }),
  received_by_user: varchar("received_by_user", { length: 50 }),
  inspection_status: varchar("inspection_status", { length: 50 }),
  remarks: text("remarks"),
  status: integer("status").default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const tblGrnDetails = pgTable("tbl_grn_details", {
  id: serial("id").primaryKey(),
  grn_id: integer("grn_id")
    .references(() => tblGrnHeaders.id)
    .notNull(),
  po_line_id: integer("po_line_id").references(() => tblPoLines.id),
  item_id: integer("item_id")
    .references(() => tblItems.id)
    .notNull(),
  uom: varchar("uom", { length: 20 }),
  ordered_qty: integer("ordered_qty").notNull(),
  received_qty: integer("received_qty").notNull(),
  accepted_qty: integer("accepted_qty").notNull(),
  rejected_qty: integer("rejected_qty").default(0),
  storage_location_id: varchar("storage_location_id", { length: 50 }),
  condition_note: text("condition_note"),
  qad_check: varchar("qad_check", { length: 20 }),
  qad_remarks: text("qad_remarks"),
  status: integer("status").default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const grnHeadersRelations = relations(
  tblGrnHeaders,
  ({ one, many }) => ({
    po: one(tblPurchaseOrders, {
      fields: [tblGrnHeaders.po_id],
      references: [tblPurchaseOrders.id],
    }),
    details: many(tblGrnDetails),
  })
);

export const grnDetailsRelations = relations(tblGrnDetails, ({ one }) => ({
  grn: one(tblGrnHeaders, {
    fields: [tblGrnDetails.grn_id],
    references: [tblGrnHeaders.id],
  }),
  item: one(tblItems, {
    fields: [tblGrnDetails.item_id],
    references: [tblItems.id],
  }),
}));

// --- 7. POS / Store Receipt ---
export const tblReceiptHeaders = pgTable("tbl_receipt_headers", {
  id: serial("id").primaryKey(),
  receipt_number: varchar("receipt_number", { length: 50 }).notNull().unique(),
  transaction_date: timestamp("transaction_date").defaultNow(),
  store_id: varchar("store_id", { length: 20 }).references(
    () => tblWarehouses.warehouse_code
  ),
  cashier_id: varchar("cashier_id", { length: 50 }),
  customer_id: varchar("customer_id", { length: 50 }),
  subtotal: decimal("subtotal", { precision: 15, scale: 2 }).default("0"),
  discount_total: decimal("discount_total", {
    precision: 15,
    scale: 2,
  }).default("0"),
  tax_total: decimal("tax_total", { precision: 15, scale: 2 }).default("0"),
  grand_total: decimal("grand_total", { precision: 15, scale: 2 }).default("0"),
  is_voided: boolean("is_voided").default(false),
  status: integer("status").default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const tblReceiptLines = pgTable("tbl_receipt_lines", {
  id: serial("id").primaryKey(),
  receipt_id: integer("receipt_id")
    .references(() => tblReceiptHeaders.id)
    .notNull(),
  item_id: integer("item_id")
    .references(() => tblItems.id)
    .notNull(),
  product_snapshot_name: varchar("product_snapshot_name", { length: 100 }),
  quantity: integer("quantity").notNull(),
  unit_price: decimal("unit_price", { precision: 15, scale: 2 }).notNull(),
  line_discount: decimal("line_discount", { precision: 15, scale: 2 }).default(
    "0"
  ),
  line_tax_rate: decimal("line_tax_rate", { precision: 5, scale: 2 }).default(
    "0"
  ),
  line_total: decimal("line_total", { precision: 15, scale: 2 }).notNull(),
  status: integer("status").default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const tblPayments = pgTable("tbl_payments", {
  id: serial("id").primaryKey(),
  receipt_id: integer("receipt_id")
    .references(() => tblReceiptHeaders.id)
    .notNull(),
  payment_type: varchar("payment_type", { length: 20 }),
  payment_amount: decimal("payment_amount", {
    precision: 15,
    scale: 2,
  }).notNull(),
  tendered_amount: decimal("tendered_amount", { precision: 15, scale: 2 }),
  change_given: decimal("change_given", { precision: 15, scale: 2 }),
  reference_number: varchar("reference_number", { length: 50 }),
  status: integer("status").default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const receiptHeadersRelations = relations(
  tblReceiptHeaders,
  ({ one, many }) => ({
    store: one(tblWarehouses, {
      fields: [tblReceiptHeaders.store_id],
      references: [tblWarehouses.warehouse_code],
    }),
    lines: many(tblReceiptLines),
    payments: many(tblPayments),
  })
);

export const receiptLinesRelations = relations(tblReceiptLines, ({ one }) => ({
  receipt: one(tblReceiptHeaders, {
    fields: [tblReceiptLines.receipt_id],
    references: [tblReceiptHeaders.id],
  }),
  item: one(tblItems, {
    fields: [tblReceiptLines.item_id],
    references: [tblItems.id],
  }),
}));

export const paymentsRelations = relations(tblPayments, ({ one }) => ({
  receipt: one(tblReceiptHeaders, {
    fields: [tblPayments.receipt_id],
    references: [tblReceiptHeaders.id],
  }),
}));

// --- Vendors ---
export const tblVendors = pgTable("tbl_vendors", {
  id: serial("id").primaryKey(),
  vendor_code: varchar("vendor_code", { length: 50 }).notNull().unique(),
  vendor_name: varchar("vendor_name", { length: 200 }).notNull(),
  contact_person: varchar("contact_person", { length: 100 }),
  email: varchar("email", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  payment_terms: varchar("payment_terms", { length: 50 }),
  is_active: boolean("is_active").default(true),
  status: integer("status").default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

// --- Inventory Transactions ---
export const tblInventoryTransactions = pgTable("tbl_inventory_transactions", {
  id: serial("id").primaryKey(),
  item_id: integer("item_id")
    .references(() => tblItems.id)
    .notNull(),
  transaction_type: varchar("transaction_type", { length: 20 }).notNull(),
  quantity: integer("quantity").notNull(),
  reference: varchar("reference", { length: 100 }),
  notes: text("notes"),
  performed_by: varchar("performed_by", { length: 100 }),
  transaction_date: timestamp("transaction_date").defaultNow(),
  status: integer("status").default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const inventoryTransactionsRelations = relations(
  tblInventoryTransactions,
  ({ one }) => ({
    item: one(tblItems, {
      fields: [tblInventoryTransactions.item_id],
      references: [tblItems.id],
    }),
  })
);

// Export aliases for backward compatibility
export const units = tblUnits;
export const categories = tblCategories;
export const warehouses = tblWarehouses;
export const items = tblItems;
export const vendors = tblVendors;
