ALTER TABLE "tbl_purchase_request_lines" ALTER COLUMN "item_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tbl_purchase_request_lines" ADD COLUMN "item_name" varchar(255);--> statement-breakpoint
ALTER TABLE "tbl_purchase_request_lines" ADD COLUMN "category_id" integer;--> statement-breakpoint
ALTER TABLE "tbl_purchase_request_lines" ADD COLUMN "uom_id" integer;--> statement-breakpoint
ALTER TABLE "tbl_purchase_requests" ADD COLUMN "priority" varchar(10) DEFAULT 'Medium' NOT NULL;