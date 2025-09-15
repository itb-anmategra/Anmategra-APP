import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

import { type ProfilTableProps } from '../../[kegiatanId]/profil/constant';
import ProfilRow from './event-profil-row';

const ProfilTable = ({ profilData }: ProfilTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-neutral-500 text-lg font-normal w-2/5">
            Profil KM ITB
          </TableHead>
          <TableHead className="text-neutral-500 text-lg font-normal w-1/5">
            Profil Kegiatan
          </TableHead>
          <TableHead className="text-neutral-500 text-lg font-normal w-2/5">
            Deskripsi
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="font-normal text-neutral-700 text-lg leading-8">
        {profilData.map((profilGroup, index) => (
          <ProfilRow key={index} profilGroup={profilGroup} />
        ))}
      </TableBody>
    </Table>
  );
};

export default ProfilTable;
