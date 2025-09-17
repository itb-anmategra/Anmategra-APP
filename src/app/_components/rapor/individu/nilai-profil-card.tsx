import { Card, CardContent, CardTitle } from "~/components/ui/card"

interface NilaiProfilCardProps {
  namaProfil: string;
  nilaiProfil: number;
}

export default function NilaiProfilCard({
  namaProfil = "Bertanggung Jawab",
  nilaiProfil = 100,
} : NilaiProfilCardProps) {
  return (
    <Card className="flex flex-col w-[144px] min-h-[110px] items-center justify-center gap-[10px]">
      <CardContent className="flex flex-col items-center px-[25.8px] py-[17.2px] justify-center">
        <div className="text-[18px] text-neutral-600 text-center">
          {namaProfil}
        </div>
        <div className="text-[32px] font-medium text-[#2B6282]">
          {nilaiProfil}
        </div>
      </CardContent>
    </Card>
  )
}