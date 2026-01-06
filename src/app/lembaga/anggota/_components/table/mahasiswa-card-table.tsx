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
import { type Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import CallMadeIcon from 'public/icons/call_made.svg';
import * as React from 'react';
import { ActionCell, type Member } from '~/app/_components/form/action-cell';
import { type comboboxDataType } from '~/app/_components/form/tambah-edit-anggota-form';
import CustomPagination from '~/app/_components/layout/pagination-comp';
import { Button } from '~/components/ui/button';
// Components Import
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

type TableMeta = {
  lembagaId?: string;
  eventId?: string;
  session: Session | null;
  posisiBidangData: { posisi: comboboxDataType[]; bidang: comboboxDataType[] };
  isKegiatan?: boolean;
};

export function MahasiswaCardTable({
  data,
  lembagaId,
  eventId,
  session,
  posisiBidangData,
  isKegiatan = false,
}: {
  data: Member[];
  lembagaId?: string;
  eventId?: string;
  session: Session | null;
  posisiBidangData: { posisi: comboboxDataType[]; bidang: comboboxDataType[] };
  isKegiatan?: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  const tableMeta = React.useMemo(
    () => ({ lembagaId, eventId, session, posisiBidangData, isKegiatan }),
    [lembagaId, eventId, session, posisiBidangData, isKegiatan],
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);

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
      cell: ({ row, table }) => {
        const eventId = (table.options.meta as TableMeta)?.eventId;
        const isKegiatan = (table.options.meta as TableMeta)?.isKegiatan;
        const href =
          isKegiatan && eventId
            ? `/kegiatan/${eventId}/panitia/${row.original.id}`
            : `/anggota/${row.original.id}`;

        return (
          <Link href={href}>
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
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row, table }) => (
        <ActionCell
          member={row.original}
          lembagaId={(table.options.meta as TableMeta)?.lembagaId}
          eventId={(table.options.meta as TableMeta)?.eventId}
          session={(table.options.meta as TableMeta)?.session}
          posisiBidangData={(table.options.meta as TableMeta)?.posisiBidangData}
          isKegiatan={(table.options.meta as TableMeta)?.isKegiatan}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: tableMeta,
  });

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1">
        {/* Desktop Table View */}
        <div className="hidden md:block w-full overflow-x-auto">
          <Table className="min-w-max">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="text-neutral-500">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-left font-normal"
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
                        className="text-neutral-700"
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
                  <TableCell colSpan={columns.length} className="text-center py-12">
                    <div className="text-neutral-500">
                      <p className="text-lg mb-2">Tidak ada anggota ditemukan</p>
                      <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="bg-white rounded-lg border p-4 shadow-sm"
              >
                {/* Header - Name and NIM */}
                <div className="mb-4 pb-3 border-b">
                  <h3 className="font-semibold text-lg text-neutral-700">
                    {row.original.nama}
                  </h3>
                  <p className="text-sm text-neutral-500">{row.original.nim}</p>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-neutral-500">
                      Divisi
                    </span>
                    <span className="text-sm text-neutral-700">
                      {row.original.divisi}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-neutral-500">
                      Posisi
                    </span>
                    <span className="text-sm text-neutral-700">
                      {row.original.posisi}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t flex gap-2">
                  <Link
                    href={
                      isKegiatan && eventId
                        ? `/kegiatan/${eventId}/panitia/${row.original.id}`
                        : `/anggota/${row.original.id}`
                    }
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full bg-neutral-250 text-gray-700 hover:bg-neutral-300 border-neutral-400"
                    >
                      Lihat Rapor
                    </Button>
                  </Link>
                  <ActionCell
                    member={row.original}
                    lembagaId={lembagaId}
                    eventId={eventId}
                    session={session}
                    posisiBidangData={posisiBidangData}
                    isKegiatan={isKegiatan}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <div className="text-neutral-500">
                <p className="text-lg mb-2">Tidak ada anggota ditemukan</p>
                <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
