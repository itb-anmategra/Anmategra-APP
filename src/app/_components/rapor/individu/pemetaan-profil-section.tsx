import ProfilTable from "~/app/lembaga/kegiatan/_components/table/event-profil-table"
import { ChevronDown } from "lucide-react"
import { eventProfilProp } from "~/app/lembaga/kegiatan/[kegiatanId]/profil/constant"
import { PemetaanProfilSectionProps } from "~/app/lembaga/kegiatan/[kegiatanId]/panitia/[raporId]/page"

export default function PemetaanProfilSection({
  pemetaanProfilData = eventProfilProp,
} : PemetaanProfilSectionProps) {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex flex-row gap-[5px] items-center">
        <div className="text-[20px]/8 text-neutral-700">
          Detail Pemetaan Profil Kegiatan
        </div>
        <ChevronDown className="w-6 h-6 text-neutral-700" />
      </div>
      <ProfilTable profilData={pemetaanProfilData} />
    </div>
  )
}