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
import Link from 'next/link';
import CallMadeIcon from 'public/icons/call_made.svg';
import * as React from 'react';
import CustomPagination from '~/app/_components/layout/pagination-comp';
import { EditAnggotaDialog } from '~/app/_components/form/edit-anggota-dialog';
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

export type Member = {
  id: string;
  nama: string;
  nim: string;
  divisi: string;
  posisi: string;
  posisiColor: string;
};

function ActionCell({ member, lembagaId }: { member: Member; lembagaId?: string }) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const mutation = api.lembaga.removeAnggota.useMutation();

  const onDelete = (id: string) => {
    mutation.mutate(
      { user_id: id },
      {
        onSuccess: () => {
          mutation.reset();
          window.location.reload();
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setEditOpen(true)}
        className="border-blue-400 text-blue-400 hover:border-blue-500 hover:text-blue-500"
      >
        Edit
      </Button>
      <EditAnggotaDialog
        isOpen={editOpen}
        setIsOpen={setEditOpen}
        memberId={member.id}
        currentPosition={member.posisi}
        currentDivision={member.divisi}
        lembagaId={lembagaId}
      />
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-red-400 text-red-400 hover:border-red-500 hover:text-red-500"
          >
            Hapus
          </Button>
        </DialogTrigger>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Hapus Anggota</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus anggota ini?
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex items-center justify-center gap-x-4">
            <Button onClick={() => setDeleteOpen(false)}>
              Tidak, Batalkan
            </Button>
            <Button
              onClick={() => {
                onDelete(member.id);
                setDeleteOpen(false);
              }}
              variant="warning"
            >
              Ya, Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


const columns: ColumnDef<Member>[] = [
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
    cell: ({ row }) => <span>{row.getValue('posisi')}</span>,
  },
  {
    accessorKey: 'rapor',
    header: 'Rapor',
    cell: ({ row }) => (
      <Link href={`/anggota/${row.original.id}`}>
        <Button
          variant="outline"
          className="bg-neutral-250 text-gray-700 hover:bg-neutral-300 border-neutral-400 px-3 py-2 rounded-lg flex items-center gap-2"
        >
          Lihat
          <Image
            src={CallMadeIcon}
            alt="Call Made Icon"
            width={16}
            height={16}
          />
        </Button>
      </Link>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => <ActionCell member={row.original} lembagaId={(table.options.meta as any)?.lembagaId} />,
  },
];

export function MahasiswaCardTable({ data, lembagaId }: { data: Member[]; lembagaId?: string }) {
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
    meta: { lembagaId },
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
