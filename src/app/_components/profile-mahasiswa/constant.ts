import { type Session } from 'next-auth';
import { type z } from 'zod';
import { type GetMahasiswaOutputSchema } from '~/server/api/types/profile.type';
import { type Kepanitiaan } from '~/types/kepanitiaan';

type GetMahasiswaOutput = z.infer<typeof GetMahasiswaOutputSchema>;

interface ProfileMahasiswaContentProps {
  session: Session | null;
  user_id: string;
  mahasiswaData: GetMahasiswaOutput['mahasiswaData'];
  newestEvent: Kepanitiaan[] | null;
  isLembagaView: boolean;
}

export type { ProfileMahasiswaContentProps };
