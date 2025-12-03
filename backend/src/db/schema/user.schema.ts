// src/db/user.ts
import {
  pgTable,
  varchar,
  text,
  boolean,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const roles = ["admin", "employee"] as const;
export type Role = (typeof roles)[number];

export const users = pgTable("tbl_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  profile : varchar("profile", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  role: text("role").$type<Role>().notNull(),
  token: varchar("token", { length: 1000 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
