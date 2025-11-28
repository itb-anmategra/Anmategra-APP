'use client';

import { Pencil, Trash } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';

type AssociationRequest = {
  id: string;
  event_id?: string | null;
  event_name?: string | null;
  lembaga_id?: string | null;
  lembaga_name?: string | null;
  position: string;
  division: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  image?: string | null;
};

type InboxTableProps = {
  eventRequests: AssociationRequest[];
  lembagaRequests: AssociationRequest[];
};

const statusConfig = {
  Pending: {
    label: 'REQUESTED',
    className:
      'border-2 border-[#F5CB69] text-[#F5CB69] bg-white hover:bg-[#F5CB69] hover:text-white',
  },
  Accepted: {
    label: 'ACCEPTED',
    className:
      'border-2 border-[#29BC5B] text-[#29BC5B] bg-white hover:bg-[#29BC5B] hover:text-white',
  },
  Declined: {
    label: 'DECLINED',
    className:
      'border-2 border-[#F16350] text-[#F16350] bg-white hover:bg-[#F16350] hover:text-white',
  },
};

export default function InboxTable({
  eventRequests,
  lembagaRequests,
}: InboxTableProps) {
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<AssociationRequest | null>(null);
  const [editDivision, setEditDivision] = useState('');
  const [editPosition, setEditPosition] = useState('');

  const utils = api.useUtils();

  // Combine all requests
  const allRequests = [
    ...eventRequests.map((req) => ({ ...req, type: 'event' as const })),
    ...lembagaRequests.map((req) => ({ ...req, type: 'lembaga' as const })),
  ];

  // Edit mutations
  const editEventMutation = api.users.editRequestAssociation.useMutation({
    onSuccess: () => {
      toast({
        title: 'Berhasil',
        description: 'Permintaan berhasil diubah',
      });
      setEditDialogOpen(false);
      void utils.users.getMyRequestAssociation.invalidate();
    },
    onError: (error) => {
      toast({
        title: 'Gagal',
        description: error.message || 'Gagal mengubah permintaan',
        variant: 'destructive',
      });
    },
  });

  const editLembagaMutation =
    api.users.editRequestAssociationLembaga.useMutation({
      onSuccess: () => {
        toast({
          title: 'Berhasil',
          description: 'Permintaan berhasil diubah',
        });
        setEditDialogOpen(false);
        void utils.users.getMyRequestAssociationLembaga.invalidate();
      },
      onError: (error) => {
        toast({
          title: 'Gagal',
          description: error.message || 'Gagal mengubah permintaan',
          variant: 'destructive',
        });
      },
    });

  // Delete mutations
  const deleteEventMutation = api.users.deleteRequestAssociation.useMutation({
    onSuccess: () => {
      toast({
        title: 'Berhasil',
        description: 'Permintaan berhasil dihapus',
      });
      setDeleteDialogOpen(false);
      void utils.users.getMyRequestAssociation.invalidate();
    },
    onError: (error) => {
      toast({
        title: 'Gagal',
        description: error.message || 'Gagal menghapus permintaan',
        variant: 'destructive',
      });
    },
  });

  const deleteLembagaMutation =
    api.users.deleteRequestAssociationLembaga.useMutation({
      onSuccess: () => {
        toast({
          title: 'Berhasil',
          description: 'Permintaan berhasil dihapus',
        });
        setDeleteDialogOpen(false);
        void utils.users.getMyRequestAssociationLembaga.invalidate();
      },
      onError: (error) => {
        toast({
          title: 'Gagal',
          description: error.message || 'Gagal menghapus permintaan',
          variant: 'destructive',
        });
      },
    });

  const handleEdit = (request: AssociationRequest & { type: 'event' | 'lembaga' }) => {
    setSelectedRequest(request);
    setEditDivision(request.division);
    setEditPosition(request.position);
    setEditDialogOpen(true);
  };

  const handleDelete = (request: AssociationRequest & { type: 'event' | 'lembaga' }) => {
    setSelectedRequest(request);
    setDeleteDialogOpen(true);
  };

  const confirmEdit = () => {
    if (!selectedRequest) return;

    if ('type' in selectedRequest && selectedRequest.type === 'event' && selectedRequest.event_id) {
      editEventMutation.mutate({
        event_id: selectedRequest.event_id,
        division: editDivision,
        position: editPosition,
      });
    } else if ('type' in selectedRequest && selectedRequest.type === 'lembaga' && selectedRequest.lembaga_id) {
      editLembagaMutation.mutate({
        lembaga_id: selectedRequest.lembaga_id,
        division: editDivision,
        position: editPosition,
      });
    }
  };

  const confirmDelete = () => {
    if (!selectedRequest) return;

    if ('type' in selectedRequest && selectedRequest.type === 'event' && selectedRequest.event_id) {
      deleteEventMutation.mutate({ event_id: selectedRequest.event_id });
    } else if ('type' in selectedRequest && selectedRequest.type === 'lembaga' && selectedRequest.lembaga_id) {
      deleteLembagaMutation.mutate({ lembaga_id: selectedRequest.lembaga_id });
    }
  };

  const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0]?.[0] ?? '') + (words[1]?.[0] ?? '');
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <div className="flex flex-col rounded-xl font-sans">
        {allRequests.length > 0 ? (
          <>
            {/* Header: hidden on small screens, visible on md+ */}
            <div className="hidden md:grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr_0.5fr] items-center gap-4 border-b border-[#E7E9EC] p-4 text-sm md:text-[18px] text-[#9DA4A8]">
              <div></div>
              <div className="font-semibold">Nama</div>
              <div className="text-center font-semibold">Lembaga</div>
              <div className="text-center font-semibold">Divisi</div>
              <div className="text-center font-semibold">Posisi</div>
              <div className="text-center font-semibold">Status</div>
              <div></div>
            </div>

            {/* Rows */}
            {allRequests.map((item) => {
              const displayName = item.event_name ?? item.lembaga_name ?? '-';
              const isPending = item.status === 'Pending';

              return (
                <div
                  key={item.id}
                  className="border-b border-[#E7E9EC] p-3 md:p-4"
                >
                  {/* Mobile: stacked, Desktop: grid */}
                  <div className="flex flex-col md:grid md:grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr_0.5fr] md:items-center md:gap-4 gap-2">
                    {/* Avatar */}
                    <div className="flex items-center justify-center">
                      <Avatar className="w-12 h-12 md:w-14 md:h-14">
                        <AvatarImage
                          src={
                            item.image ??
                            '/images/miscellaneous/empty-profile-picture.svg'
                          }
                          alt={displayName}
                        />
                        <AvatarFallback className="bg-[#00B7B7] text-white text-lg font-semibold">
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Nama */}
                    <div className="text-sm md:text-[18px] font-regular text-[#636A6D] px-3 md:px-0">
                      <span className="md:hidden font-semibold">Nama: </span>
                      {displayName}
                    </div>

                    {/* Lembaga */}
                    <div className="text-sm md:text-[18px] font-regular text-[#636A6D] md:text-center px-3 md:px-0">
                      <span className="md:hidden font-semibold">Lembaga: </span>
                      {item.event_id ? 'Kegiatan' : 'Lembaga'}
                    </div>

                    {/* Divisi */}
                    <div className="text-sm md:text-[18px] font-regular text-[#636A6D] md:text-center px-3 md:px-0">
                      <span className="md:hidden font-semibold">Divisi: </span>
                      {item.division}
                    </div>

                    {/* Posisi */}
                    <div className="text-sm md:text-[18px] font-regular text-[#636A6D] md:text-center px-3 md:px-0">
                      <span className="md:hidden font-semibold">Posisi: </span>
                      {item.position}
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-center px-3 md:px-0 mt-2 md:mt-0">
                      <Button
                        className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg ${
                          statusConfig[item.status].className
                        }`}
                        disabled
                      >
                        {statusConfig[item.status].label}
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center">
                      {isPending && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-1">
                              <Image
                                src="/icons/more-vert.svg"
                                alt="More"
                                width={24}
                                height={24}
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-xl min-w-[120px] p-0 overflow-hidden"
                          >
                            <DropdownMenuItem
                              onSelect={() => handleEdit(item)}
                              className="w-full rounded-none cursor-pointer flex items-center gap-3 px-3 py-2 hover:bg-gray-100 focus:bg-gray-100"
                            >
                              <Pencil className="text-[#00B7B7] h-4 w-4" />
                              <span className="text-sm">Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="mx-0 my-0 h-px bg-gray-200" />
                            <DropdownMenuItem
                              onSelect={() => handleDelete(item)}
                              className="w-full rounded-none cursor-pointer flex items-center gap-3 px-3 py-2 hover:bg-gray-100 focus:bg-gray-100"
                            >
                              <Trash className="text-[#F16350] h-4 w-4" />
                              <span className="text-sm">Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Image
              src="/images/miscellaneous/not-found-association.svg"
              alt="No Data"
              width={120}
              height={120}
              className="mb-6"
            />
            <div className="text-xl md:text-[32px] font-semibold text-[#768085] mb-2">
              Tidak ada permintaan asosiasi
            </div>
            <p className="text-sm md:text-[24px] text-[#C4CACE] max-w-xs md:max-w-md">
              Maaf, belum ada permintaan asosiasi yang masuk
            </p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permintaan Asosiasi</DialogTitle>
            <DialogDescription>
              Ubah divisi dan posisi yang Anda inginkan
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="division">Divisi</Label>
              <Input
                id="division"
                value={editDivision}
                onChange={(e) => setEditDivision(e.target.value)}
                placeholder="Masukkan divisi"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Posisi</Label>
              <Input
                id="position"
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value)}
                placeholder="Masukkan posisi"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={confirmEdit}
              disabled={
                editEventMutation.isPending || editLembagaMutation.isPending
              }
            >
              {editEventMutation.isPending || editLembagaMutation.isPending
                ? 'Menyimpan...'
                : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Permintaan Asosiasi</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus permintaan asosiasi ke{' '}
              <span className="font-semibold">
                {selectedRequest?.event_name ?? selectedRequest?.lembaga_name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="warning"
              onClick={confirmDelete}
              disabled={
                deleteEventMutation.isPending ||
                deleteLembagaMutation.isPending
              }
            >
              {deleteEventMutation.isPending ||
              deleteLembagaMutation.isPending
                ? 'Menghapus...'
                : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
