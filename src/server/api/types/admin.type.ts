import { type InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import { supportStatusEnum, type users } from '~/server/db/schema';

export type Admin = InferSelectModel<typeof users>;

export const adminSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  // tambahkan field lain sesuai schema admin di database
});

export const GetAllReportsAdminInputSchema = z.object({
  search: z.string().optional(),
  status: z.enum(supportStatusEnum.enumValues).optional(),
});

export const GetAllReportsAdminOutputSchema = z.object({
  reports: z.array(
    z.object({
      id: z.string(),
      subject: z.string(),
      topic: z.string(),
      description: z.string(),
      status: z.enum(supportStatusEnum.enumValues),
      attachment: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    }),
  ),
});

export const SetReportStatusInputSchema = z.object({
  id: z.string(),
  status: z.enum(supportStatusEnum.enumValues),
});

export const SetReportStatusOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
