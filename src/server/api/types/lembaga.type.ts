import { z } from "zod";

export const GetInfoLembagaInputSchema = z.object({ lembagaId: z.string().nonempty() });

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

export const GetAllAnggotaLembagaInputSchema = z.object({lembagaId: z.string().nonempty()});

export const GetAllAnggotaLembagaOutputSchema = z.array(AnggotaLembagaSchema);

export const GetLembagaHighlightedEventInputSchema = z.object({lembagaId: z.string().nonempty()});

export const GetLembagaHighlightedEventOutputSchema = z.object({
    id: z.string(),
    nama: z.string(),
    deskripsi: z.string().nullable(),
    poster: z.string().url().nullable(),
}).nullable();

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
})

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
    nama: z.string().min(1, "Nama wajib diisi").max(30, "Nama maksimal 30 karakter"),
    deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter").max(100, "Deskripsi maksimal 100 krakater").optional(),
    gambar: z.string().url().optional(),
})

export const EditProfilLembagaOutputSchema = z.object({
    success: z.boolean(),
});