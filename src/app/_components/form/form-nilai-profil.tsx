'use client';

import { Pencil, X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

type Profile = { id: string; value: number | null };

// Komponen FormProfil
interface FormProfilProps {
  profiles: Profile[];
  onChange: (id: string, value: number | null) => void;
}

const FormProfil: React.FC<FormProfilProps> = ({ profiles, onChange }) => {
  return (
    <div className="flex flex-col gap-4">
      {profiles.map((p, idx) => (
        <div key={p.id} className="flex justify-between items-center">
          <label className="font-[400] text-[20px] leading-[32px] text-[#141718]">
            Profil {idx + 1}
          </label>
          <div className="rounded-[12px] flex items-center border border-[#C4CACE] bg-white px-4 py-1 w-[92px] h-[50px]">
            <input
              type="number"
              value={p.value ?? ''}
              onChange={(e) => {
                // Menghilangkan leading 0
                const val = e.target.value;
                const numeric = val === '' ? null : Number(val);
                onChange(p.id, numeric);
              }}
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                         font-[400] text-[18px] leading-[32px] text-[#636A6D] w-full outline-none text-center"
              min={0}
              max={100}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Menerima initialProfiles sebagai prop
interface FormNilaiProfilProps {
  initialProfiles?: Profile[];
  onSave?: (updatedProfiles: Profile[]) => void;
}

const FormNilaiProfil: React.FC<FormNilaiProfilProps> = ({
  initialProfiles,
  onSave,
}) => {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles ?? []);

  const handleProfileChange = (id: string, value: number | null) => {
    const sanitized = value === null ? null : Math.min(Math.max(value, 0), 100);
    setProfiles(
      profiles.map((p) => (p.id === id ? { ...p, value: sanitized } : p)),
    );
  };

  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSaveProfile = () => {
    // Validasi input
    for (const p of profiles) {
      if (p.value === null || isNaN(p.value) || p.value < 0 || p.value > 100) {
        setErrorMessage(
          'Pastikan semua profil terisi dan memiliki nilai antara 0-100',
        );
        return; // tetap buka dialog
      }
    }
    if (onSave) {
      onSave(profiles);
    }

    // Jika valid, simpan data & tutup dialog
    setErrorMessage('');
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-[133px] h-[50px] flex items-center justify-center bg-[#00B7B7] rounded-[16px] hover:bg-[#51c8c4]">
          <Pencil size={40} className="!w-5 !h-5" />
          <div className="text-white text-[18px] leading-[26px] font-[600] rounded-[26.1px]">
            Edit Nilai
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="[&>button]:hidden bg-transparent border-0 shadow-none p-0 flex items-center justify-center">
        <Card className="relative w-[309px] max-h-[90vh] rounded-[26.1px] border border-[#C4CACE] pt-[35px] pr-[37px] pb-[27px] pl-[37px] bg-white flex flex-col gap-[10px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-semibold text-[24px] leading-[40px] text-center text-[#141718]">
              Edit Nilai Profil
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="hover:bg-transparent absolute top-4 right-4 p-0 w-6 h-6 flex items-center justify-center"
              >
                <X strokeWidth={1.7} className="!w-6 !h-6" />
              </Button>
            </DialogClose>
          </DialogHeader>

          <FormProfil profiles={profiles} onChange={handleProfileChange} />

          {errorMessage && (
            <div className="text-red-600 text-[14px] mt-2 text-center">
              {errorMessage}
            </div>
          )}

          <Button
            onClick={handleSaveProfile}
            className="font-[700] text-[14px] leading-[16px] bg-[#2B6282] text-white 
                         rounded-[12px] border-[2px] border-[#2B6282] hover:bg-[#1c4f6c] 
                         h-[40px] w-[196px] flex items-center justify-center mx-auto mt-3"
          >
            SIMPAN PERUBAHAN
          </Button>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default FormNilaiProfil;
