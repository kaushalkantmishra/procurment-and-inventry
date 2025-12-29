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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Import from inventory for references
import { tblItems } from "../../inventory/schemas/inventory.schema";

// --- Purchase Request (PR) ---
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

// --- Purchase Order (PO) ---
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

// --- Goods Receipt Note (GRN) ---
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

export const purchaseRequestsRelations = relations(
  tblPurchaseRequests,
  ({ one }) => ({
    item: one(tblItems, {
      fields: [tblPurchaseRequests.item_id],
      references: [tblItems.id],
    }),
  })
);

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