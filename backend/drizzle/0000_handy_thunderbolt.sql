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
CREATE TABLE "tbl_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(100) NOT NULL,
	"category_code" varchar(20) NOT NULL,
	"parent_category_id" integer,
	"description" text,
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_categories_category_name_unique" UNIQUE("category_name"),
	CONSTRAINT "tbl_categories_category_code_unique" UNIQUE("category_code")
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
CREATE TABLE "tbl_grn_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"grn_id" integer NOT NULL,
	"po_line_id" integer,
	"item_id" integer NOT NULL,
	"uom" varchar(20),
	"ordered_qty" integer NOT NULL,
	"received_qty" integer NOT NULL,
	"accepted_qty" integer NOT NULL,
	"rejected_qty" integer DEFAULT 0,
	"storage_location_id" varchar(50),
	"condition_note" text,
	"qad_check" varchar(20),
	"qad_remarks" text,
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_grn_details_grn_id_po_line_id_unique" UNIQUE("grn_id","po_line_id")
);
--> statement-breakpoint
CREATE TABLE "tbl_grn_headers" (
	"id" serial PRIMARY KEY NOT NULL,
	"grn_number" varchar(50) NOT NULL,
	"receipt_date" timestamp DEFAULT now(),
	"po_id" integer,
	"supplier_id" varchar(50),
	"delivery_note_ref" varchar(100),
	"vehicle_reg_no" varchar(20),
	"received_by_user" varchar(50),
	"inspection_status" varchar(50),
	"remarks" text,
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_grn_headers_grn_number_unique" UNIQUE("grn_number")
);
--> statement-breakpoint
CREATE TABLE "tbl_inventory_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"transaction_type" varchar(20) NOT NULL,
	"quantity" integer NOT NULL,
	"reference" varchar(100),
	"notes" text,
	"performed_by" varchar(100),
	"transaction_date" timestamp DEFAULT now(),
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
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
CREATE TABLE "tbl_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"sku" varchar(20) NOT NULL,
	"item_name" varchar(100) NOT NULL,
	"category_id" integer,
	"unit_of_measure" varchar(20),
	"unit_cost" numeric(15, 2) DEFAULT '0',
	"selling_price" numeric(15, 2) DEFAULT '0',
	"vendor_code" varchar(50),
	"reorder_level" integer DEFAULT 0,
	"safety_stock" integer DEFAULT 0,
	"lead_time_days" integer DEFAULT 0,
	"storage_location" varchar(100),
	"batch_tracking" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"photo_path" text,
	"expiry_date" date,
	"discount_allowed" boolean DEFAULT false,
	"discount_rate" numeric(5, 2) DEFAULT '0',
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_items_sku_unique" UNIQUE("sku")
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
CREATE TABLE "tbl_modules" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_code" varchar(50) NOT NULL,
	"module_name" varchar(100) NOT NULL,
	"description" text,
	"icon" varchar(100),
	"route_path" varchar(200),
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_modules_module_code_unique" UNIQUE("module_code")
);
--> statement-breakpoint
CREATE TABLE "tbl_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"receipt_id" integer NOT NULL,
	"payment_type" varchar(20),
	"payment_amount" numeric(15, 2) NOT NULL,
	"tendered_amount" numeric(15, 2),
	"change_given" numeric(15, 2),
	"reference_number" varchar(50),
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tbl_po_distributions" (
	"id" serial PRIMARY KEY NOT NULL,
	"po_line_id" integer NOT NULL,
	"ship_to_location" varchar(100),
	"account_code" varchar(50),
	"distribution_quantity" integer NOT NULL,
	"due_date" date,
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tbl_po_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"po_id" integer NOT NULL,
	"line_number" integer NOT NULL,
	"item_id" integer NOT NULL,
	"description" text,
	"quantity" integer NOT NULL,
	"unit_price" numeric(15, 2) NOT NULL,
	"line_total" numeric(15, 2) NOT NULL,
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tbl_purchase_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"po_number" varchar(50) NOT NULL,
	"supplier_id" varchar(50),
	"po_date" timestamp DEFAULT now(),
	"buyer_id" varchar(50),
	"total_amount" numeric(15, 2) DEFAULT '0',
	"status" varchar(20) DEFAULT 'Draft',
	"payment_terms" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_purchase_orders_po_number_unique" UNIQUE("po_number")
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
CREATE TABLE "tbl_purchase_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"requesting_department" varchar(100),
	"requester_employee_code" varchar(50),
	"date_of_request" timestamp DEFAULT now(),
	"required_date" date,
	"justification" text,
	"maintenance_work_order" varchar(50),
	"status" varchar(20) DEFAULT 'Saved',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tbl_receipt_headers" (
	"id" serial PRIMARY KEY NOT NULL,
	"receipt_number" varchar(50) NOT NULL,
	"transaction_date" timestamp DEFAULT now(),
	"store_id" varchar(20),
	"cashier_id" varchar(50),
	"customer_id" varchar(50),
	"subtotal" numeric(15, 2) DEFAULT '0',
	"discount_total" numeric(15, 2) DEFAULT '0',
	"tax_total" numeric(15, 2) DEFAULT '0',
	"grand_total" numeric(15, 2) DEFAULT '0',
	"is_voided" boolean DEFAULT false,
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_receipt_headers_receipt_number_unique" UNIQUE("receipt_number")
);
--> statement-breakpoint
CREATE TABLE "tbl_receipt_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"receipt_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"product_snapshot_name" varchar(100),
	"quantity" integer NOT NULL,
	"unit_price" numeric(15, 2) NOT NULL,
	"line_discount" numeric(15, 2) DEFAULT '0',
	"line_tax_rate" numeric(5, 2) DEFAULT '0',
	"line_total" numeric(15, 2) NOT NULL,
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tbl_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_code" varchar(50) NOT NULL,
	"role_name" varchar(100) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_roles_role_code_unique" UNIQUE("role_code")
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
CREATE TABLE "tbl_units" (
	"id" serial PRIMARY KEY NOT NULL,
	"unit_id" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"abbreviation" varchar(20),
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_units_unit_id_unique" UNIQUE("unit_id")
);
--> statement-breakpoint
CREATE TABLE "tbl_user_module_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"module_id" integer NOT NULL,
	"can_view" boolean DEFAULT true,
	"can_create" boolean DEFAULT false,
	"can_edit" boolean DEFAULT false,
	"can_delete" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tbl_user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" serial NOT NULL,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tbl_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"token" varchar(1000),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_users_email_unique" UNIQUE("email")
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
CREATE TABLE "tbl_vendors" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor_code" varchar(50) NOT NULL,
	"vendor_name" varchar(200) NOT NULL,
	"contact_person" varchar(100),
	"email" varchar(100),
	"phone" varchar(20),
	"address" text,
	"city" varchar(100),
	"country" varchar(100),
	"payment_terms" varchar(50),
	"is_active" boolean DEFAULT true,
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_vendors_vendor_code_unique" UNIQUE("vendor_code")
);
--> statement-breakpoint
CREATE TABLE "tbl_warehouses" (
	"id" serial PRIMARY KEY NOT NULL,
	"warehouse_code" varchar(20) NOT NULL,
	"warehouse_name" varchar(100) NOT NULL,
	"street_address" text,
	"city" varchar(100),
	"country_code" varchar(10),
	"is_active" boolean DEFAULT true,
	"date_opened" date,
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_warehouses_warehouse_code_unique" UNIQUE("warehouse_code")
);
--> statement-breakpoint
ALTER TABLE "tbl_approval_history" ADD CONSTRAINT "tbl_approval_history_approval_instance_id_tbl_approval_instances_id_fk" FOREIGN KEY ("approval_instance_id") REFERENCES "public"."tbl_approval_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_approval_history" ADD CONSTRAINT "tbl_approval_history_approver_id_tbl_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_approval_instances" ADD CONSTRAINT "tbl_approval_instances_workflow_id_tbl_approval_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."tbl_approval_workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_approval_instances" ADD CONSTRAINT "tbl_approval_instances_submitted_by_tbl_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_approval_levels" ADD CONSTRAINT "tbl_approval_levels_workflow_id_tbl_approval_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."tbl_approval_workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_audit_logs" ADD CONSTRAINT "tbl_audit_logs_user_id_tbl_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_categories" ADD CONSTRAINT "tbl_categories_parent_category_id_tbl_categories_id_fk" FOREIGN KEY ("parent_category_id") REFERENCES "public"."tbl_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_document_attachments" ADD CONSTRAINT "tbl_document_attachments_uploaded_by_tbl_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_document_status_history" ADD CONSTRAINT "tbl_document_status_history_changed_by_tbl_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_grn_details" ADD CONSTRAINT "tbl_grn_details_grn_id_tbl_grn_headers_id_fk" FOREIGN KEY ("grn_id") REFERENCES "public"."tbl_grn_headers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_grn_details" ADD CONSTRAINT "tbl_grn_details_po_line_id_tbl_po_lines_id_fk" FOREIGN KEY ("po_line_id") REFERENCES "public"."tbl_po_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_grn_details" ADD CONSTRAINT "tbl_grn_details_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_grn_headers" ADD CONSTRAINT "tbl_grn_headers_po_id_tbl_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."tbl_purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_inventory_transactions" ADD CONSTRAINT "tbl_inventory_transactions_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_invoice_lines" ADD CONSTRAINT "tbl_invoice_lines_invoice_id_tbl_vendor_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."tbl_vendor_invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_invoice_lines" ADD CONSTRAINT "tbl_invoice_lines_po_line_id_tbl_po_lines_id_fk" FOREIGN KEY ("po_line_id") REFERENCES "public"."tbl_po_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_invoice_lines" ADD CONSTRAINT "tbl_invoice_lines_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_items" ADD CONSTRAINT "tbl_items_category_id_tbl_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."tbl_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_items" ADD CONSTRAINT "tbl_items_unit_of_measure_tbl_units_unit_id_fk" FOREIGN KEY ("unit_of_measure") REFERENCES "public"."tbl_units"("unit_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_material_issues" ADD CONSTRAINT "tbl_material_issues_from_warehouse_id_tbl_warehouses_id_fk" FOREIGN KEY ("from_warehouse_id") REFERENCES "public"."tbl_warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_material_issues" ADD CONSTRAINT "tbl_material_issues_to_warehouse_id_tbl_warehouses_id_fk" FOREIGN KEY ("to_warehouse_id") REFERENCES "public"."tbl_warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_material_issues" ADD CONSTRAINT "tbl_material_issues_requested_by_tbl_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_material_issues" ADD CONSTRAINT "tbl_material_issues_issued_by_tbl_users_id_fk" FOREIGN KEY ("issued_by") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_material_issue_lines" ADD CONSTRAINT "tbl_material_issue_lines_issue_id_tbl_material_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."tbl_material_issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_material_issue_lines" ADD CONSTRAINT "tbl_material_issue_lines_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_payments" ADD CONSTRAINT "tbl_payments_receipt_id_tbl_receipt_headers_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."tbl_receipt_headers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_po_distributions" ADD CONSTRAINT "tbl_po_distributions_po_line_id_tbl_po_lines_id_fk" FOREIGN KEY ("po_line_id") REFERENCES "public"."tbl_po_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_po_lines" ADD CONSTRAINT "tbl_po_lines_po_id_tbl_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."tbl_purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_po_lines" ADD CONSTRAINT "tbl_po_lines_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_purchase_request_lines" ADD CONSTRAINT "tbl_purchase_request_lines_pr_id_tbl_purchase_requests_id_fk" FOREIGN KEY ("pr_id") REFERENCES "public"."tbl_purchase_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_purchase_request_lines" ADD CONSTRAINT "tbl_purchase_request_lines_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_receipt_headers" ADD CONSTRAINT "tbl_receipt_headers_store_id_tbl_warehouses_warehouse_code_fk" FOREIGN KEY ("store_id") REFERENCES "public"."tbl_warehouses"("warehouse_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_receipt_lines" ADD CONSTRAINT "tbl_receipt_lines_receipt_id_tbl_receipt_headers_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."tbl_receipt_headers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_receipt_lines" ADD CONSTRAINT "tbl_receipt_lines_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_stock_balances" ADD CONSTRAINT "tbl_stock_balances_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_stock_balances" ADD CONSTRAINT "tbl_stock_balances_warehouse_id_tbl_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."tbl_warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_stock_balances" ADD CONSTRAINT "tbl_stock_balances_last_transaction_id_tbl_inventory_transactions_id_fk" FOREIGN KEY ("last_transaction_id") REFERENCES "public"."tbl_inventory_transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_three_way_matching" ADD CONSTRAINT "tbl_three_way_matching_po_line_id_tbl_po_lines_id_fk" FOREIGN KEY ("po_line_id") REFERENCES "public"."tbl_po_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_three_way_matching" ADD CONSTRAINT "tbl_three_way_matching_grn_detail_id_tbl_grn_details_id_fk" FOREIGN KEY ("grn_detail_id") REFERENCES "public"."tbl_grn_details"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_three_way_matching" ADD CONSTRAINT "tbl_three_way_matching_invoice_line_id_tbl_invoice_lines_id_fk" FOREIGN KEY ("invoice_line_id") REFERENCES "public"."tbl_invoice_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_three_way_matching" ADD CONSTRAINT "tbl_three_way_matching_matched_by_tbl_users_id_fk" FOREIGN KEY ("matched_by") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_user_module_permissions" ADD CONSTRAINT "tbl_user_module_permissions_user_id_tbl_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_user_module_permissions" ADD CONSTRAINT "tbl_user_module_permissions_module_id_tbl_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."tbl_modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_user_roles" ADD CONSTRAINT "tbl_user_roles_user_id_tbl_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_user_roles" ADD CONSTRAINT "tbl_user_roles_role_id_tbl_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."tbl_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_vendor_invoices" ADD CONSTRAINT "tbl_vendor_invoices_po_id_tbl_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."tbl_purchase_orders"("id") ON DELETE no action ON UPDATE no action;