import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  varchar,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- Roles Table ---
export const tblRoles = pgTable("tbl_roles", {
  id: serial("id").primaryKey(),
  role_code: varchar("role_code", { length: 50 }).notNull().unique(),
  role_name: varchar("role_name", { length: 100 }).notNull(),
  description: text("description"),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

// --- Users Table (Refactored) ---
export const tblUsers = pgTable("tbl_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  token: varchar("token", { length: 1000 }),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

// --- User-Role Mapping Table ---
export const tblUserRoles = pgTable("tbl_user_roles", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").references(() => tblUsers.id).notNull(),
  role_id: serial("role_id").references(() => tblRoles.id).notNull(),
  is_primary: boolean("is_primary").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  deleted_at: timestamp("deleted_at"),
  is_deleted: boolean("is_deleted").default(false),
});

// --- Relations ---
export const userRolesRelations = relations(tblUserRoles, ({ one }) => ({
  user: one(tblUsers, {
    fields: [tblUserRoles.user_id],
    references: [tblUsers.id],
  }),
  role: one(tblRoles, {
    fields: [tblUserRoles.role_id],
    references: [tblRoles.id],
  }),
}));

export const usersRelations = relations(tblUsers, ({ many }) => ({
  userRoles: many(tblUserRoles),
}));

export const rolesRelations = relations(tblRoles, ({ many }) => ({
  userRoles: many(tblUserRoles),
}));