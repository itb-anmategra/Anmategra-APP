"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronRight } from "lucide-react"; // Import the right arrow icon

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";

export type Member = {
  id: string;
  nama: string;
  nim: string;
  divisi: string;
  posisi: string;
  posisiColor: string; // To map colors for positions
};

const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "nama",
    header: "Nama",
    cell: ({ row }) => <span>{row.getValue("nama")}</span>,
  },
  {
    accessorKey: "nim",
    header: "NIM",
    cell: ({ row }) => <span>{row.getValue("nim")}</span>,
  },
  {
    accessorKey: "divisi",
    header: "Divisi",
    cell: ({ row }) => <span>{row.getValue("divisi")}</span>,
  },
  {
    accessorKey: "posisi",
    header: "Posisi",
    cell: ({ row }) => {
      const colorMap: { [key: string]: string } = {
        yellow: "bg-yellow-400",
        green: "bg-green-400",
        blue: "bg-blue-400",
        navy: "bg-blue-900",
        red: "bg-red-400",
      };
      const posisiColor = colorMap[row.original.posisiColor] || "bg-gray-400";

      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${posisiColor}`}></span>
            {row.getValue("posisi")}
          </div>
          <Button variant={"outline"} size={"sm"} className="border-red-400 text-red-400 hover:border-red-500 hover:text-red-500">
            Hapus
          </Button>
        </div>
      );
    },
  },
];

export function MahasiswaCardTable(
    {
        data
    } : {
        data: Member[]
    }
) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: data,
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
                  <TableHead key={header.id} className="text-left text-gray-600">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={cell.id} className="text-gray-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
    </div>
  );
}
