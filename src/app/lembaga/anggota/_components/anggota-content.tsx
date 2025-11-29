'use client';

import { type Session } from 'next-auth';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import Rapor from '~/../public/icons/assessment.svg';
import Best from '~/../public/icons/best.svg';
import Upload from '~/../public/icons/export-button.svg';
import SearchIcon from '~/../public/icons/search.svg';
// Import the magnifying glass icon
import FilterDropdown, {
  type FilterOption,
} from '~/app/_components/filter/filter-dropdown';
import { type comboboxDataType } from '~/app/_components/form/tambah-anggota-form';
import { TambahAnggotaDialog } from '~/app/lembaga/_components/tambah-anggota-dialog';
import {
  MahasiswaCardTable,
  type Member,
} from '~/app/lembaga/anggota/_components/table/mahasiswa-card-table';
import { MahasiswaKegiatanCardTable } from '~/app/lembaga/anggota/_components/table/mahasiswa-kegiatan-card-table';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import BestStaff from '../../_components/best-staff-form';

export default function AnggotaContent({
  session,
  data,
  dataAddAnggota,
  pageAnggota,
}: {
  session: Session | null;
  data: Member[];
  dataAddAnggota: {
    mahasiswa: comboboxDataType[];
    nim: comboboxDataType[];
    posisi: comboboxDataType[];
    bidang: comboboxDataType[];
  };
  pageAnggota?: boolean;
}) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const isAnggota = pageAnggota ?? false;
  const eventId = !isAnggota && pathname ? pathname.split('/')[3] : undefined;
  const lembagaId = session?.user.lembagaId ?? undefined;
  let tableData;
  if (!isAnggota && pathname) {
    tableData = data.map((member) => {
      return {
        ...member,
        event_id: pathname.split('/')[3],
      };
    });
  }

  const filterOptions: FilterOption[] = useMemo(
    () =>
      dataAddAnggota.bidang.map((bidang) => ({
        id: bidang.value,
        label: bidang.label,
        value: bidang.value,
      })),
    [dataAddAnggota.bidang],
  );

  const handleFilterChange = useCallback((filters: string[]) => {
    setSelectedFilters(filters);
    // TODO: Implement server-side filtering when BE is ready
  }, []);

  return (
    <main className="flex flex-row bg-[#FAFAFA] w-full p-6">
      {/* Content */}
      <div className="flex-1 space-y-4">
        {/* Search Bar */}
        <div className="w-full">
          <p className="text-[32px] mb-4 font-semibold">
            {isAnggota ? <span>Anggota</span> : <span>Panitia Kegiatan</span>}
          </p>
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full">
              <Image
                src={SearchIcon}
                alt="Search"
                width={20}
                height={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                className="rounded-[24px] pl-12 pr-4 border-[1px] border-neutral-400 w-full text-lg"
                placeholder="Cari nama anggota"
              />
            </div>
          </div>
        </div>

        {/* List Anggota */}
        <div>
          {/* Button Section */}
          <div className="flex">
            <div className="justify-between flex flex-row w-full">
              <div className="flex gap-x-5">
                <TambahAnggotaDialog
                  session={session}
                  dataAddAnggota={dataAddAnggota}
                />
                {isAnggota && (
                  <Button
                    variant="light_blue"
                    className="rounded-[16px] px-3 shadow-none flex items-center gap-2 text-lg"
                    onClick={() => {
                      router.push('/anggota/rapor');
                    }}
                  >
                    <Image
                      src={Rapor}
                      alt="Rapor Komunal"
                      width={24}
                      height={24}
                    />
                    Rapor Komunal
                  </Button>
                )}
                <BestStaff
                  lembagaId={lembagaId}
                  eventId={eventId}
                  trigger={
                    <Button
                      variant="light_blue"
                      className="rounded-[16px] px-3 shadow-none flex items-center gap-2 text-lg">
                        <Image
                          src={Best}
                          alt="Pilih Best Staff"
                          width={24}
                          height={24}
                        />
                        Pilih Best Staff
                    </Button>
                  }
                />
              </div>
              <div className="flex gap-x-2">
                <FilterDropdown
                  filterTitle="Divisi"
                  filterOptions={filterOptions}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                />
                <Button
                  variant="ghost"
                  className="p-2"
                  onClick={() => {
                    // Empty function - add upload functionality here
                    console.log('Upload clicked');
                  }}
                >
                  <Image
                    src={Upload}
                    alt="Upload icon"
                    width={40}
                    height={40}
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* List Anggota Section */}
          <div className="mt-6">
            {/* Integrate MahasiswaCardTable here */}
            {isAnggota ? (
              <MahasiswaCardTable data={data} lembagaId={lembagaId} />
            ) : (
              <MahasiswaKegiatanCardTable data={tableData} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
