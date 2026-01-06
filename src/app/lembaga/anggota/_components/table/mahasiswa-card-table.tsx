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
          eventId={eventId}
          session={session}
          posisiBidangData={posisiBidangData}
          isKegiatan={isKegiatan}
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
