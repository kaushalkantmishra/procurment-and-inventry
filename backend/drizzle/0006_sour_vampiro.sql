CREATE TABLE "tbl_document_sequences" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_type" varchar(20) NOT NULL,
	"current_number" integer DEFAULT 1,
	"prefix" varchar(10),
	"suffix" varchar(10),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tbl_document_sequences_document_type_unique" UNIQUE("document_type")
);
--> statement-breakpoint
ALTER TABLE "tbl_users" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "tbl_users" ADD COLUMN "is_deleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "tbl_modules" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "tbl_modules" ADD COLUMN "is_deleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "tbl_user_module_permissions" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "tbl_user_module_permissions" ADD COLUMN "is_deleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "tbl_grn_details" ADD CONSTRAINT "tbl_grn_details_grn_id_po_line_id_unique" UNIQUE("grn_id","po_line_id");