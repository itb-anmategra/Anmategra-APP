'use client';

// Library Import
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Image from 'next/image';
import CallMadeIcon from 'public/icons/call_made.svg';
import MoreVertIcon from 'public/icons/more-vert.svg';
import * as React from 'react';
import CustomPagination from '~/app/_components/layout/pagination-comp';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
// Components Import
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
// TRPC Import
import { api } from '~/trpc/react';

export type MemberKegiatan = {
  id: string;
  nama: string;
  nim: string;
  divisi: string;
  posisi: string;
  posisiColor: string;
  event_id: string;
};

const columns: ColumnDef<MemberKegiatan>[] = [
  {
    accessorKey: 'nama',
    header: 'Nama',
    cell: ({ row }) => <span>{row.getValue('nama')}</span>,
  },
  {
    accessorKey: 'nim',
    header: 'NIM',
    cell: ({ row }) => <span>{row.getValue('nim')}</span>,
  },
  {
    accessorKey: 'divisi',
    header: 'Divisi',
    cell: ({ row }) => <span>{row.getValue('divisi')}</span>,
  },
  {
    accessorKey: 'posisi',
    header: 'Posisi',
    cell: ({ row }) => {
      const mutation = api.event.removePanitia.useMutation();
      const onDelete = (id: string, event_id: string) => {
        mutation.mutate(
          { id: id, event_id: event_id },
          {
            onSuccess: () => {
              mutation.reset();
              window.location.reload();
            },
          },
        );
      };

      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {row.getValue('posisi')}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              {/* <Button
                // onClick={() => onDelete(row.original.id)}
                variant={'outline'}
                size={'sm'}
                className="border-red-400 text-red-400 hover:border-red-500 hover:text-red-500"
              >
                Hapus
              </Button> */}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hapus Anggota</DialogTitle>
                <DialogDescription>
                  Apakah kamu yakin ingin menghapus anggota ini?
                </DialogDescription>
              </DialogHeader>
              <div className="w-full flex items-center justify-center gap-x-4">
                <Button>Tidak, Batalkan</Button>
                <Button
                  onClick={() =>
                    onDelete(row.original.id, row.original.event_id)
                  }
                  variant={'warning'}
                >
                  Ya, Hapus
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
  {
    accessorKey: 'rapor',
    header: 'Rapor',
    cell: ({ row }) => (
      <Button
        variant="outline"
        className="bg-neutral-250 text-gray-700 hover:bg-neutral-300 border-neutral-400 px-3 py-2 rounded-lg flex items-center gap-2"
        onClick={() => {
          // Handle rapor view action
          console.log('View rapor for:', row.original.id);
        }}
      >
        Lihat
        <Image src={CallMadeIcon} alt="Call Made Icon" width={16} height={16} />
      </Button>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-gray-100"
        onClick={() => {
          // Handle more actions
          console.log('More actions for:', row.original.id);
        }}
      >
        <Image src={MoreVertIcon} alt="More Options" width={20} height={20} />
      </Button>
    ),
  },
];

export function MahasiswaKegiatanCardTable({
  data,
}: {
  data: MemberKegiatan[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10; // You can make this configurable

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-left text-neutral-500 font-normal text-lg"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-neutral-700 text-lg"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
