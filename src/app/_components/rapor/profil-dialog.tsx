import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';

type SelectOption = { value: string; label: string };

export default function ProfilDialog({
  open,
  setOpen,
  modalType,
  profil,
  setProfil,
  deskripsi,
  setDeskripsi,
  pemetaan,
  setPemetaan,
  handleSimpanTambah,
  handleSimpanEdit,
  handleBatal,
  selectOptions,
  title,
  saveButtonText = 'Simpan Perubahan',
  cancelButtonText = 'Batal',
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  modalType: 'tambah' | 'edit';
  profil: string;
  setProfil: (val: string) => void;
  deskripsi: string;
  setDeskripsi: (val: string) => void;
  pemetaan: string[];
  setPemetaan: (val: string[]) => void;
  handleSimpanTambah: () => void;
  handleSimpanEdit: () => void;
  handleBatal: () => void;
  selectOptions: SelectOption[];
  title?: string;
  saveButtonText?: string;
  cancelButtonText?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="rounded-xl lg:rounded-[26px] max-w-[90vw] sm:max-w-md"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {title ??
              (modalType === 'tambah'
                ? 'Tambah Profil Kegiatan'
                : 'Edit Profil Kegiatan')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="profil">Profil</Label>
            <Input
              id="profil"
              placeholder="Masukkan nama profil"
              value={profil}
              onChange={(e) => setProfil(e.target.value)}
              className="text-[#636A6D]"
            />
          </div>
          <div>
            <Label htmlFor="deskripsi">Deskripsi Profil</Label>
            <Textarea
              id="deskripsi"
              placeholder="Jelaskan tentang profil ini ..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="min-h-[96px] max-h-[200px] resize-y text-[#636A6D]"
            />
          </div>
          <div>
            <Label htmlFor="pemetaan">Pemetaan dengan Profil KM ITB</Label>
            <Select value={pemetaan} onValueChange={setPemetaan}>
              <SelectTrigger
                id="pemetaan"
                className="text-[#636A6D] max-w-full sm:max-w-[462.4px] truncate overflow-hidden whitespace-nowrap"
              >
                <SelectValue
                  placeholder="Pilih Profil KM ITB"
                  className="truncate overflow-hidden whitespace-nowrap"
                />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)] max-h-40 overflow-y-scroll">
                {selectOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="whitespace-normal break-words text-[#636A6D]"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4">
          <Button
            variant="outline"
            className="px-6 bg-[#F16350] text-white hover:bg-[#FF9185] hover:text-white rounded-xl w-full sm:w-auto"
            onClick={handleBatal}
            type="button"
          >
            {cancelButtonText}
          </Button>
          <Button
            className="px-6 bg-[#2B6282] text-white hover:bg-[#2B6282] hover:text-white rounded-xl w-full sm:w-auto"
            onClick={
              modalType === 'tambah' ? handleSimpanTambah : handleSimpanEdit
            }
            type="button"
          >
            {saveButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
