CREATE TABLE "tbl_approval_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"approval_instance_id" integer NOT NULL,
	"level_sequence" integer NOT NULL,
	"approver_id" uuid NOT NULL,
	"action" varchar(20) NOT NULL,
	"comments" text,
	"action_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tbl_approval_instances" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" integer NOT NULL,
	"document_type" varchar(50) NOT NULL,
	"document_id" integer NOT NULL,
	"current_level" integer DEFAULT 1,
	"overall_status" varchar(20) DEFAULT 'PENDING',
	"submitted_by" uuid NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_approval_levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" integer NOT NULL,
	"level_sequence" integer NOT NULL,
	"approver_role" varchar(50) NOT NULL,
	"min_amount" numeric(15, 2) DEFAULT '0',
	"max_amount" numeric(15, 2),
	"is_mandatory" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tbl_approval_workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_code" varchar(50) NOT NULL,
	"workflow_name" varchar(100) NOT NULL,
	"document_type" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_approval_workflows_workflow_code_unique" UNIQUE("workflow_code")
);
--> statement-breakpoint
CREATE TABLE "tbl_audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"action" varchar(50) NOT NULL,
	"table_name" varchar(100) NOT NULL,
	"record_id" integer NOT NULL,
	"old_values" text,
	"new_values" text,
	"ip_address" varchar(45),
	"user_agent" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tbl_document_attachments" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_type" varchar(50) NOT NULL,
	"document_id" integer NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"file_path" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tbl_system_enums" (
	"id" serial PRIMARY KEY NOT NULL,
	"enum_type" varchar(50) NOT NULL,
	"enum_key" varchar(50) NOT NULL,
	"enum_value" varchar(100) NOT NULL,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_material_issue_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"issue_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"requested_quantity" integer NOT NULL,
	"issued_quantity" integer DEFAULT 0,
	"unit_cost" numeric(15, 2),
	"line_total" numeric(15, 2),
	"remarks" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tbl_material_issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"issue_number" varchar(50) NOT NULL,
	"issue_type" varchar(20) NOT NULL,
	"from_warehouse_id" integer NOT NULL,
	"to_warehouse_id" integer,
	"department" varchar(100),
	"project_code" varchar(50),
	"requested_by" uuid NOT NULL,
	"issued_by" uuid,
	"issue_date" timestamp DEFAULT now() NOT NULL,
	"status" varchar(20) DEFAULT 'DRAFT',
	"remarks" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_material_issues_issue_number_unique" UNIQUE("issue_number")
);
--> statement-breakpoint
CREATE TABLE "tbl_stock_balances" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"warehouse_id" integer NOT NULL,
	"available_quantity" integer DEFAULT 0,
	"reserved_quantity" integer DEFAULT 0,
	"on_order_quantity" integer DEFAULT 0,
	"last_transaction_id" integer,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_invoice_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer NOT NULL,
	"po_line_id" integer,
	"item_id" integer NOT NULL,
	"description" text,
	"quantity" integer NOT NULL,
	"unit_price" numeric(15, 2) NOT NULL,
	"line_total" numeric(15, 2) NOT NULL,
	"match_status" varchar(20) DEFAULT 'UNMATCHED',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tbl_three_way_matching" (
	"id" serial PRIMARY KEY NOT NULL,
	"po_line_id" integer NOT NULL,
	"grn_detail_id" integer,
	"invoice_line_id" integer,
	"match_status" varchar(20) DEFAULT 'PENDING',
	"quantity_variance" integer DEFAULT 0,
	"price_variance" numeric(15, 2) DEFAULT '0',
	"variance_reason" text,
	"matched_by" uuid,
	"matched_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_vendor_invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_number" varchar(50) NOT NULL,
	"vendor_invoice_number" varchar(50) NOT NULL,
	"vendor_id" varchar(50) NOT NULL,
	"po_id" integer,
	"invoice_date" date NOT NULL,
	"due_date" date,
	"currency" varchar(10) DEFAULT 'USD',
	"subtotal" numeric(15, 2) NOT NULL,
	"tax_amount" numeric(15, 2) DEFAULT '0',
	"total_amount" numeric(15, 2) NOT NULL,
	"payment_status" varchar(20) DEFAULT 'PENDING',
	"match_status" varchar(20) DEFAULT 'UNMATCHED',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_vendor_invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
