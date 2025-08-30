import { z } from "zod";

export const GetTambahAnggotaLembagaOptionsInputSchema = z.object({ lembagaId: z.string() });

export const GetTambahAnggotaLembagaOptionsOutputSchema = z.object({
    mahasiswa: z.array(z.object({
        value: z.string(),
        label: z.string(),
    })),
    posisi: z.array(z.object({
        value: z.string(),
        label: z.string(),
    })),
    bidang: z.array(z.object({
        value: z.string(),
        label: z.string(),
    })),
});

export const GetTambahAnggotaKegiatanOptionsInputSchema = z.object({kegiatanId: z.string()});

export const GetTambahAnggotaKegiatanOptionsOutputSchema = GetTambahAnggotaLembagaOptionsOutputSchema;