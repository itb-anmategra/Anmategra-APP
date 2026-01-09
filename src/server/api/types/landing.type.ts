import { z } from "zod";
import type { Kepanitiaan } from "~/types/kepanitiaan";

export const GetRecentEventsOutputSchema = z.array(z.custom<Kepanitiaan>());

export const GetTopEventsOutputSchema = z.array(z.custom<Kepanitiaan>());

export const SearchAllQueryInputSchema = z.object({query: z.string()});

export const MahasiswaSchema = z.object({
    userId: z.string(),
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

export const searchPreviewInputSchema = z.object({
    query: z.string(),
});

export const searchPreviewOutputSchema = z.object({
    mahasiswa: z.array(
        z.object({
            userId: z.string(),
            nama: z.string(),
            nim: z.string(),
        }),
    ),
    lembaga: z.array(
        z.object({
            lembagaId: z.string(),
            name: z.string(),
        })
    ),
    kegiatan: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
        }),
    ),
});