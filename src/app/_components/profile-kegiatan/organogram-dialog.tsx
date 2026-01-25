'use client';

import { LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

interface OrganogramDialogProps {
  organogramImage: string;
  eventName: string;
}

export const OrganogramDialog = ({
  organogramImage,
  eventName,
}: OrganogramDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <LayoutGrid size={20} />
          Lihat Organogram
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full sm:max-w-[90vw] sm:max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Organogram {eventName}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto px-6 pb-6">
          <img
            src={organogramImage}
            alt={`Organogram ${eventName}`}
            className="w-full h-auto object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
