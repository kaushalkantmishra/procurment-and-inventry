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
ALTER TABLE "tbl_users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tbl_users" ADD COLUMN "password_hash" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "tbl_user_roles" ADD CONSTRAINT "tbl_user_roles_user_id_tbl_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_user_roles" ADD CONSTRAINT "tbl_user_roles_role_id_tbl_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."tbl_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_users" DROP COLUMN "profile";--> statement-breakpoint
ALTER TABLE "tbl_users" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "tbl_users" DROP COLUMN "role";