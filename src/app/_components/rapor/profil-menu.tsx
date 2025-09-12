import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { Button } from '~/components/ui/button';

export default function ProfilMenu({
  colIdx,
  menu,
  setMenu,
  handleEditProfil,
  handleDeleteProfil,
}: {
  colIdx: number;
  menu: { row: number; col: number } | null;
  setMenu: (val: { row: number; col: number } | null) => void;
  handleEditProfil: (colIdx: number) => void;
  handleDeleteProfil: (colIdx: number) => void;
}) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMenu({ row: -1, col: colIdx })}
      >
        <MoreVertical size={16} />
      </Button>
      {menu && menu.row === -1 && menu.col === colIdx && (
        <div className="absolute left-0 mt-2 bg-white border rounded-2xl shadow z-10">
          <Button
            className="block px-4 py-2 w-full text-left hover:bg-gray-100"
            variant="ghost"
            onClick={() => handleEditProfil(colIdx)}
          >
            <Pencil size={16} className="inline mr-2 text-[#00B7B7]" />
            Edit Profil
          </Button>
          <hr className="border-t border-gray-200" />
          <Button
            className="block px-4 py-2 w-full text-left hover:bg-gray-100"
            variant="ghost"
            onClick={() => handleDeleteProfil(colIdx)}
          >
            <Trash size={16} className="inline mr-2 text-[#F16350]" />
            Delete Profil
          </Button>
        </div>
      )}
    </>
  );
}
