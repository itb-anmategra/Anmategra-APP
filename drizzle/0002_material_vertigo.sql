ALTER TABLE "anmategra_event" ALTER COLUMN "participant_limit" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "anmategra_event" ALTER COLUMN "participant_limit" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "anmategra_event" ALTER COLUMN "participant_count" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "anmategra_event" ALTER COLUMN "participant_count" SET NOT NULL;