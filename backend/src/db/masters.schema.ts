import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  date,
  timestamp,
  varchar,
  uuid,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Import users from auth schema
import { tblUsers } from "./auth.schema";

// --- Modules Schema ---
export const tblModules = pgTable("tbl_modules", {
  id: serial("id").primaryKey(),
  module_code: varchar("module_code", { length: 50 }).notNull().unique(),
  module_name: varchar("module_name", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  route_path: varchar("route_path", { length: 200 }),
  display_order: integer("display_order").default(0),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

// --- User Module Permissions ---
export const tblUserModulePermissions = pgTable("tbl_user_module_permissions", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").references(() => tblUsers.id).notNull(),
  module_id: integer("module_id").references(() => tblModules.id).notNull(),
  can_view: boolean("can_view").default(true),
  can_create: boolean("can_create").default(false),
  can_edit: boolean("can_edit").default(false),
  can_delete: boolean("can_delete").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

// --- Unit of Measure Master ---
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

// --- Category Master ---
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

// --- Warehouse Master ---
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

// --- Approval Workflows ---
export const tblApprovalWorkflows = pgTable("tbl_approval_workflows", {
  id: serial("id").primaryKey(),
  workflow_code: varchar("workflow_code", { length: 50 }).notNull().unique(),
  workflow_name: varchar("workflow_name", { length: 100 }).notNull(),
  document_type: varchar("document_type", { length: 50 }).notNull(),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const tblApprovalLevels = pgTable("tbl_approval_levels", {
  id: serial("id").primaryKey(),
  workflow_id: integer("workflow_id").references(() => tblApprovalWorkflows.id).notNull(),
  level_sequence: integer("level_sequence").notNull(),
  approver_role: varchar("approver_role", { length: 50 }).notNull(),
  min_amount: decimal("min_amount", { precision: 15, scale: 2 }).default("0"),
  max_amount: decimal("max_amount", { precision: 15, scale: 2 }),
  is_mandatory: boolean("is_mandatory").default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const tblApprovalInstances = pgTable("tbl_approval_instances", {
  id: serial("id").primaryKey(),
  workflow_id: integer("workflow_id").references(() => tblApprovalWorkflows.id).notNull(),
  document_type: varchar("document_type", { length: 50 }).notNull(),
  document_id: integer("document_id").notNull(),
  current_level: integer("current_level").default(1),
  overall_status: varchar("overall_status", { length: 20 }).default("PENDING"),
  submitted_by: uuid("submitted_by").references(() => tblUsers.id).notNull(),
  submitted_at: timestamp("submitted_at").defaultNow().notNull(),
  completed_at: timestamp("completed_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const tblApprovalHistory = pgTable("tbl_approval_history", {
  id: serial("id").primaryKey(),
  approval_instance_id: integer("approval_instance_id").references(() => tblApprovalInstances.id).notNull(),
  level_sequence: integer("level_sequence").notNull(),
  approver_id: uuid("approver_id").references(() => tblUsers.id).notNull(),
  action: varchar("action", { length: 20 }).notNull(),
  comments: text("comments"),
  action_date: timestamp("action_date").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// --- System Tables ---
export const tblSystemEnums = pgTable("tbl_system_enums", {
  id: serial("id").primaryKey(),
  enum_type: varchar("enum_type", { length: 50 }).notNull(),
  enum_key: varchar("enum_key", { length: 50 }).notNull(),
  enum_value: varchar("enum_value", { length: 100 }).notNull(),
  display_order: integer("display_order").default(0),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const tblAuditLogs = pgTable("tbl_audit_logs", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").references(() => tblUsers.id),
  action: varchar("action", { length: 50 }).notNull(),
  table_name: varchar("table_name", { length: 100 }).notNull(),
  record_id: integer("record_id").notNull(),
  old_values: text("old_values"),
  new_values: text("new_values"),
  ip_address: varchar("ip_address", { length: 45 }),
  user_agent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const tblDocumentAttachments = pgTable("tbl_document_attachments", {
  id: serial("id").primaryKey(),
  document_type: varchar("document_type", { length: 50 }).notNull(),
  document_id: integer("document_id").notNull(),
  file_name: varchar("file_name", { length: 255 }).notNull(),
  original_name: varchar("original_name", { length: 255 }).notNull(),
  file_path: text("file_path").notNull(),
  file_size: integer("file_size").notNull(),
  mime_type: varchar("mime_type", { length: 100 }).notNull(),
  uploaded_by: uuid("uploaded_by").references(() => tblUsers.id).notNull(),
  uploaded_at: timestamp("uploaded_at").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

export const tblDocumentSequences = pgTable("tbl_document_sequences", {
  id: serial("id").primaryKey(),
  document_type: varchar("document_type", { length: 20 }).notNull().unique(),
  current_number: integer("current_number").default(1),
  prefix: varchar("prefix", { length: 10 }),
  suffix: varchar("suffix", { length: 10 }),
  updated_at: timestamp("updated_at").defaultNow(),
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

export const userModulePermissionsRelations = relations(
  tblUserModulePermissions,
  ({ one }) => ({
    user: one(tblUsers, {
      fields: [tblUserModulePermissions.user_id],
      references: [tblUsers.id],
    }),
    module: one(tblModules, {
      fields: [tblUserModulePermissions.module_id],
      references: [tblModules.id],
    }),
  })
);