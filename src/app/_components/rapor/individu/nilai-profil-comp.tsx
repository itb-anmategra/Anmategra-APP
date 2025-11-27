import React from 'react';

import NilaiProfilCard from '../../card/nilai-profil-card';
import { type NilaiProfilCardType } from '../../card/nilai-profil-card';

type NilaiProfilCompProps = {
  nilaiProfils?: NilaiProfilCardType[];
  isLembaga?: boolean;
};

export default function NilaiProfilComp({
  nilaiProfils,
  isLembaga,
}: NilaiProfilCompProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-[15px] w-full">
      <div className="text-neutral-700 text-lg sm:text-xl md:text-[20px]">
        {isLembaga ? 'Nilai Profil Lembaga' : 'Nilai Profil Kegiatan'}
      </div>

      <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4 md:gap-6">
        {nilaiProfils?.map((profil, index) => (
          <NilaiProfilCard
            key={index}
            profil_id={'Profil ' + (index + 1)}
            nilai={profil.nilai ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
