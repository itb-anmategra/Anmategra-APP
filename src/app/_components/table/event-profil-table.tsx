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
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-neutral-500 text-sm sm:text-base md:text-lg font-normal w-[30%]">
                Profil {isLembaga ? 'Lembaga' : 'Kegiatan'}
              </TableHead>
              <TableHead className="text-neutral-500 text-sm sm:text-base md:text-lg font-normal w-[70%]">
                Deskripsi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-normal text-neutral-700 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8">
            {profilList.map((profil, index) => (
              <TableRow key={index}>
                <TableCell className="align-top break-words">{profil.name}</TableCell>
                <TableCell className="align-top break-words">{profil.description}</TableCell>
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
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="text-neutral-500 text-sm sm:text-base md:text-lg font-normal w-[35%]">
              Profil KM ITB
            </TableHead>
            <TableHead className="text-neutral-500 text-sm sm:text-base md:text-lg font-normal w-[25%]">
              Profil {isLembaga ? 'Lembaga' : 'Kegiatan'}
            </TableHead>
            <TableHead className="text-neutral-500 text-sm sm:text-base md:text-lg font-normal w-[40%]">
              Deskripsi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-normal text-neutral-700 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8">
          {mappingList.map((mapping, index) => (
            <TableRow key={index}>
              <TableCell className="align-top break-words pr-2 sm:pr-4 md:pr-6">
                {mapping.profilKMDescription}
              </TableCell>
              <TableCell className="align-top break-words">
                {mapping.profilKegiatanName}
              </TableCell>
              <TableCell className="align-top break-words">
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
