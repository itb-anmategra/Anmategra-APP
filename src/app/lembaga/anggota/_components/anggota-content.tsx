'use client';

// Library Import
// Auth Import
import { type Session } from 'next-auth';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
// Icon Import
import Plus from '~/../public/icons/plus.svg';
import SearchIcon from '~/../public/icons/search.svg';
// Import the magnifying glass icon
import TambahAnggotaForm, {
  type comboboxDataType,
} from '~/app/_components/form/tambah-anggota-form';
import TambahAnggotaKegiatanForm from '~/app/_components/form/tambah-anggota-kegiatan-form';
import {
  MahasiswaCardTable,
  type Member,
} from '~/app/lembaga/anggota/_components/table/mahasiswa-card-table';
import { MahasiswaKegiatanCardTable } from '~/app/lembaga/anggota/_components/table/mahasiswa-kegiatan-card-table';
import { Button } from '~/components/ui/button';
// Components Import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
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
  const [isOpen, setIsOpen] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const pathname = usePathname();
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
          <p className="text-2xl mb-4 font-semibold">
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
                className="rounded-[24px] pl-12 pr-4 border-[1px] border-neutral-400 w-full"
                placeholder="Cari nama anggota"
              />
            </div>
          </div>
        </div>

        {/* List Anggota */}
        <div>
          {/* Button Section */}
          <div className="flex justify-between">
            <Dialog
              open={isOpen}
              onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) setManualMode(false);
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-[#00B7B7] hover:bg-[#00B7B7]/75 text-white rounded-[16px] px-4 shadow-none flex items-center gap-2">
                  <Image
                    src={Plus}
                    alt="Tambah Anggota"
                    width={24}
                    height={24}
                  />
                  Tambah Anggota Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold text-center text-[#00B7B7]">
                    {manualMode ? 'Tambah Anggota Manual' : 'Tambah Anggota'}
                  </DialogTitle>
                </DialogHeader>
                {isAnggota ? (
                  <TambahAnggotaForm
                    session={session}
                    data={dataAddAnggota}
                    setIsOpen={setIsOpen}
                    manualMode={manualMode}
                    setManualMode={setManualMode}
                  />
                ) : (
                  <TambahAnggotaKegiatanForm
                    session={session}
                    data={dataAddAnggota}
                    setIsOpen={setIsOpen}
                    pathname={pathname}
                  />
                )}
              </DialogContent>
            </Dialog>
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
