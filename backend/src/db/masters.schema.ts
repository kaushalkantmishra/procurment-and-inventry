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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- User Schema ---
export const roles = ["admin", "employee"] as const;
export type Role = (typeof roles)[number];

export const tblUsers = pgTable("tbl_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  profile: varchar("profile", { length: 255 }),
  password_hash: varchar("password", { length: 255 }).notNull(),
  role: text("role").$type<Role>().notNull(),
  token: varchar("token", { length: 1000 }),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

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