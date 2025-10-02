import { type ProfilOutput } from '~/app/lembaga/kegiatan/[kegiatanId]/panitia/[raporId]/page';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

export default function ProfilKegiatanSection(props: ProfilOutput) {
  const profil_kegiatan =
    'profil_kegiatan' in props ? props.profil_kegiatan : [];
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
          {profil_kegiatan?.map((profil, index) => (
            <TableRow key={index}>
              <TableCell className="px-8 py-2 text-[20px]/8 text-neutral-600 min-w-[100px]">
                {profil.name}
              </TableCell>
              <TableCell className="px-8 py-2 text-[20px]/8 text-neutral-600">
                {profil.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
