import { Button } from '~/components/ui/button';
import { Dialog, DialogContent } from '~/components/ui/dialog';

export default function DeleteProfilDialog({
  open,
  onCancel,
  onConfirm,
  title = 'Apakah Anda yakin ingin menghapus profil ini?',
  cancelButtonText = 'Batal',
  confirmButtonText = 'Yakin',
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="lg:rounded-[26px]" aria-describedby={undefined}>
        <div className="text-center">{title}</div>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            className="px-6 bg-[#F16350] text-white hover:bg-[#FF9185] hover:text-white rounded-xl"
            onClick={onCancel}
            type="button"
          >
            {cancelButtonText}
          </Button>
          <Button
            className="px-6 bg-[#2B6282] text-white hover:bg-[#2B6282] hover:text-white rounded-xl"
            onClick={onConfirm}
            type="button"
          >
            {confirmButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
