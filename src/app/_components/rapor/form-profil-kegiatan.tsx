'use client';

import { Plus } from 'lucide-react';
import * as React from 'react';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { api } from '~/trpc/react';

interface FormProfilKegiatanProps {
  eventId: string;
  profilId?: string;
  isTambah?: boolean;
  customClassName?: string;
  isOpen?: boolean;
  onClose?: () => void;
  defaultName?: string;
  defaultDescription?: string;
  defaultProfilKM?: string[];
}

// schema untuk validasi
const profilSchema = z.object({
  name: z.string().min(1, 'Profil tidak boleh kosong'),
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
  profil_km_id: z.array(z.string().min(1, 'Profil KM harus dipilih')).min(1),
  profil_id: z.string().optional(), // hanya diperlukan saat edit
  event_id: z.string().optional(), // hanya diperlukan saat create
});

export default function FormProfilKegiatan({
  eventId,
  profilId,
  isTambah = true,
  customClassName = '',
  isOpen = true,
  onClose,
  defaultName = '',
  defaultDescription = '',
  defaultProfilKM = [],
}: FormProfilKegiatanProps) {
  const [profilInput, setProfilInput] = React.useState(defaultName);
  const [deskripsiInput, setDeskripsiInput] =
    React.useState(defaultDescription);
  const [mappings, setMappings] = React.useState<Record<number, string>>(
    Object.fromEntries(defaultProfilKM.map((v, i) => [i, v])),
  );
  const [selects, setSelects] = React.useState<number[]>([0]);
  const [errorMessage, setErrorMessage] = React.useState('');

  const { data: profilList } = api.profil.getAllProfilKM.useQuery();

  const createProfilKegiatan = api.profil.createProfilKegiatan.useMutation();
  const editProfilKegiatan = api.profil.editProfilKegiatan.useMutation();

  const addSelect = () => setSelects([...selects, selects.length]);

  const updateMapping = (id: number, value: string) => {
    setMappings((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setErrorMessage('');
    try {
      const inputData = {
        name: profilInput,
        description: deskripsiInput,
        profil_km_id: Object.values(mappings),
        profil_id: !isTambah ? profilId : undefined,
        event_id: isTambah ? eventId : undefined,
      };

      const validated = profilSchema.parse(inputData);

      if (isTambah) {
        await createProfilKegiatan.mutateAsync({
          event_id: validated.event_id!,
          name: validated.name,
          description: validated.description,
          profil_km_id: validated.profil_km_id,
        });
      } else {
        await editProfilKegiatan.mutateAsync({
          profil_id: validated.profil_id!,
          name: validated.name,
          description: validated.description,
          profil_km_id: validated.profil_km_id,
        });
      }

      onClose?.();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrorMessage(err.errors[0]?.message ?? 'Validasi gagal');
      } else {
        setErrorMessage('Gagal menyimpan data!');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose?.()}>
      <DialogContent
        className={`h-auto max-h-screen overflow-auto max-w-none w-[907px] rounded-[26.1px] bg-white border-[0.82px] border-[#C4CACE] px-9 py-6 flex flex-col gap-[21px] text-[#141718] ${customClassName}`}
      >
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="text-2xl font-semibold">
            {isTambah ? 'Tambah Profil Kegiatan' : 'Edit Profil Kegiatan'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <label className="text-xl">Profil</label>
          <Input
            value={profilInput}
            onChange={(e) => setProfilInput(e.target.value)}
            placeholder="Masukkan nama profil"
            className="h-[48px] rounded-xl px-6 text-[20px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xl">Deskripsi Profil</label>
          <Textarea
            value={deskripsiInput}
            onChange={(e) => setDeskripsiInput(e.target.value)}
            placeholder="Jelaskan tentang profil ini ..."
            className="min-h-[152px] rounded-xl px-6 py-4 !text-[20px] resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xl">Pemetaan dengan Profil KM ITB</label>
          <div className="flex flex-col gap-[10px] overflow-y-auto">
            {selects.map((id) => (
              <div
                className="flex flex-row gap-[16px] justify-between"
                key={id}
              >
                <Select
                  onValueChange={(v) => updateMapping(id, v)}
                  value={mappings[id] ?? ''}
                >
                  <SelectTrigger className="flex h-[48px] max-w-[759px] rounded-xl px-6 text-[20px] text-[#636A6D]">
                    <SelectValue
                      placeholder="Pilih Profil KM ITB"
                      className="whitespace-normal break-words"
                    />
                  </SelectTrigger>
                  <SelectContent side="bottom" className="max-w-[759px]">
                    {profilList?.profil_km.map((profil) => (
                      <SelectItem key={profil.id} value={profil.id.toString()}>
                        {profil.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={addSelect}
                  variant="outline"
                  className="flex items-center justify-center w-[54px] h-[48px] rounded-xl border border-[#C4CACE] px-6 py-3 text-[#444444]"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-600 font-semibold">{errorMessage}</p>
        )}

        <div className="flex justify-center gap-4 pt-4">
          <Button
            variant="warning"
            className="w-[120px] h-[40px] bg-[#F16350] rounded-xl px-6 py-3 font-bold text-[14px]"
            onClick={onClose}
          >
            BATAL
          </Button>
          <Button
            onClick={handleSave}
            className="w-[196px] h-[40px] rounded-xl px-6 py-3 bg-[#2B6282] font-bold text-[14px] hover:bg-[#1a4a5c] "
          >
            SIMPAN PERUBAHAN
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
