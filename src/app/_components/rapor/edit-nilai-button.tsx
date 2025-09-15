import { Pencil } from 'lucide-react';
import { Button } from '~/components/ui/button';

type Anggota = { nama: string; nim: string; profil: string[] };

export default function EditNilaiButton({
  editNilaiMode,
  setEditNilaiMode,
  editedData,
  setData,
  setEditedData,
  data,
  children,
}: {
  editNilaiMode: boolean;
  setEditNilaiMode: (val: boolean) => void;
  editedData: Anggota[] | null;
  setData: (val: Anggota[]) => void;
  setEditedData: (val: Anggota[] | null) => void;
  data: Anggota[];
  children?: React.ReactNode;
}) {
  return (
    <Button
      className="mb-4 rounded-2xl bg-[#2B6282] text-white hover:bg-[#2B6282] hover:text-white"
      variant="ghost"
      onClick={() => {
        if (editNilaiMode) {
          if (editedData) setData(editedData);
          setEditNilaiMode(false);
          setEditedData(null);
        } else {
          setEditedData(JSON.parse(JSON.stringify(data)) as Anggota[]);
          setEditNilaiMode(true);
        }
      }}
    >
      {children ??
        (editNilaiMode ? (
          'Simpan Nilai'
        ) : (
          <>
            <Pencil size={16} />
            Edit Nilai
          </>
        ))}
    </Button>
  );
}
