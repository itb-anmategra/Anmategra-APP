import { TableHead, TableHeader, TableRow } from '~/components/ui/table';

import ProfilMenu from './profil-menu';

type ProfilHeader = {
  id: string;
  name: string;
  description: string;
  profil_km_id: string[];
};

export default function RaporTableHeader({
  profilHeaders,
  menu,
  setMenu,
  handleEditProfil,
  handleDeleteProfil,
}: {
  profilHeaders: ProfilHeader[];
  menu: { row: number; col: number } | null;
  setMenu: (val: { row: number; col: number } | null) => void;
  handleEditProfil: (colIdx: number) => void;
  handleDeleteProfil: (colIdx: number) => void;
}) {
  return (
    <TableHeader>
      <TableRow className="text-neutral-500">
        <TableHead className="sticky left-0 z-10 bg-neutral-100 w-[283px]">
          Nama
        </TableHead>
        <TableHead className="sticky left-[283px] z-10 bg-neutral-100 w-[128px]">
          NIM
        </TableHead>
        {profilHeaders.map((header, colIdx) => (
          <TableHead key={colIdx} className="relative w-[120px]">
            <div className="flex items-center">
              <span title={header.name}>
                {header.name.length > 20
                  ? header.name.slice(0, 20) + '…'
                  : header.name}
              </span>
              <ProfilMenu
                colIdx={colIdx}
                menu={menu}
                setMenu={setMenu}
                handleEditProfil={handleEditProfil}
                handleDeleteProfil={handleDeleteProfil}
              />
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
