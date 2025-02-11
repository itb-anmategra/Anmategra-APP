"use client";
// Library Import
import * as React from "react";
import {
    type ColumnDef,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
// Components Import
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import {Button} from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
// TRPC Import
import {api} from "~/trpc/react";
import {usePathname} from "next/navigation";

export type Member = {
    id: string;
    nama: string;
    nim: string;
    divisi: string;
    posisi: string;
    posisiColor: string;
};

const columns: ColumnDef<Member & { event_id: string }>[] = [
    {
        accessorKey: "nama",
        header: "Nama",
        cell: ({row}) => <span>{row.getValue("nama")}</span>,
    },
    {
        accessorKey: "nim",
        header: "NIM",
        cell: ({row}) => <span>{row.getValue("nim")}</span>,
    },
    {
        accessorKey: "divisi",
        header: "Divisi",
        cell: ({row}) => <span>{row.getValue("divisi")}</span>,
    },
    {
        accessorKey: "posisi",
        header: "Posisi",
        cell: ({row}) => {
            const colorMap: Record<string, string> = {
                yellow: "bg-yellow-400",
                green: "bg-green-400",
                blue: "bg-blue-400",
                navy: "bg-blue-900",
                red: "bg-red-400",
            };
            const posisiColor = colorMap[row.original.posisiColor] ?? "bg-gray-400";
            const mutation = api.event.removePanitia.useMutation()

            const onDelete = (id: string, event_id: string) => {
                mutation.mutate({id: id, event_id: event_id}, {
                    onSuccess: () => {
                        mutation.reset()
                    }
                })
            }

            return (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${posisiColor}`}></span>
                        {row.getValue("posisi")}
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                // onClick={() => onDelete(row.original.id)}
                                variant={"outline"} size={"sm"}
                                className="border-red-400 text-red-400 hover:border-red-500 hover:text-red-500">
                                Hapus
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Hapus Anggota</DialogTitle>
                                <DialogDescription>Apakah kamu yakin ingin menghapus anggota ini?</DialogDescription>
                            </DialogHeader>
                            <div className="w-full flex items-center justify-center gap-x-4">
                                <Button>
                                    Tidak, Batalkan
                                </Button>
                                <Button onClick={() => onDelete(row.original.id, row.original.event_id)}
                                        variant={"destructive"}>
                                    Ya, Hapus
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            );
        },
    },
];

export function MahasiswaKegiatanCardTable(
    {
        data
    }: {
        data: Member[]
    }
) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const pathname = usePathname();
    const event_id = pathname.split("/")[3];
    if (event_id === undefined) {
        throw new Error("Event ID is not defined");
    }
    const formattedData = data.map((item) => ({...item, event_id: event_id}));
    const table = useReactTable({
        data: formattedData,
        columns,
        state: {sorting},
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
