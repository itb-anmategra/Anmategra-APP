import NilaiProfilCard from "../../card/nilai-profil-card";
import { NilaiProfilCompProps } from "~/app/lembaga/kegiatan/[kegiatanId]/panitia/[raporId]/page"

const defaultNilaiProfils = [
  { namaProfil: 'Profil 1', nilaiProfil: 100 },
  { namaProfil: 'Profil 2', nilaiProfil: 90 },
  { namaProfil: 'Profil 3', nilaiProfil: 95 },
  { namaProfil: 'Profil 4', nilaiProfil: 85 },
  { namaProfil: 'Profil 5', nilaiProfil: 80 },
  { namaProfil: 'Profil 6', nilaiProfil: 75 },
  { namaProfil: 'Profil 7', nilaiProfil: 70 },
  { namaProfil: 'Profil 8', nilaiProfil: 65 },
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
            namaProfil={profil.namaProfil}
            nilaiProfil={profil.nilaiProfil}
          />
        ))}
      </div>
    </div>
  )
}