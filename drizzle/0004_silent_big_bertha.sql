ALTER TABLE "anmategra_account" DROP CONSTRAINT "anmategra_account_user_id_anmategra_user_id_fk";
--> statement-breakpoint
ALTER TABLE "anmategra_lembaga" DROP CONSTRAINT "anmategra_lembaga_user_id_anmategra_user_id_fk";
--> statement-breakpoint
ALTER TABLE "anmategra_mahasiswa" DROP CONSTRAINT "anmategra_mahasiswa_user_id_anmategra_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "anmategra_account" ADD CONSTRAINT "anmategra_account_user_id_anmategra_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."anmategra_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "anmategra_lembaga" ADD CONSTRAINT "anmategra_lembaga_user_id_anmategra_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."anmategra_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "anmategra_mahasiswa" ADD CONSTRAINT "anmategra_mahasiswa_user_id_anmategra_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."anmategra_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
