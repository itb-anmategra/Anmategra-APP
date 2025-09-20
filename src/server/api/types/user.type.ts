import { z } from 'zod';

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

export const RequestAssociationLembagaInputSchema = z.object({
  lembaga_id: z.string(),
  division: z.string(),
  position: z.string(),
});

export const RequestAssociationLembagaOutputSchema = z.object({
  success: z.boolean(),
});
