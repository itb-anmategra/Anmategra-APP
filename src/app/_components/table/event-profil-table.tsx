import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

interface ProfilKegiatan {
  name: string;
  description: string;
}

interface ProfilMapping {
  profilKMDescription: string;
  profilKegiatanName: string;
  profilKegiatanDescription: string;
}

interface ProfilTableProps {
  profilData: ProfilKegiatan[] | ProfilMapping[];
  showMapping: boolean;
  isLembaga?: boolean;
}

const ProfilTable = ({
  profilData,
  showMapping,
  isLembaga = false,
}: ProfilTableProps) => {
  if (profilData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">
          Belum ada profil {isLembaga ? 'lembaga' : 'kegiatan'}
        </p>
      </div>
    );
  }

  if (!showMapping) {
    const profilList = profilData as ProfilKegiatan[];
    return (
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[500px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-neutral-500 text-sm sm:text-base md:text-lg font-normal w-1/4">
                Profil {isLembaga ? 'Lembaga' : 'Kegiatan'}
              </TableHead>
              <TableHead className="text-neutral-500 text-sm sm:text-base md:text-lg font-normal w-3/4">
                Deskripsi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-normal text-neutral-700 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8">
            {profilList.map((profil, index) => (
              <TableRow key={index}>
                <TableCell className="align-top">{profil.name}</TableCell>
                <TableCell className="align-top">{profil.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Mapping
  const mappingList = profilData as ProfilMapping[];
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow>
            <TableHead className="text-neutral-500 text-sm sm:text-base md:text-lg font-normal w-2/5">
              Profil KM ITB
            </TableHead>
            <TableHead className="text-neutral-500 text-sm sm:text-base md:text-lg font-normal w-1/5">
              Profil {isLembaga ? 'Lembaga' : 'Kegiatan'}
            </TableHead>
            <TableHead className="text-neutral-500 text-sm sm:text-base md:text-lg font-normal w-2/5">
              Deskripsi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-normal text-neutral-700 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8">
          {mappingList.map((mapping, index) => (
            <TableRow key={index}>
              <TableCell className="align-top pr-4 sm:pr-6 md:pr-8">
                {mapping.profilKMDescription}
              </TableCell>
              <TableCell className="align-top">
                {mapping.profilKegiatanName}
              </TableCell>
              <TableCell className="align-top">
                {mapping.profilKegiatanDescription}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfilTable;
