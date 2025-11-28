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
	"is_deleted" boolean DEFAULT false
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
	"terms_id" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "tbl_purchase_orders_po_number_unique" UNIQUE("po_number")
);
--> statement-breakpoint
CREATE TABLE "tbl_purchase_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"requesting_department" varchar(100),
	"requester_employee_code" varchar(50),
	"date_of_request" timestamp DEFAULT now(),
	"required_date" date,
	"item_id" integer,
	"quantity" integer NOT NULL,
	"estimated_unit_price" numeric(15, 2),
	"total_estimated_cost" numeric(15, 2),
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
ALTER TABLE "tbl_categories" ADD CONSTRAINT "tbl_categories_parent_category_id_tbl_categories_id_fk" FOREIGN KEY ("parent_category_id") REFERENCES "public"."tbl_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_items" ADD CONSTRAINT "tbl_items_category_id_tbl_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."tbl_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_items" ADD CONSTRAINT "tbl_items_unit_of_measure_tbl_units_unit_id_fk" FOREIGN KEY ("unit_of_measure") REFERENCES "public"."tbl_units"("unit_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_grn_details" ADD CONSTRAINT "tbl_grn_details_grn_id_tbl_grn_headers_id_fk" FOREIGN KEY ("grn_id") REFERENCES "public"."tbl_grn_headers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_grn_details" ADD CONSTRAINT "tbl_grn_details_po_line_id_tbl_po_lines_id_fk" FOREIGN KEY ("po_line_id") REFERENCES "public"."tbl_po_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_grn_details" ADD CONSTRAINT "tbl_grn_details_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_grn_headers" ADD CONSTRAINT "tbl_grn_headers_po_id_tbl_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."tbl_purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_inventory_transactions" ADD CONSTRAINT "tbl_inventory_transactions_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_payments" ADD CONSTRAINT "tbl_payments_receipt_id_tbl_receipt_headers_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."tbl_receipt_headers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_po_distributions" ADD CONSTRAINT "tbl_po_distributions_po_line_id_tbl_po_lines_id_fk" FOREIGN KEY ("po_line_id") REFERENCES "public"."tbl_po_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_po_lines" ADD CONSTRAINT "tbl_po_lines_po_id_tbl_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."tbl_purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_po_lines" ADD CONSTRAINT "tbl_po_lines_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_purchase_requests" ADD CONSTRAINT "tbl_purchase_requests_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_receipt_headers" ADD CONSTRAINT "tbl_receipt_headers_store_id_tbl_warehouses_warehouse_code_fk" FOREIGN KEY ("store_id") REFERENCES "public"."tbl_warehouses"("warehouse_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_receipt_lines" ADD CONSTRAINT "tbl_receipt_lines_receipt_id_tbl_receipt_headers_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."tbl_receipt_headers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_receipt_lines" ADD CONSTRAINT "tbl_receipt_lines_item_id_tbl_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tbl_items"("id") ON DELETE no action ON UPDATE no action;