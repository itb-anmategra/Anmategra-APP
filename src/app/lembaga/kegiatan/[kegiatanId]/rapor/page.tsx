import { RaporBreadcrumb } from '~/app/_components/breadcrumb';
import { SearchBar } from '~/app/_components/placeholder/search-bar';
import RaporTable from '~/app/_components/rapor/rapor-table';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

interface RaporPageProps {
  params: {
    kegiatanId: string;
  };
}

export default async function RaporPage({ params }: RaporPageProps) {
  const session = await getServerAuthSession();
  const event_id = params.kegiatanId;

  if (!session || !event_id) {
    return (
      <main className="flex flex-col p-8 min-h-screen">
        <h1 className="text-[32px] font-semibold mb-2">Rapor Panitia</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </main>
    );
  }

  const profilKMData = await api.profil.getAllProfilKM();

  const selectOptions =
    profilKMData?.profil_km.map((profil) => ({
      value: profil.id,
      label: profil.description,
    })) ?? [];

  const event = await api.event.getByID({ id: event_id });

  return (
    <main className="flex flex-col p-8 min-h-screen">
      <h1 className="text-[32px] font-semibold mb-2">
        Rapor Panitia {event?.name ?? ''}
      </h1>
      <RaporBreadcrumb
        items={[
          { label: 'Kegiatan', href: `/kegiatan/${event_id}/panitia` },
          { label: 'Rapor', href: `/kegiatan/${event_id}/rapor` },
        ]}
      />
      <div className="mb-4" />
      <SearchBar placeholder="Cari nama panitia" />
      <div className="mb-6" />

      <RaporTable
        session={session}
        event_id={event_id}
        type="event"
        selectOptions={selectOptions}
      />
    </main>
  );
}
