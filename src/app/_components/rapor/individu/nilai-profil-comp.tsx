import React, { useState } from "react";

import NilaiProfilCard from "../../card/nilai-profil-card";
import { NilaiProfilCardType } from "../../card/nilai-profil-card";

type NilaiProfilCompProps = {
  nilaiProfils?: NilaiProfilCardType[];
}

const defaultNilaiProfils = [
  { idProfil: 'Profil 1', nilaiProfil: 100 },
  { idProfil: 'Profil 2', nilaiProfil: 90 },
  { idProfil: 'Profil 3', nilaiProfil: 95 },
  { idProfil: 'Profil 4', nilaiProfil: 85 },
  { idProfil: 'Profil 5', nilaiProfil: 80 },
  { idProfil: 'Profil 6', nilaiProfil: 75 },
  { idProfil: 'Profil 7', nilaiProfil: 70 },
  { idProfil: 'Profil 8', nilaiProfil: 65 },
]

export default function NilaiProfilComp({
  nilaiProfils = defaultNilaiProfils, 
} : NilaiProfilCompProps
) {
  return (
    <div className="flex flex-col gap-[15px]">
      <div className="text-neutral-700 text-[20px]">
        Nilai Profil Kegiatan
      </div>

      <div className="flex flex-row gap-6 px-[25px] overflow-x-auto">
        {nilaiProfils.map((profil, index) => (
          <NilaiProfilCard
            key={index}
            idProfil={profil.idProfil}
            nilaiProfil={profil.nilaiProfil}
          />
        ))}
      </div>
    </div>
  )
}