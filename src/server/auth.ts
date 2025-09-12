import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { eq } from 'drizzle-orm';
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import type { DefaultJWT } from 'next-auth/jwt';
import AzureADProvider from 'next-auth/providers/azure-ad';
import Google from 'next-auth/providers/google';
import { env } from '~/env';
import { db } from '~/server/db';
import {
  accounts,
  lembaga,
  mahasiswa,
  sessions,
  users,
  verificationTokens,
  verifiedUsers,
} from '~/server/db/schema';

import daftarProdi from './db/kode-program-studi.json';

interface Prodi {
  kode: number;
  jurusan: string;
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      image: string;
      role: 'admin' | 'lembaga' | 'mahasiswa';
      lembagaId?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: 'admin' | 'lembaga' | 'mahasiswa';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    picture: string;
    role: 'admin' | 'lembaga' | 'mahasiswa';
    lembagaId?: string;
  }
}

interface AzureADProfile {
  oid: string;
  name: string;
  email: string;
  preferred_username: string;
  sub: string;
  nickname: string;
  picture: string;
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user, account }) => {
      // Initial token on first sign in
      if (user) {
        // jwt only returns user on sign in, otherwise it's undefined

        // insert mahasiswa table
        if (account?.provider === 'azure-ad') {
          const nim = user.email.split('@')[0];
          const kodeProdi = parseInt(nim!.substring(0, 3));
          const jurusan =
            daftarProdi.find((item: Prodi) => item.kode === kodeProdi)
              ?.jurusan ?? 'TPB';

          // asumsi cuma ada angkatan 2000-an
          const angkatan = parseInt(nim!.substring(3, 5)) + 2000;
          await insertMahasiswa(user.id, parseInt(nim!), jurusan, angkatan);

          token.role = user.role;
        }

        // insert Lembaga table
        else if (account?.provider === 'google') {
          const lembagaExists = await db.query.lembaga.findFirst({
            where: eq(lembaga.userId, user.id),
          });
          if (!lembagaExists) {
            await db
              .update(users)
              .set({ role: 'lembaga' })
              .where(eq(users.id, user.id))
              .returning();
            const lembaga_id = crypto.randomUUID();
            await db
              .insert(lembaga)
              .values({
                id: lembaga_id,
                userId: user.id,
                name: user.name,
                foundingDate: new Date(),
              })
              .returning();

            token.role = 'lembaga';
            token.lembagaId = lembaga_id;
          } else {
            token.role = user.role;
            token.lembagaId = lembagaExists.id;
          }
        }

        token.id = user.id;
        token.picture = user.image ?? '/images/placeholder/profile-pic.png';
      }
      return token;
    },

    session: async ({ session, token }) => {
      session.user.id = token.id;
      session.user.image = token.picture;
      session.user.role = token.role;
      session.user.lembagaId = token.lembagaId;
      return session;
    },

    signIn: async ({ user, account }) => {
      // signin lembaga
      if (account?.provider === 'google') {
        const isValidLembaga = user.email?.endsWith('@std.stei.itb.ac.id');
        const isVerified = await isEmailInVerifiedUsers(user.email);

        return isValidLembaga || isVerified;
      }

      // signin mahasiswa
      else if (account?.provider === 'azure-ad') {
        // cek email mahasiswa
        if (user.email?.endsWith('@mahasiswa.itb.ac.id')) {
          // cek nim valid
          const nim = user.email.split('@')[0];
          if (!nim || nim.length !== 8 || isNaN(parseInt(nim))) return false;

          // cari jurusan
          // const kodeProdi = parseInt(nim.substring(0, 3));
          // const jurusan = daftarProdi.find(
          //   (item: Prodi) => item.kode === kodeProdi,
          // )?.jurusan;

          // // cek jurusan valid
          // return !!jurusan;
          return true;
        }
        return false;
      }

      return true;
    },
  },
  session: {
    strategy: 'jwt',
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  pages: {
    error: '/auth-error',
  },
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    AzureADProvider<AzureADProfile>({
      clientId: env.AZURE_AD_CLIENT_ID,
      clientSecret: env.AZURE_AD_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      // tenantId: env.AZURE_AD_TENANT_ID,

      profile: (profile: AzureADProfile) => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.preferred_username ?? profile.email,
          image: undefined,
          role: 'mahasiswa' as const,
        };
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

const isEmailInVerifiedUsers = async (email: string) => {
  const user = await db.query.verifiedUsers.findFirst({
    where: eq(verifiedUsers.email, email),
  });

  return user !== undefined;
};

const insertMahasiswa = async (
  id: string,
  nim: number,
  jurusan: string,
  angkatan: number,
) => {
  const mahasiswaExists = await db.query.mahasiswa.findFirst({
    where: eq(mahasiswa.userId, id),
  });
  if (mahasiswaExists) return mahasiswaExists;

  const newMahasiswa = await db
    .insert(mahasiswa)
    .values({
      userId: id,
      nim: nim,
      jurusan: jurusan,
      angkatan: angkatan,
    })
    .returning();
  return newMahasiswa;
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
