import type { InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import type { events, mahasiswa, users } from '~/server/db/schema';
import type { Kepanitiaan } from '~/types/kepanitiaan';

type User = InferSelectModel<typeof users>;
type Mahasiswa = InferSelectModel<typeof mahasiswa>;
type Event = InferSelectModel<typeof events>;

export const GetMahasiswaInputSchema = z.object({ mahasiswaId: z.string() });

export const GetMahasiswaOutputSchema = z.object({
  mahasiswaData: z.object({
    mahasiswa: z.custom<Mahasiswa>(),
    user: z.custom<User>(),
  }),
  newestEvent: z.array(z.custom<Kepanitiaan>()),
});

const PanitiaKegiatanSchema = z.object({
  id: z.string(),
  nama: z.string(),
  nim: z.string(),
  jurusan: z.string(),
  image: z.string().url().nullable(),
  divisi: z.string().nullable(),
  posisi: z.string().nullable(),
  posisiColor: z.string(),
});

export const GetLembagaInputSchema = z.object({ lembagaId: z.string() });

export const GetLembagaOutputSchema = z.object({
  lembagaData: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    memberCount: z.number().nullable(),
    foundingDate: z.date().nullable(),
    endingDate: z.date().nullable(),
    type: z.string().nullable(),
    users: z.object({
      id: z.string(),
      image: z.string().url().nullable(),
    }),
  }),
  newestEvent: z.array(z.custom<Kepanitiaan>()),
  highlightedEvent: z.custom<Event>().nullable(),
  anggota: z.array(PanitiaKegiatanSchema),
});

export const GetKegiatanInputSchema = z.object({ kegiatanId: z.string() });

export const GetKegiatanOutputSchema = z.object({
  kegiatan: z.custom<Event>(),
  lembaga: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    image: z.string().url().nullable(),
    memberCount: z.number().nullable(),
    foundingDate: z.date().nullable(),
    endingDate: z.date().nullable(),
    type: z.string().nullable(),
  }),
  participant: z.array(PanitiaKegiatanSchema),
});

export const GetAllProfilKegiatanInputSchema = z.object({
  event_id: z.string(),
});

const ProfilSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  profil_km_id: z.array(z.string()),
});

export const GetAllProfilOutputSchema = z
  .object({ profil_lembaga: z.array(ProfilSchema) })
  .or(z.object({ profil_kegiatan: z.array(ProfilSchema) }));

export const GetAllProfilLembagaInputSchema = z.object({
  lembaga_id: z.string(),
});

export const CreateProfilKegiatanInputSchema = z.object({
  event_id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  profil_km_id: z.array(z.string().min(1)).min(1),
});

export const CreateProfilKegiatanOutputSchema = z.object({
  profil_id: z.string(),
  event_id: z.string(),
  name: z.string(),
  description: z.string(),
  profil_km_id: z.array(z.string()),
});

export const CreateProfilLembagaInputSchema = z.object({
  lembaga_id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  profil_km_id: z.array(z.string().min(1)).min(1),
});

export const CreateProfilLembagaOutputSchema = z.object({
  profil_id: z.string(),
  lembaga_id: z.string(),
  name: z.string(),
  description: z.string(),
  profil_km_id: z.array(z.string()),
});

export const DeleteProfilInputSchema = z.object({ profil_id: z.string() });

export const DeleteProfilOutputSchema = z.object({ success: z.boolean() });

export const EditProfilInputSchema = z.object({
  profil_id: z.string(),
  name: z.string(),
  description: z.string(),
  profil_km_id: z.array(z.string()),
});

export const EditProfilOutputSchema = z.object({ success: z.boolean() });
