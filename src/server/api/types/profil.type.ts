import { z } from 'zod';

const ProfilSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  profil_km_id: z.array(z.string()),
});

export const GetAllProfilKegiatanInputSchema = z.object({
  event_id: z.string(),
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
