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
  description: string;
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
  
  const groupedMappings: { profilKM: string; profils: Array<{ name: string; description: string }> }[] = [];
  const kmMap = new Map<string, Array<{ name: string; description: string }>>();
  
  mappingList.forEach((mapping) => {
    if (!kmMap.has(mapping.profilKMDescription)) {
      kmMap.set(mapping.profilKMDescription, []);
    }
    kmMap.get(mapping.profilKMDescription)!.push({
      name: mapping.profilKegiatanName,
      description: mapping.description,
    });
  });
  
  kmMap.forEach((profils, profilKM) => {
    groupedMappings.push({ profilKM, profils });
  });
  
  return (
    <div className="w-full overflow-x-scroll scrollbar-thin">
      <Table className="w-full table-auto min-w-[700px]">
        <TableHeader>
          <TableRow>
            <TableHead className="text-neutral-500 text-sm sm:text-base md:text-lg font-normal w-[35%] min-w-[200px]">
              Profil KM ITB
            </TableHead>
            <TableHead className="text-neutral-500 text-sm sm:text-base md:text-lg font-normal w-[25%] min-w-[150px]">
              Profil {isLembaga ? 'Lembaga' : 'Kegiatan'}
            </TableHead>
            <TableHead className="text-neutral-500 text-sm sm:text-base md:text-lg font-normal w-[40%] min-w-[250px]">
              Deskripsi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-normal text-neutral-700 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8">
          {groupedMappings.map((group, groupIndex) => (
            group.profils.map((profil, profilIndex) => (
              <TableRow key={`${groupIndex}-${profilIndex}`}>
                {profilIndex === 0 && (
                  <TableCell 
                    className="align-top break-words pr-2 sm:pr-4 md:pr-6 border-r" 
                    rowSpan={group.profils.length}
                  >
                    {group.profilKM}
                  </TableCell>
                )}
                <TableCell className="align-top break-words">
                  {profil.name}
                </TableCell>
                <TableCell className="align-top break-words">
                  {profil.description}
                </TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfilTable;
