import { type InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import { type users } from '~/server/db/schema';

export type Admin = InferSelectModel<typeof users>;

export const adminSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  // tambahkan field lain sesuai schema admin di database
});

export const GetAllReportsAdminInputSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['Draft', 'In Progress', 'Resolved', 'Backlog']).optional(),
});

export const CreateReportOutputSchema = z.array(
  z.object({
    id: z.string(),
    subject: z.string(),
    topic: z.string(),
    description: z.string(),
    status: z.enum(['Draft', 'In Progress', 'Resolved', 'Backlog']),
    attachment: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
  }),
);

export const SetReportStatusInputSchema = z.object({
  reportId: z.string(),
  status: z.enum(['Draft', 'In Progress', 'Resolved', 'Backlog']),
});

export const SetReportStatusOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
