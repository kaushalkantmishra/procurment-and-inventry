ALTER TABLE "tbl_users" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "tbl_users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();