ALTER TABLE "customers" RENAME COLUMN "user" TO "users";--> statement-breakpoint
ALTER TABLE "customers" DROP CONSTRAINT "customers_user_users_id_fk";
--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_users_users_id_fk" FOREIGN KEY ("users") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;