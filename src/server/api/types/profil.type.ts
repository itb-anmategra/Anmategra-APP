import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { users, mahasiswa, events } from "~/server/db/schema";
import type { Kepanitiaan } from "~/types/kepanitiaan";

type User = InferSelectModel<typeof users>;
type Mahasiswa = InferSelectModel<typeof mahasiswa>;
type Event = InferSelectModel<typeof events>;

export const GetMahasiswaInputSchema = z.object({mahasiswaId: z.string()});

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

export const GetLembagaInputSchema = z.object({lembagaId: z.string()});

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

export const GetKegiatanInputSchema = z.object({kegiatanId: z.string()});

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