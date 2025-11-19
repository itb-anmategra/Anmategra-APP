import { type z } from 'zod';
import RaporIndividuHeader from '~/app/_components/rapor/individu/rapor-individu-header';
import { RaporBreadcrumb } from '~/app/_components/rapor/rapor-breadcrumb';
import ProfilTable from '~/app/_components/table/event-profil-table';
import { type GetAllProfilOutputSchema } from '~/server/api/types/profil.type';
import { type GetNilaiKegiatanIndividuOutputSchema } from '~/server/api/types/rapor.type';
import { api } from '~/trpc/server';

type NilaiKegiatanOutput = z.infer<typeof GetNilaiKegiatanIndividuOutputSchema>;
export type ProfilOutput = z.infer<typeof GetAllProfilOutputSchema>;

export type HeaderDataProps = {
  dataNilaiProfil: NilaiKegiatanOutput | null;
  kegiatanId?: string;
};

interface RaporIndividuPanitiaPageProps {
  params: {
    kegiatanId: string;
    raporId: string;
  };
}

export default async function RaporIndividuPanitiaPage({
  params,
}: RaporIndividuPanitiaPageProps) {
  const { kegiatanId, raporId } = params;

  try {
    const [raporData, profilData, profilKMData] = await Promise.all([
      api.rapor.getNilaiKegiatanIndividu({
        event_id: kegiatanId,
        mahasiswa_id: raporId,
      }),
      api.profil.getAllProfilKegiatan({
        event_id: kegiatanId,
      }),
      api.profil.getAllProfilKM(),
    ]);

    const profilKMMap = new Map(
      profilKMData.profil_km.map((km) => [km.id, km.description]),
    );

    const profilKegiatanList =
      'profil_kegiatan' in profilData
        ? profilData.profil_kegiatan.map((kegiatan) => ({
            name: kegiatan.name,
            description: kegiatan.description,
          }))
        : [];

    const mappingData =
      'profil_kegiatan' in profilData
        ? profilData.profil_kegiatan.flatMap((kegiatan) =>
            kegiatan.profil_km_id.map((kmId) => ({
              profilKMDescription: profilKMMap.get(kmId) ?? 'Unknown',
              profilKegiatanName: kegiatan.name,
              profilKegiatanDescription: kegiatan.description,
            })),
          )
        : [];

    return (
      <main className="flex flex-col p-4 sm:p-6 md:p-8 min-h-screen w-full overflow-hidden">
        <div className="flex flex-col pb-4 sm:pb-6 md:pb-7 border-b border-neutral-400 mb-6 sm:mb-7 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-[32px] font-semibold mb-2 text-neutral-1000">
            Rapor Individu
          </h1>
          <RaporBreadcrumb
            items={[
              { label: 'Kegiatan', href: '/lembaga/kegiatan' },
              { label: 'Panitia', href: '/lembaga/kegiatan' },
              { label: 'Rapor Individu', href: '/lembaga/kegiatan' },
            ]}
          />
        </div>

        <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 w-full">
          <RaporIndividuHeader
            dataNilaiProfil={raporData}
            id={kegiatanId}
            isLembaga={false}
          />

          <div className="flex flex-col gap-y-3 sm:gap-y-4 w-full min-w-0">
            <h2 className="text-neutral-700 text-lg sm:text-xl md:text-[20px] font-normal">
              Profil Kegiatan
            </h2>
            <ProfilTable
              profilData={profilKegiatanList}
              showMapping={false}
              isLembaga={false}
            />
          </div>

          <div className="flex flex-col gap-y-3 sm:gap-y-4 w-full min-w-0">
            <h2 className="text-neutral-700 text-lg sm:text-xl md:text-[20px] font-normal">
              Detail Pemetaan Profil Kegiatan
            </h2>
            <ProfilTable
              profilData={mappingData}
              showMapping={true}
              isLembaga={false}
            />
          </div>
        </div>
      </main>
    );
  } catch {
    return (
      <main className="flex flex-col p-4 sm:p-6 md:p-8 min-h-screen w-full overflow-hidden">
        <div className="flex flex-col pb-4 sm:pb-6 md:pb-7 border-b border-neutral-400 mb-6 sm:mb-7 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-[32px] font-semibold mb-2 text-neutral-1000">
            Rapor Individu
          </h1>
          <RaporBreadcrumb
            items={[
              { label: 'Kegiatan', href: '/lembaga/kegiatan' },
              { label: 'Panitia', href: '/lembaga/kegiatan' },
              { label: 'Rapor Individu', href: '/lembaga/kegiatan' },
            ]}
          />
        </div>
        <div className="text-center py-6 sm:py-8">
          <p className="text-sm sm:text-base text-neutral-500">Gagal memuat data rapor individu</p>
        </div>
      </main>
    );
  }
}
