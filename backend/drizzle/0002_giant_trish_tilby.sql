ALTER TABLE "users" RENAME TO "tbl_users";--> statement-breakpoint
ALTER TABLE "tbl_users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "tbl_users" ADD CONSTRAINT "tbl_users_email_unique" UNIQUE("email");