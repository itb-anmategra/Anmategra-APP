import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { type NilaiProfilType, type ProfilKegiatanSectionProps } from "~/app/lembaga/kegiatan/[kegiatanId]/panitia/[raporId]/page"

const dummyData: NilaiProfilType[] = [
  { namaProfil: "Bertanggung Jawab", deskripsiProfil: "Selalu menyelesaikan tugas tepat waktu dan dapat diandalkan dalam setiap situasi." },
  { namaProfil: "Kerjasama Tim", deskripsiProfil: "Mampu bekerja sama dengan baik dalam tim, mendukung anggota lain, dan berkontribusi pada tujuan bersama." },
  { namaProfil: "Inisiatif", deskripsiProfil: "Proaktif dalam mengambil tindakan tanpa perlu diarahkan, serta selalu mencari cara untuk meningkatkan proses kerja." },
  { namaProfil: "Komunikasi", deskripsiProfil: "Mampu menyampaikan ide dan informasi dengan jelas serta mendengarkan dengan baik." },
  { namaProfil: "Kreativitas", deskripsiProfil: "Mampu berpikir di luar kotak dan menghasilkan ide-ide inovatif untuk memecahkan masalah." },
]

export default function ProfilKegiatanSection(
  {
    nilaiProfilData = dummyData,
  } : ProfilKegiatanSectionProps
) {
  return (
    <div className="flex flex-col w-full items-start justify-start">
      <div className="text-[20px] text-neutral-700 mb-[10px]">
        Profil Kegiatan
      </div>

      <Table className="max-w-[1066px] w-full">
        <TableHeader>
          <TableRow> 
            <TableHead className="text-[18px] text-neutral-500 px-8 py-2 min-w-[100px] font-normal">
              Profil Kegiatan
            </TableHead>
            <TableHead className="text-[18px] text-neutral-500 px-8 py-2 font-normal">
              Deskripsi
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {nilaiProfilData.map((profil, index) => (
            <TableRow key={index}>
              <TableCell className="px-8 py-2 text-[20px]/8 text-neutral-600 min-w-[100px]">
                {profil.namaProfil}
              </TableCell>
              <TableCell className="px-8 py-2 text-[20px]/8 text-neutral-600">
                {profil.deskripsiProfil}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}