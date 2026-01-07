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
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ============================================================
   MASTER REFERENCES
   ============================================================ */

import { tblItems } from "./inventory.schema";
import { tblUsers } from "./auth.schema";

/* ============================================================
   PURCHASE REQUEST (PR)
   Header table – WHY procurement is required
   ============================================================ */

export const tblPurchaseRequests = pgTable("tbl_purchase_requests", {
  id: serial("id").primaryKey(),

  requesting_department: varchar("requesting_department", { length: 100 }),
  requester_employee_code: varchar("requester_employee_code", { length: 50 }),

  date_of_request: timestamp("date_of_request").defaultNow(),
  required_date: date("required_date"),

  justification: text("justification"),
  maintenance_work_order: varchar("maintenance_work_order", { length: 50 }),

  status: varchar("status", { length: 20 }).default("Saved"),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

/* ============================================================
   PURCHASE REQUEST LINES (PR LINES)
   Line items – WHAT is being requested
   ============================================================ */

export const tblPurchaseRequestLines = pgTable(
  "tbl_purchase_request_lines",
  {
    id: serial("id").primaryKey(),

    pr_id: integer("pr_id")
      .references(() => tblPurchaseRequests.id)
      .notNull(),

    item_id: integer("item_id")
      .references(() => tblItems.id)
      .notNull(),

    quantity: integer("quantity").notNull(),

    estimated_unit_price: decimal("estimated_unit_price", {
      precision: 15,
      scale: 2,
    }),

    line_total: decimal("line_total", {
      precision: 15,
      scale: 2,
    }),

    status: varchar("status", { length: 20 }).default("ACTIVE"),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow(),
    deleted_at: timestamp("deleted_at"),
    is_deleted: boolean("is_deleted").default(false),
  }
);

/* ============================================================
   PURCHASE ORDER (PO)
   Commercial commitment to vendor
   ============================================================ */

export const tblPurchaseOrders = pgTable("tbl_purchase_orders", {
  id: serial("id").primaryKey(),

  po_number: varchar("po_number", { length: 50 }).notNull().unique(),
  supplier_id: varchar("supplier_id", { length: 50 }),

  po_date: timestamp("po_date").defaultNow(),
  buyer_id: varchar("buyer_id", { length: 50 }),

  total_amount: decimal("total_amount", {
    precision: 15,
    scale: 2,
  }).default("0"),

  status: varchar("status", { length: 20 }).default("Draft"),
  payment_terms: varchar("payment_terms", { length: 100 }),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

/* ============================================================
   PURCHASE ORDER LINES (PO LINES)
   Items ordered from vendor
   ============================================================ */

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

/* ============================================================
   PO DISTRIBUTIONS
   Accounting & logistics split for PO lines
   ============================================================ */

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

/* ============================================================
   GOODS RECEIPT NOTE (GRN)
   Physical receipt of goods
   ============================================================ */

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

/* ============================================================
   GRN DETAILS
   Received quantities per PO line
   ============================================================ */

export const tblGrnDetails = pgTable(
  "tbl_grn_details",
  {
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
  },
  (table) => ({
    uniqueGrnPoLine: unique().on(table.grn_id, table.po_line_id),
  })
);

/* ============================================================
   VENDOR INVOICES
   Financial document from vendor
   ============================================================ */

export const tblVendorInvoices = pgTable("tbl_vendor_invoices", {
  id: serial("id").primaryKey(),

  invoice_number: varchar("invoice_number", { length: 50 }).notNull().unique(),
  vendor_invoice_number: varchar("vendor_invoice_number", { length: 50 }).notNull(),

  vendor_id: varchar("vendor_id", { length: 50 }).notNull(),
  po_id: integer("po_id").references(() => tblPurchaseOrders.id),

  invoice_date: date("invoice_date").notNull(),
  due_date: date("due_date"),

  currency: varchar("currency", { length: 10 }).default("USD"),

  subtotal: decimal("subtotal", { precision: 15, scale: 2 }).notNull(),
  tax_amount: decimal("tax_amount", { precision: 15, scale: 2 }).default("0"),
  total_amount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),

  payment_status: varchar("payment_status", { length: 20 }).default("PENDING"),
  match_status: varchar("match_status", { length: 20 }).default("UNMATCHED"),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

/* ============================================================
   INVOICE LINES
   ============================================================ */

export const tblInvoiceLines = pgTable("tbl_invoice_lines", {
  id: serial("id").primaryKey(),

  invoice_id: integer("invoice_id")
    .references(() => tblVendorInvoices.id)
    .notNull(),

  po_line_id: integer("po_line_id").references(() => tblPoLines.id),

  item_id: integer("item_id")
    .references(() => tblItems.id)
    .notNull(),

  description: text("description"),
  quantity: integer("quantity").notNull(),

  unit_price: decimal("unit_price", { precision: 15, scale: 2 }).notNull(),
  line_total: decimal("line_total", { precision: 15, scale: 2 }).notNull(),

  match_status: varchar("match_status", { length: 20 }).default("UNMATCHED"),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

/* ============================================================
   THREE WAY MATCHING
   ============================================================ */

export const tblThreeWayMatching = pgTable("tbl_three_way_matching", {
  id: serial("id").primaryKey(),

  po_line_id: integer("po_line_id")
    .references(() => tblPoLines.id)
    .notNull(),

  grn_detail_id: integer("grn_detail_id").references(() => tblGrnDetails.id),
  invoice_line_id: integer("invoice_line_id").references(() => tblInvoiceLines.id),

  match_status: varchar("match_status", { length: 20 }).default("PENDING"),

  quantity_variance: integer("quantity_variance").default(0),
  price_variance: decimal("price_variance", { precision: 15, scale: 2 }).default("0"),

  variance_reason: text("variance_reason"),

  matched_by: uuid("matched_by").references(() => tblUsers.id),
  matched_at: timestamp("matched_at"),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

/* ============================================================
   DOCUMENT STATUS HISTORY
   Audit trail for document status changes
   ============================================================ */

export const tblDocumentStatusHistory = pgTable("tbl_document_status_history", {
  id: serial("id").primaryKey(),
  
  document_type: varchar("document_type", { length: 20 }).notNull(),
  document_id: integer("document_id").notNull(),
  
  old_status: varchar("old_status", { length: 50 }),
  new_status: varchar("new_status", { length: 50 }).notNull(),
  
  changed_by: uuid("changed_by").references(() => tblUsers.id).notNull(),
  changed_at: timestamp("changed_at").defaultNow().notNull(),
  
  remarks: text("remarks"),
  
  created_at: timestamp("created_at").defaultNow().notNull(),
});

/* ============================================================
   RELATIONS
   ============================================================ */

export const purchaseRequestsRelations = relations(
  tblPurchaseRequests,
  ({ many }) => ({
    lines: many(tblPurchaseRequestLines),
  })
);

export const purchaseRequestLinesRelations = relations(
  tblPurchaseRequestLines,
  ({ one }) => ({
    pr: one(tblPurchaseRequests, {
      fields: [tblPurchaseRequestLines.pr_id],
      references: [tblPurchaseRequests.id],
    }),
    item: one(tblItems, {
      fields: [tblPurchaseRequestLines.item_id],
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
