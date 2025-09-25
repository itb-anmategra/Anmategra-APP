import {
  type ProfilDeskripsiType,
  type ProfilKegiatanSectionProps,
} from '~/app/lembaga/kegiatan/[kegiatanId]/panitia/[raporId]/page';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

const dummyData: ProfilDeskripsiType[] = [
  {
    idProfil: '1',
    namaProfil: 'Bertanggung jawab',
    deskripsiProfil:
      'Selalu menyelesaikan tugas tepat waktu dan dapat diandalkan dalam setiap situasi.',
  },
  {
    idProfil: '2',
    namaProfil: 'Kerjasama Tim',
    deskripsiProfil:
      'Mampu bekerja sama dengan baik dalam tim, mendukung anggota lain, dan berkontribusi pada tujuan bersama.',
  },
  {
    idProfil: '3',
    namaProfil: 'Inisiatif',
    deskripsiProfil:
      'Proaktif dalam mengambil tindakan tanpa perlu diarahkan, serta selalu mencari cara untuk meningkatkan proses kerja.',
  },
  {
    idProfil: '4',
    namaProfil: 'Komunikasi',
    deskripsiProfil:
      'Mampu menyampaikan ide dan informasi dengan jelas serta mendengarkan dengan baik.',
  },
  {
    idProfil: '5',
    namaProfil: 'Kreativitas',
    deskripsiProfil:
      'Mampu berpikir di luar kotak dan menghasilkan ide-ide inovatif untuk memecahkan masalah.',
  },
];

export default function ProfilKegiatanSection({
  nilaiProfilData = dummyData,
}: ProfilKegiatanSectionProps) {
  return (
    <div className="flex flex-col w-full items-start justify-start">
      <div className="text-[20px] text-neutral-700 mb-[10px]">
        Profil Kegiatan
      </div>

      <Table className="max-w-[1066px] w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-[18px] text-neutral-500 px-8 py-2 min-w-[200px] font-normal">
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
  );
}
