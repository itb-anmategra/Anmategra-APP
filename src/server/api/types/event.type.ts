import type { InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import type { events } from '~/server/db/schema';

type Event = InferSelectModel<typeof events>;

export const CreateEventInputSchema = z.object({
  name: z.string().min(1, 'Nama kegiatan wajib diisi'),
  description: z
    .string()
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(100, 'Deskripsi maksimal 100 karakter'),
  image: z.string().url('Harus berupa URL yang valid'),
  start_date: z.string().datetime(),
  end_date: z.string().datetime().nullable().optional(),
  status: z.enum(['Coming Soon', 'On going', 'Ended']),
  oprec_link: z
    .string()
    .url('Harus berupa URL yang valid')
    .or(z.literal(''))
    .optional(),
  location: z.string().min(3, 'Lokasi minimal 3 karakter'),
  participant_limit: z.number().int().min(1, 'Minimal 1 peserta'),
  participant_count: z.number().int().min(0, 'Minimal 0 peserta'),
  is_highlighted: z.boolean().optional(),
  is_organogram: z.boolean().optional(),
  background_image: z.string().url('Harus berupa URL yang valid').optional(),
});

export const CreateEventOutputSchema = z.custom<Event>();

export const UpdateEventInputSchema = CreateEventInputSchema.partial().extend({
  id: z.string(),
});

export const UpdateEventOutputSchema = z.custom<Event>();

export const DeleteEventInputSchema = z.object({
  id: z.string(),
});

export const DeleteEventOutputSchema = z.object({
  success: z.boolean(),
  id: z.string(),
});

export const AddNewPanitiaKegiatanInputSchema = z.object({
  event_id: z.string(),
  user_id: z.string(),
  position: z.string(),
  division: z.string(),
});

export const AddNewPanitiaKegiatanOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const RemovePanitiaKegiatanInputSchema = z.object({
  event_id: z.string(),
  id: z.string(),
});

export const RemovePanitiaKegiatanOutputSchema =
  AddNewPanitiaKegiatanOutputSchema;

const PanitiaKegiatanSchema = z.object({
  id: z.string(),
  nama: z.string(),
  nim: z.string(),
  divisi: z.string(),
  posisi: z.string(),
  posisiColor: z.string(),
});

export const GetAllAnggotaKegiatanInputSchema = z.object({
  event_id: z.string(),
});

export const GetAllAnggotaKegiatanOutputSchema = z.array(PanitiaKegiatanSchema);
