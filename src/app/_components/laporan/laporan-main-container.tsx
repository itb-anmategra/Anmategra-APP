"use client";
// Library Import
import { useState } from "react";
// Components Import
import { KanbanBoard } from "./board/kanban-board";
import { type CurrentDisplay, LaporanHeader } from "./laporan-header";
import { type ColumnProps, type ColumnType } from "./board/report-column";
import { ListDisplay } from "./list/list-display";
import { Input } from "~/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Plus } from "lucide-react";
import { LaporanDialog } from "./detail/laporan-dialog";

interface LaporanProps {
  data: ColumnProps[];
}

export const LaporanMainContainer = (Laporan: LaporanProps) => {
  const [display, setCurrentDisplay] = useState<CurrentDisplay>("Board");

  const [status, setStatus] = useState<ColumnType[]>([
    "Draft",
    "In Progress",
    "Resolved",
  ]);

  const toggleStatus = (column: ColumnType) => {
    setStatus(
      (prev) =>
        prev.includes(column)
          ? prev.filter((item) => item !== column) // Remove column
          : [...prev, column], // Add column
    );
  };

  const hideStatus = (column: ColumnType) => {
    setStatus((prev) =>
      prev.includes(column) ? prev.filter((item) => item !== column) : prev,
    );
  };

  const isLaporanEmpty = Laporan.data.length === 0;

  return (
    <div className="h-screen space-y-4 p-6">
      {/* Header */}
      <LaporanHeader
        setCurrentDisplay={setCurrentDisplay}
        status={status}
        toggleStatus={toggleStatus}
        isLaporanEmpty={isLaporanEmpty}
      />
      {/* Input */}
      {!isLaporanEmpty && (
        <Input
          placeholder="Cari laporan"
          className="rounded-2xl bg-white placeholder:text-neutral-700 focus-visible:ring-transparent"
          startAdornment={
            <MagnifyingGlassIcon className="size-4 text-gray-500" />
          }
        />
      )}

      {/* Board Display */}
      {display === "Board" && !isLaporanEmpty && (
        <KanbanBoard
          kanbanData={Laporan.data}
          hideColumnAction={hideStatus}
          displayedColumn={status}
        />
      )}
      {/* List Display */}
      {display === "List" && !isLaporanEmpty && (
        <ListDisplay
          kanbanData={Laporan.data}
          hideColumnAction={hideStatus}
          displayedColumn={status}
        />
      )}
      {/* Show Tambah Laporan Button in the middle of Screen */}
      {isLaporanEmpty && (
        <div className="flex h-4/5 flex-col items-center justify-center gap-3">
          <h1 className="text-2xl font-semibold text-neutral-300">
            Buat laporan baru!
          </h1>
          <LaporanDialog
            trigger={
              <div className="flex flex-row items-center justify-center gap-2 rounded-xl bg-primary-400 px-6 py-3 text-base text-white">
                <Plus></Plus>
                <span>Buat laporan</span>
              </div>
            }
          ></LaporanDialog>
        </div>
      )}
    </div>
  );
};
