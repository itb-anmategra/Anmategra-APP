'use client';

import { Plus, X } from 'lucide-react';
import * as React from 'react';
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

interface FormProfilKegiatanProps {
  profil?: string;
  isTambah?: boolean;
  customClassName?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function FormProfilKegiatan({
  profil = 'Profil 5',
  isTambah = true,
  customClassName = '',
  isOpen = true,
  onClose,
}: FormProfilKegiatanProps) {
  const [selects, setSelects] = React.useState<number[]>([0]);
  const [mappings, setMappings] = React.useState<Record<number, string>>({});
  const [profilInput, setProfilInput] = React.useState('');
  const [deskripsi, setDeskripsi] = React.useState('');

  const addSelect = () => setSelects([...selects, selects.length]);

  const handleSave = () => {
    if (!profilInput.trim() || !deskripsi.trim()) {
      alert('Profil dan Deskripsi tidak boleh kosong!');
      return;
    }

    const adaKosong = selects.some(
      (id) => !mappings[id] || mappings[id].trim() === '',
    );
    if (adaKosong) {
      alert('Semua Pemetaan Profil KM ITB harus dipilih!');
      return;
    }

    // Code dibawah dapat disesuaikan
    console.log('Data disimpan:', { profilInput, deskripsi, mappings });
    onClose?.();
  };

  const updateMapping = (id: number, value: string) => {
    setMappings((prev) => ({ ...prev, [id]: value }));
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
            placeholder={profil}
            className="h-[48px] rounded-xl px-6 text-[20px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xl">Deskripsi Profil</label>
          <Textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
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
                  <SelectTrigger className="flex h-[48px] w-full rounded-xl px-6 text-[20px] text-[#636A6D]">
                    <SelectValue placeholder="Pilih Profil KM ITB" />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    <SelectItem value="profil1">Profil KM 1</SelectItem>
                    <SelectItem value="profil2">Profil KM 2</SelectItem>
                    <SelectItem value="profil3">Profil KM 3</SelectItem>
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

        <div className="flex justify-center gap-4 pt-4">
          <Button
            variant="destructive"
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
