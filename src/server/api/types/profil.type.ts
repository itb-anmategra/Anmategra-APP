import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { users, mahasiswa } from "~/server/db/schema";
import type { Kepanitiaan } from "~/types/kepanitiaan";

type User = InferSelectModel<typeof users>;
type Mahasiswa = InferSelectModel<typeof mahasiswa>;

export const GetMahasiswaInputSchema = z.object({mahasiswaId: z.string()});

export const GetMahasiswaOutputSchema = z.object({
    mahasiswaData: z.object({
        mahasiswa: z.custom<Mahasiswa>(),
        user: z.custom<User>(),
    }),
    newestEvent: z.array(z.custom<Kepanitiaan>()),
});

