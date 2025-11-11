'use client';

// Library Import
// Auth Import
import { type Session } from 'next-auth';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Rapor from '~/../public/icons/assessment.svg';
import Best from '~/../public/icons/best.svg';
import Upload from '~/../public/icons/export-button.svg';
import Filter from '~/../public/icons/filter-list.svg';
import SearchIcon from '~/../public/icons/search.svg';
// Import the magnifying glass icon
import { type comboboxDataType } from '~/app/_components/form/tambah-anggota-form';
import { TambahAnggotaDialog } from '~/app/lembaga/_components/tambah-anggota-dialog';
import {
  MahasiswaCardTable,
  type Member,
} from '~/app/lembaga/anggota/_components/table/mahasiswa-card-table';
import { MahasiswaKegiatanCardTable } from '~/app/lembaga/anggota/_components/table/mahasiswa-kegiatan-card-table';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

export default function AnggotaContent({
  session,
  data,
  dataAddAnggota,
}: {
  session: Session | null;
  data: Member[];
  dataAddAnggota: {
    mahasiswa: comboboxDataType[];
    nim: comboboxDataType[];
    posisi: comboboxDataType[];
    bidang: comboboxDataType[];
  };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAnggota = pathname === '/lembaga/anggota';
  let tableData;
  if (!isAnggota && pathname) {
    tableData = data.map((member) => {
      return {
        ...member,
        event_id: pathname.split('/')[3],
      };
    });
  }
  return (
    <main className="flex flex-row bg-[#FAFAFA] w-full p-6">
      {/* Content */}
      <div className="flex-1 space-y-4">
        {/* Search Bar */}
        <div className="w-full">
          <p className="text-[32px] mb-4 font-semibold">
            {isAnggota ? <span>Anggota</span> : <span>Anggota Kegiatan</span>}
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
                      // Empty function - add rapor komunal functionality here
                      router.push('/lembaga/anggota/rapor');
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
                <Button
                  variant="light_blue"
                  className="rounded-[16px] px-3 shadow-none flex items-center gap-2 text-lg"
                  onClick={() => {
                    // Empty function - add best staff functionality here
                    console.log('Pilih Best Staff clicked');
                  }}
                >
                  <Image
                    src={Best}
                    alt="Pilih Best Staff"
                    width={24}
                    height={24}
                  />
                  Pilih Best Staff
                </Button>
              </div>
              <div className="flex gap-x-2">
                <Button
                  className="bg-neutral-50 hover:bg-neutral-300 border border-netural-400 text-black rounded-[24px] px-4 py-3 shadow-none flex items-center gap-2 text-lg"
                  onClick={() => {
                    // Empty function - add filter functionality here
                    console.log('Filter clicked');
                  }}
                >
                  <Image
                    src={Filter}
                    alt="Filter icon"
                    width={24}
                    height={24}
                  />
                  Filter
                </Button>
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
              <MahasiswaCardTable data={data} />
            ) : (
              <MahasiswaKegiatanCardTable data={tableData} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
