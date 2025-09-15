'use client';

import { Plus, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '~/components/ui/button';
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
  Tambah?: boolean;
  className?: string;
}

export default function FormProfilKegiatan({
  profil = 'Profil 5',
  Tambah = true,
  className = '',
}: FormProfilKegiatanProps) {
  const [selects, setSelects] = React.useState<number[]>([0]);
  const addSelect = () => setSelects([...selects, selects.length]);

  return (
    <div
      className={`h-auto w-[907px] rounded-[26.1px] bg-white border border-[#C4CACE] px-9 py-6 flex flex-col gap-[21px] text-[#141718] ${className}`}
    >
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">
          {Tambah ? 'Tambah Profil Kegiatan' : 'Edit Profil Kegiatan'}
        </h2>
        <X className="w-[20px] h-[20px]" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xl">Profil</label>
        <Input
          placeholder={profil}
          className="h-[48px] rounded-xl px-6 text-[20px]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xl">Deskripsi Profil</label>
        <Textarea
          placeholder="Jelaskan tentang profil ini ..."
          className="min-h-[152px] rounded-xl px-6 py-4 !text-[20px] resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xl">Pemetaan dengan Profil KM ITB</label>
        <div className="flex flex-col gap-[10px]">
          {selects.map((id) => (
            <div className="flex flex-row gap-[16px] justify-between" key={id}>
              <Select>
                <SelectTrigger className="flex h-[48px] w-full rounded-xl px-6 text-[20px] text-[#636A6D]">
                  <SelectValue placeholder="Pilih Profil KM ITB" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  <SelectItem value="profil1">Profil KM 1</SelectItem>
                  <SelectItem value="profil2">Profil KM 2</SelectItem>
                  <SelectItem value="profil3">Profil KM 3</SelectItem>
                </SelectContent>
                <Button
                  type="button"
                  onClick={addSelect}
                  variant="outline"
                  className="flex  items-center justify-center w-[54px] h-[48px] rounded-xl border border-[#C4CACE] px-6 py-3 text-[#444444]"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button
          variant="destructive"
          className="w-[120px] h-[40px] bg-[#F16350] rounded-xl px-6 py-3 font-bold text-[14px]"
        >
          BATAL
        </Button>
        <Button className="w-[196px] h-[40px] rounded-xl px-6 py-3 bg-[#2B6282] font-bold text-[14px] hover:bg-[#1a4a5c] ">
          SIMPAN PERUBAHAN
        </Button>
      </div>
    </div>
  );
}
