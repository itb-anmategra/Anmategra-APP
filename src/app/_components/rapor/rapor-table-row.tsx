import { TableCell, TableRow } from '~/components/ui/table';

type Anggota = { nama: string; nim: string; profil: string[] };

export default function RaporTableRow({
  row,
  editNilaiMode,
  editedData,
  setEditedData,
  absoluteRowIdx,
}: {
  row: Anggota;
  editNilaiMode: boolean;
  editedData: Anggota[] | null;
  setEditedData: (fn: (prev: Anggota[] | null) => any[] | null) => void;
  absoluteRowIdx: number;
}) {
  return (
    <TableRow className="text-neutral-700">
      <TableCell className="sticky left-0 z-10 bg-neutral-100 border-b border-[#E0E5E8]">
        {row.nama}
      </TableCell>
      <TableCell className="sticky left-[283px] z-10 bg-neutral-100 border-b border-[#E0E5E8]">
        {row.nim}
      </TableCell>
      {row.profil.map((val: string, colIdx: number) => (
        <TableCell key={colIdx} className="border-b border-[#E0E5E8] py-0">
          {editNilaiMode ? (
            <input
              type="number"
              min={0}
              max={100}
              className="w-16 px-2 py-1 border rounded"
              value={editedData?.[absoluteRowIdx]?.profil?.[colIdx] ?? ''}
              onChange={(e) => {
                const newValue = e.target.value;
                setEditedData((prev) => {
                  if (!prev) return prev;
                  const updated = [...prev];
                  if (updated[absoluteRowIdx]) {
                    updated[absoluteRowIdx] = {
                      ...updated[absoluteRowIdx],
                      profil: [...updated[absoluteRowIdx].profil],
                    };
                    updated[absoluteRowIdx].profil[colIdx] = newValue;
                  }
                  return updated;
                });
              }}
            />
          ) : (
            val
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}
