'use client';

import { type Session } from 'next-auth';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Plus from '~/../public/icons/plus.svg';
import CsvFormContent from '~/app/_components/csv-form/csv-form';
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
} from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { toast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';

type DialogMode = 'manual' | 'csv';

export function TambahAnggotaDialog({
  session,
  dataAddAnggota,
  pageAnggota,
}: {
  session: Session | null;
  dataAddAnggota: {
    mahasiswa: comboboxDataType[];
    nim: comboboxDataType[];
    posisi: comboboxDataType[];
    bidang: comboboxDataType[];
  };
  pageAnggota?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('manual');
  const pathname = usePathname();
  const isAnggota = pageAnggota ?? false;
  const utils = api.useUtils();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setManualMode(false);
      setDialogMode('manual');
    }
  };

  const handleModeSelection = (mode: DialogMode) => {
    setDialogMode(mode);
    if (mode === 'manual') {
      setManualMode(true);
    }
    setIsOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="light_blue"
            className="rounded-[16px] px-3 shadow-none flex items-center gap-2 text-lg"
          >
            <Image src={Plus} alt="Tambah Anggota" width={24} height={24} />
            Tambah Anggota Baru
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem
            onClick={() => handleModeSelection('manual')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image
              src="/images/miscellaneous/new.svg"
              alt="Manual"
              width={16}
              height={16}
              className="text-[#00B7B7]"
            />
            Tambah Manual
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleModeSelection('csv')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image
              src="/images/miscellaneous/add-csv-hover.svg"
              alt="Excel"
              width={16}
              height={16}
              className="text-[#00B7B7]"
            />
            Unggah Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className={`w-full ${dialogMode === 'csv' ? 'max-w-4xl' : 'max-w-xl'}`}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center text-[#00B7B7]">
              {dialogMode === 'manual' && 'Tambah Anggota Manual'}
              {dialogMode === 'csv' && 'Upload Excel Anggota'}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Form untuk menambahkan anggota
            </DialogDescription>
          </DialogHeader>

          {dialogMode === 'manual' && (
            <div>
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
            </div>
          )}

          {dialogMode === 'csv' && (
            <div>
              <CsvFormContent
                importType={isAnggota ? 'lembaga-anggota' : 'kegiatan-anggota'}
                entityId={
                  isAnggota
                    ? (session?.user.lembagaId ?? '')
                    : (pathname.split('/')[3] ?? '')
                }
                onImportSuccess={() => {
                  toast({
                    title: 'Import Berhasil',
                    description: 'Data anggota berhasil diimpor.',
                  });
                  if (isAnggota) {
                    void utils.lembaga.getAllAnggota.invalidate();
                  } else {
                    void utils.event.getAllAnggota.invalidate();
                  }
                  setIsOpen(false);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