ALTER TABLE "tbl_approval_history" ADD CONSTRAINT "tbl_approval_history_approval_instance_id_tbl_approval_instances_id_fk" FOREIGN KEY ("approval_instance_id") REFERENCES "public"."tbl_approval_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_approval_history" ADD CONSTRAINT "tbl_approval_history_approver_id_tbl_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_approval_instances" ADD CONSTRAINT "tbl_approval_instances_workflow_id_tbl_approval_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."tbl_approval_workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_approval_instances" ADD CONSTRAINT "tbl_approval_instances_submitted_by_tbl_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_approval_levels" ADD CONSTRAINT "tbl_approval_levels_workflow_id_tbl_approval_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."tbl_approval_workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_audit_logs" ADD CONSTRAINT "tbl_audit_logs_user_id_tbl_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_document_attachments" ADD CONSTRAINT "tbl_document_attachments_uploaded_by_tbl_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_material_issue_lines" ADD CONSTRAINT "tbl_material_issue_lines_issue_id_tbl_material_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."tbl_material_issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_material_issue_lines" ADD CONSTRAINT "tbl_material_issue_lines_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_material_issues" ADD CONSTRAINT "tbl_material_issues_from_warehouse_id_tbl_warehouses_id_fk" FOREIGN KEY ("from_warehouse_id") REFERENCES "public"."tbl_warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_material_issues" ADD CONSTRAINT "tbl_material_issues_to_warehouse_id_tbl_warehouses_id_fk" FOREIGN KEY ("to_warehouse_id") REFERENCES "public"."tbl_warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_material_issues" ADD CONSTRAINT "tbl_material_issues_requested_by_tbl_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_material_issues" ADD CONSTRAINT "tbl_material_issues_issued_by_tbl_users_id_fk" FOREIGN KEY ("issued_by") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_stock_balances" ADD CONSTRAINT "tbl_stock_balances_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_stock_balances" ADD CONSTRAINT "tbl_stock_balances_warehouse_id_tbl_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."tbl_warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_stock_balances" ADD CONSTRAINT "tbl_stock_balances_last_transaction_id_tbl_inventory_transactions_id_fk" FOREIGN KEY ("last_transaction_id") REFERENCES "public"."tbl_inventory_transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_invoice_lines" ADD CONSTRAINT "tbl_invoice_lines_invoice_id_tbl_vendor_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."tbl_vendor_invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_invoice_lines" ADD CONSTRAINT "tbl_invoice_lines_po_line_id_tbl_po_lines_id_fk" FOREIGN KEY ("po_line_id") REFERENCES "public"."tbl_po_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_invoice_lines" ADD CONSTRAINT "tbl_invoice_lines_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_three_way_matching" ADD CONSTRAINT "tbl_three_way_matching_po_line_id_tbl_po_lines_id_fk" FOREIGN KEY ("po_line_id") REFERENCES "public"."tbl_po_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_three_way_matching" ADD CONSTRAINT "tbl_three_way_matching_grn_detail_id_tbl_grn_details_id_fk" FOREIGN KEY ("grn_detail_id") REFERENCES "public"."tbl_grn_details"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_three_way_matching" ADD CONSTRAINT "tbl_three_way_matching_invoice_line_id_tbl_invoice_lines_id_fk" FOREIGN KEY ("invoice_line_id") REFERENCES "public"."tbl_invoice_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_three_way_matching" ADD CONSTRAINT "tbl_three_way_matching_matched_by_tbl_users_id_fk" FOREIGN KEY ("matched_by") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_vendor_invoices" ADD CONSTRAINT "tbl_vendor_invoices_po_id_tbl_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."tbl_purchase_orders"("id") ON DELETE no action ON UPDATE no action;