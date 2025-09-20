import { request } from 'http';
import { z } from 'zod';

export const GetInfoLembagaInputSchema = z.object({
  lembagaId: z.string().nonempty(),
});

export const GetInfoLembagaOutputSchema = z.object({
  id: z.string(),
  nama: z.string(),
  foto: z.string().url().nullable(),
  deskripsi: z.string().nullable(),
  tanggal_berdiri: z.date().nullable(),
  tipe_lembaga: z.string().nullable(),
  detail_tambahan: z.object({
    jurusan: z.string().nullable(),
    bidang: z.string().nullable(),
    jumlah_anggota: z.number().min(0).nullable(),
  }),
});

const AnggotaLembagaSchema = z.object({
  id: z.string(),
  nama: z.string(),
  nim: z.string(),
  divisi: z.string(),
  posisi: z.string(),
  posisiColor: z.string(),
});

export const GetAllAnggotaLembagaInputSchema = z.object({
  lembagaId: z.string().nonempty(),
});

export const GetAllAnggotaLembagaOutputSchema = z.array(AnggotaLembagaSchema);

const AssociationSchema = z.object({
  event_id: z.string(),
  event_name: z.string(),
  user_id: z.string(),
  mahasiswa_name: z.string(),
  division: z.string(),
  position: z.string(),
});

export const GetAllRequestAssociationOutputSchema = z.array(AssociationSchema);

export const GetLembagaHighlightedEventInputSchema = z.object({
  lembagaId: z.string().nonempty(),
});

export const GetLembagaHighlightedEventOutputSchema = z
  .object({
    id: z.string(),
    nama: z.string(),
    deskripsi: z.string().nullable(),
    poster: z.string().url().nullable(),
  })
  .nullable();

export const GetLembagaEventsInputSchema = z.object({
  lembagaId: z.string().nonempty(),
  page: z.number().min(1).default(1),
});

const KegiatanSchema = z.object({
  id: z.string(),
  nama: z.string(),
  deskripsi: z.string().nullable(),
  poster: z.string().url().nullable(),
  start_date: z.date(),
});

export const GetLembagaEventsOutputSchema = z.object({
  events: z.array(KegiatanSchema),
  totalPages: z.number().min(1),
});

export const AddAnggotaLembagaInputSchema = z.object({
  user_id: z.string().nonempty(),
  division: z.string().nonempty(),
  position: z.string().nonempty(),
});

export const AddAnggotaLembagaOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});

export const RemoveAnggotaLembagaInputSchema = z.object({
  user_id: z.string().nonempty(),
});

export const RemoveAnggotaLembagaOutputSchema = z.object({
  success: z.boolean(),
});

export const EditProfilLembagaInputSchema = z.object({
  nama: z
    .string()
    .min(1, 'Nama wajib diisi')
    .max(30, 'Nama maksimal 30 karakter'),
  deskripsi: z
    .string()
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(100, 'Deskripsi maksimal 100 karakter')
    .optional(),
  gambar: z.string().url().optional(),
});

export const EditProfilLembagaOutputSchema = z.object({
  success: z.boolean(),
});

export const AcceptRequestAssociationInputSchema = z.object({
  event_id: z.string().nonempty(),
  user_id: z.string().nonempty(),
  division: z.string().nonempty(),
  position: z.string().nonempty(),
});

export const AcceptRequestAssociationOutputSchema = z.object({
  success: z.boolean(),
});

export const DeclineRequestAssociationInputSchema = z.object({
  event_id: z.string().nonempty(),
  user_id: z.string().nonempty(),
  division: z.string().nonempty(),
  position: z.string().nonempty(),
});

export const DeclineRequestAssociationOutputSchema = z.object({
  success: z.boolean(),
});

export const GetBestStaffOptionsInputSchema = z.object({
  event_id: z.string().nonempty(),
  division: z.string().nonempty(),
});

export const GetBestStaffOptionsOutputSchema = z.object({
  staff_options: z.array(
    z.object({
      user_id: z.string(),
      name: z.string(),
    }),
  ),
});

export const GetAllRequestAssociationLembagaOutputSchema = z.object({
  requests: z.array(
    z.object({
      user_id: z.string(),
      mahasiswa_name: z.string(),
      division: z.string(),
      position: z.string(),
    }),
  ),
});
