import ProfilTable from "~/app/lembaga/kegiatan/_components/table/event-profil-table"
import { ChevronDown } from "lucide-react"
import { eventProfilProp } from "~/app/lembaga/kegiatan/[kegiatanId]/profil/constant"

type PemetaanProfilSectionProps = {
  profilData?: typeof eventProfilProp
}

export default function PemetaanProfilSection() {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex flex-row gap-[5px] items-center">
        <div className="text-[20px]/8 text-neutral-700">
          Detail Pemetaan Profil Kegiatan
        </div>
        <ChevronDown className="w-6 h-6 text-neutral-700" />
      </div>

      <ProfilTable profilData={eventProfilProp} />
    </div>
  )
}