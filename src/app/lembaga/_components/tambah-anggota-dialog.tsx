'use client';

import { type Session } from 'next-auth';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Plus from '~/../public/icons/plus.svg';
import TambahAnggotaForm, {
  type comboboxDataType,
} from '~/app/_components/form/tambah-anggota-form';
import TambahAnggotaKegiatanForm from '~/app/_components/form/tambah-anggota-kegiatan-form';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

export function TambahAnggotaDialog({
  session,
  dataAddAnggota,
}: {
  session: Session | null;
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="light_blue"
          className="rounded-[16px] px-3 shadow-none flex items-center gap-2 text-lg"
        >
          <Image src={Plus} alt="Tambah Anggota" width={24} height={24} />
          Tambah Anggota Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center text-[#00B7B7]">
            {manualMode ? 'Tambah Anggota Manual' : 'Tambah Anggota'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Form untuk menambahkan anggota
          </DialogDescription>
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
  );
}
