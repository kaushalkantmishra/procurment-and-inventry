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
   uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ============================================================
   MASTER REFERENCES
   ============================================================ */

import { tblCategories, tblUnits, tblWarehouses} from "./masters.schema";
import { tblUsers } from "./auth.schema";

/* ============================================================
   PRODUCT MASTER / ITEM MASTER
   Core product catalog and item information
   ============================================================ */

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

/* ============================================================
   INVENTORY TRANSACTIONS
   Stock movement tracking and audit trail
   ============================================================ */

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

/* ============================================================
   STOCK BALANCES
   Real-time inventory levels per warehouse
   ============================================================ */

export const tblStockBalances = pgTable("tbl_stock_balances", {
  id: serial("id").primaryKey(),
  item_id: integer("item_id").references(() => tblItems.id).notNull(),
  warehouse_id: integer("warehouse_id").references(() => tblWarehouses.id).notNull(),
  available_quantity: integer("available_quantity").default(0),
  reserved_quantity: integer("reserved_quantity").default(0),
  on_order_quantity: integer("on_order_quantity").default(0),
  last_transaction_id: integer("last_transaction_id").references(() => tblInventoryTransactions.id),
  last_updated: timestamp("last_updated").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

/* ============================================================
   POS / STORE RECEIPTS
   Point of sale transactions and customer receipts
   ============================================================ */

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

/* ============================================================
   MATERIAL ISSUES
   Internal material transfers and issues
   ============================================================ */

export const tblMaterialIssueHeaders = pgTable("tbl_material_issues", {
  id: serial("id").primaryKey(),
  issue_number: varchar("issue_number", { length: 50 }).notNull().unique(),
  issue_type: varchar("issue_type", { length: 20 }).notNull(),
  from_warehouse_id: integer("from_warehouse_id").references(() => tblWarehouses.id).notNull(),
  to_warehouse_id: integer("to_warehouse_id").references(() => tblWarehouses.id),
  department: varchar("department", { length: 100 }),
  project_code: varchar("project_code", { length: 50 }),
  requested_by: uuid("requested_by").references(() => tblUsers.id).notNull(),
  issued_by: uuid("issued_by").references(() => tblUsers.id),
  issue_date: timestamp("issue_date").defaultNow().notNull(),
  status: varchar("status", { length: 20 }).default("DRAFT"),
  remarks: text("remarks"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const tblMaterialIssueLines = pgTable("tbl_material_issue_lines", {
  id: serial("id").primaryKey(),
  issue_id: integer("issue_id").references(() => tblMaterialIssueHeaders.id).notNull(),
  item_id: integer("item_id").references(() => tblItems.id).notNull(),
  requested_quantity: integer("requested_quantity").notNull(),
  issued_quantity: integer("issued_quantity").default(0),
  unit_cost: decimal("unit_cost", { precision: 15, scale: 2 }),
  line_total: decimal("line_total", { precision: 15, scale: 2 }),
  remarks: text("remarks"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

/* ============================================================
   RELATIONS
   ============================================================ */

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

export const inventoryTransactionsRelations = relations(
  tblInventoryTransactions,
  ({ one }) => ({
    item: one(tblItems, {
      fields: [tblInventoryTransactions.item_id],
      references: [tblItems.id],
    }),
  })
);

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