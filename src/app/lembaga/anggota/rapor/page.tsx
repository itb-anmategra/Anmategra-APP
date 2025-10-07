'use client';

import { SearchBar } from '~/app/_components/placeholder/search-bar';
import { RaporBreadcrumb } from '~/app/_components/rapor/rapor-breadcrumb';
import RaporTable from '~/app/_components/rapor/rapor-table';
import { api } from '~/trpc/react';

export default function RaporPage() {
  // const { data: session } = useSession();
  // const lembaga_id = session?.user?.lembagaId

  // TODO: Replace with dynamic session data
  const lembaga_id = 'lembaga-5';

  const { data: profilKMData, isLoading: profilKMLoading } =
    api.profil.getAllProfilKM.useQuery();

  const selectOptions =
    profilKMData?.profil_km.map((profil) => ({
      value: profil.id,
      label: profil.description,
    })) ?? [];

  if (profilKMLoading) {
    return (
      <main className="flex flex-col p-8 min-h-screen">
        <h1 className="text-[32px] font-semibold mb-2">Rapor Anggota</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col p-8 min-h-screen">
      <h1 className="text-[32px] font-semibold mb-2">Rapor Anggota</h1>
      <RaporBreadcrumb
        items={[
          { label: 'Anggota', href: '/lembaga/anggota' },
          { label: 'Rapor', href: '/lembaga/anggota/rapor' },
        ]}
      />
      <div className="mb-4" />
      <SearchBar placeholder="Cari nama anggota" />
      <div className="mb-6" />

      <RaporTable
        lembaga_id={lembaga_id}
        type="lembaga"
        selectOptions={selectOptions}
      />
    </main>
  );
}
