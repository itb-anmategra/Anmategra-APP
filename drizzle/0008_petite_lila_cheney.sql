CREATE TABLE IF NOT EXISTS "anmategra_kehimpunan" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"lembaga_id" varchar(255) NOT NULL,
	"division" varchar(255) NOT NULL,
	"position" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "anmategra_kehimpunan" ADD CONSTRAINT "anmategra_kehimpunan_user_id_anmategra_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."anmategra_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "anmategra_kehimpunan" ADD CONSTRAINT "anmategra_kehimpunan_lembaga_id_anmategra_lembaga_id_fk" FOREIGN KEY ("lembaga_id") REFERENCES "public"."anmategra_lembaga"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
