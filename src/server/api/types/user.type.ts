import { type InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import { type mahasiswa, type users } from '~/server/db/schema';

type User = InferSelectModel<typeof users>;
type Mahasiswa = InferSelectModel<typeof mahasiswa>;

export const GetTambahAnggotaLembagaOptionsInputSchema = z.object({
  lembagaId: z.string(),
});

export const GetTambahAnggotaLembagaOptionsOutputSchema = z.object({
  mahasiswa: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
  nim: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
  posisi: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
  bidang: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
});

export const GetTambahAnggotaKegiatanOptionsInputSchema = z.object({
  kegiatanId: z.string(),
});

export const GetTambahAnggotaKegiatanOptionsOutputSchema =
  GetTambahAnggotaLembagaOptionsOutputSchema;

export const EditProfilMahasiswaInputSchema = z.object({
  image: z.string().url().optional(),
  idLine: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 3 && val.length <= 30)),
  noWhatsapp: z
    .string()
    .optional()
    .refine((val) => !val || /^0\d{10,12}$/.test(val)),
});

export const RequestAssociationInputSchema = z.object({
  event_id: z.string(),
  division: z.string(),
  position: z.string(),
});

export const RequestAssociationOutputSchema = z.object({
  success: z.boolean(),
});

export const GetMahasiswaByIdInputSchema = z.object({
  userId: z.string(),
});

export const GetMahasiswaByNameInputSchema = z.object({
  name: z.string(),
});

export const GetMahasiswaByNimInputSchema = z.object({
  nim: z.string(),
});

export const GetMahasiswaOutputSchema = z.object({
  mahasiswaData: z.object({
    mahasiswa: z.custom<Mahasiswa>(),
    user: z.custom<User>(),
  }),
});

export const GetPanitiaByIdInputSchema = z.object({
  userId: z.string(),
  kegiatanId: z.string(),
});

export const GetPanitiaOutputSchema = z.object({
  id: z.string(),
  nama: z.string(),
  nim: z.string(),
  divisi: z.string(),
  posisi: z.string(),
});

export const GetPanitiaByNameInputSchema = z.object({
  name: z.string(),
  kegiatanId: z.string(),
});

export const GetAnggotaByIdInputSchema = z.object({
  userId: z.string(),
  lembagaId: z.string(),
});

export const GetAnggotaOutputSchema = GetPanitiaOutputSchema;

export const GetAnggotaByNameInputSchema = z.object({
  name: z.string(),
  lembagaId: z.string(),
});
