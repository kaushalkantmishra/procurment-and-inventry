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
	CONSTRAINT "tbl_modules_module_code_unique" UNIQUE("module_code")
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
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "tbl_user_module_permissions" ADD CONSTRAINT "tbl_user_module_permissions_user_id_tbl_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_user_module_permissions" ADD CONSTRAINT "tbl_user_module_permissions_module_id_tbl_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."tbl_modules"("id") ON DELETE no action ON UPDATE no action;