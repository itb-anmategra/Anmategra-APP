import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { LaporanForm } from "./laporan-form";

interface LaporanDialogProps {
  trigger: ReactNode;
}

export const LaporanDialog = ({ trigger }: LaporanDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Laporan Baru</DialogTitle>
          <DialogDescription>
            Laporan yang dibuat akan berada pada status Draft
          </DialogDescription>
        </DialogHeader>

        <LaporanForm />
      </DialogContent>
    </Dialog>
  );
};
