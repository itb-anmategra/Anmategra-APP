import React from 'react';

import NilaiProfilCard from '../../card/nilai-profil-card';
import { type NilaiProfilCardType } from '../../card/nilai-profil-card';

type NilaiProfilCompProps = {
  nilaiProfils?: NilaiProfilCardType[];
};

export default function NilaiProfilComp({
  nilaiProfils,
}: NilaiProfilCompProps) {
  return (
    <div className="flex flex-col gap-[15px]">
      <div className="text-neutral-700 text-[20px]">Nilai Profil Kegiatan</div>

      <div className="flex flex-row gap-6 px-[25px] overflow-x-auto">
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
