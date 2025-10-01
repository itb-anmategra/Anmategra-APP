import { z } from 'zod';
import type { Kepanitiaan } from '~/types/kepanitiaan';

export const GetRecentEventsOutputSchema = z.array(z.custom<Kepanitiaan>());

export const GetTopEventsOutputSchema = z.array(z.custom<Kepanitiaan>());

export const SearchAllQueryInputSchema = z.object({ query: z.string() });

export const MahasiswaSchema = z.object({
  user_id: z.string(),
  nama: z.string(),
  nim: z.string(),
  jurusan: z.string(),
  image: z.string().url().optional(),
});

export const SearchAllOutputSchema = z.object({
  mahasiswa: z.array(MahasiswaSchema),
  lembaga: z.array(z.custom<Kepanitiaan>()),
  kegiatan: z.array(z.custom<Kepanitiaan>()),
});
