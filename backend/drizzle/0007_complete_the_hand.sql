CREATE TABLE "tbl_document_status_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_type" varchar(20) NOT NULL,
	"document_id" integer NOT NULL,
	"old_status" varchar(50),
	"new_status" varchar(50) NOT NULL,
	"changed_by" uuid NOT NULL,
	"changed_at" timestamp DEFAULT now() NOT NULL,
	"remarks" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tbl_purchase_request_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"pr_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"estimated_unit_price" numeric(15, 2),
	"line_total" numeric(15, 2),
	"status" varchar(20) DEFAULT 'ACTIVE',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "tbl_purchase_requests" DROP CONSTRAINT "tbl_purchase_requests_item_id_tbl_items_id_fk";
--> statement-breakpoint
ALTER TABLE "tbl_document_status_history" ADD CONSTRAINT "tbl_document_status_history_changed_by_tbl_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_purchase_request_lines" ADD CONSTRAINT "tbl_purchase_request_lines_pr_id_tbl_purchase_requests_id_fk" FOREIGN KEY ("pr_id") REFERENCES "public"."tbl_purchase_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_purchase_request_lines" ADD CONSTRAINT "tbl_purchase_request_lines_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_purchase_requests" DROP COLUMN "item_id";--> statement-breakpoint
ALTER TABLE "tbl_purchase_requests" DROP COLUMN "quantity";--> statement-breakpoint
ALTER TABLE "tbl_purchase_requests" DROP COLUMN "estimated_unit_price";--> statement-breakpoint
ALTER TABLE "tbl_purchase_requests" DROP COLUMN "total_estimated_cost";