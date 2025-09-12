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

const FormProfil = () => {
  const [profiles, setProfiles] = useState<{ id: number; value: string }[]>([
    { id: 1, value: '100' },
    { id: 2, value: '100' },
    { id: 3, value: '100' },
    { id: 4, value: '100' },
    { id: 5, value: '100' },
  ]);

  const handleProfileChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // Ambil nilai dari event.target.value
    const newValue = event.target.value;

    // hapus semua leading zero
    let sanitized = newValue.replace(/^0+(?=\d)/, '');

    // batasi 0-100 jika angka valid
    let valueAsNumber = parseInt(sanitized);
    if (!isNaN(valueAsNumber)) {
      if (valueAsNumber < 0) valueAsNumber = 0;
      if (valueAsNumber > 100) valueAsNumber = 100;
      sanitized = valueAsNumber.toString();
    }

    setProfiles(
      profiles.map((profile) =>
        profile.id === id ? { ...profile, value: sanitized } : profile,
      ),
    );
  };

  return (
    <Dialog>
      {/* Trigger buka dialog */}
      <DialogTrigger asChild>
        <Button className="w-[133px] h-[50px] flex items-center justify-center bg-[#00B7B7] rounded-[16px] hover:bg-[#51c8c4]">
          <Pencil size={40} className="!w-5 !h-5" />
          <div className="text-white text-[18px] leading-[26px] font-[600] rounded-[26.1px]">
            Edit Nilai
          </div>
        </Button>
      </DialogTrigger>

      {/* Isi dialog */}
      <DialogContent className="bg-transparent border-0 shadow-none p-0 flex items-center justify-center">
        <Card className="relative w-[309px] h-[530px] rounded-[26.1px] border border-[#C4CACE] pt-[35px] pr-[37px] pb-[27px] pl-[37px] bg-white flex flex-col gap-[10px]">
          <div className="w-[235px] h-[483px] flex flex-col gap-[21px] -mt-[7px]">
            {/* Section Edit Nilai Profil */}
            <DialogHeader>
              <DialogTitle className="font-semibold text-[24px] leading-[40px] text-center text-[#141718]">
                Edit Nilai Profil
              </DialogTitle>

              {/* Close icon */}
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent absolute top-4 right-4 p-0 w-6 h-6 flex items-center justify-center"
                >
                  <X strokeWidth={1.7} className="!w-6 !h-6" />
                </Button>
              </DialogClose>
            </DialogHeader>

            {/* Section Profil Nilai dan Button */}
            <div className="w-auto h-auto flex flex-col gap-[48px] -mt-1">
              <div className="w-auto h-auto flex flex-col gap-[22px]">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="w-full h-[48px] flex flex-row items-center justify-between"
                  >
                    <label className="font-[400] text-[20px] leading-[32px] text-[#141718] ml-1">
                      Profil {profile.id}
                    </label>

                    {/* Box input */}
                    <div className="rounded-[12px] flex items-center border border-[#C4CACE] bg-white px-4 py-1 mr-2 w-[92px] h-[50px] group">
                      {/* Input */}
                      <input
                        type="number"
                        value={profile.value}
                        onChange={(e) => handleProfileChange(profile.id, e)}
                        className="appearance-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                                   font-[400] text-[18px] leading-[32px] text-[#636A6D] w-full outline-none text-center ml-3"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Simpan Perubahan */}
            <DialogClose asChild>
              <Button
                className="font-[700] text-[14px] leading-[16px] bg-[#2B6282] text-white 
                           rounded-[12px] border-[2px] border-[#2B6282] hover:bg-[#1c4f6c] 
                           h-[40px] w-[196px] flex items-center justify-center mx-auto mt-3"
              >
                SIMPAN PERUBAHAN
              </Button>
            </DialogClose>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default FormProfil;
