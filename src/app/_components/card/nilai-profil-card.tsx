import { Card, CardContent } from "~/components/ui/card"

export type NilaiProfilCardType = {
  idProfil: string;
  nilaiProfil?: number | null;
}

export default function NilaiProfilCard({
  idProfil = "Profil 1",
  nilaiProfil = 100,
} : NilaiProfilCardType) {
  return (
    <Card className="flex flex-col flex-shrink-0 w-[144px] min-h-[110px] items-center justify-center gap-[10px]">
      <CardContent className="flex flex-col items-center px-[25.8px] py-[17.2px] justify-center">
        <div className="text-[18px] text-neutral-600 text-center">
          {idProfil}
        </div>
        <div className="text-[32px] font-medium text-[#2B6282]">
          {nilaiProfil}
        </div>
      </CardContent>
    </Card>
  )
}