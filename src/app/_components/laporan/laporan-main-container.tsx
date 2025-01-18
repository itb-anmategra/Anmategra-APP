"use client";
// Library Import
import { useState } from "react";
// Components Import
import { KanbanBoard } from "./board/kanban-board";
import { CurrentDisplay, LaporanHeader } from "./laporan-header";
import { ColumnProps, ColumnType } from "./board/report-column";
import { ListDisplay } from "./list/list-display";
import { SearchBar } from "./search-bar";
import { Input } from "~/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

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

  return (
    <div className="container p-6 space-y-4">
      {/* Header */}
      <LaporanHeader
        setCurrentDisplay={setCurrentDisplay}
        status={status}
        toggleStatus={toggleStatus}
      />
      {/* Input */}
      <Input
        placeholder="Cari laporan"
        className="rounded-2xl bg-white focus-visible:ring-transparent placeholder:text-neutral-700"
        startAdornment={
          <MagnifyingGlassIcon className="size-4 text-gray-500" />
        }
      />

      {/* Board Display */}
      {display === "Board" && (
        <KanbanBoard
          kanbanData={Laporan.data}
          hideColumn={hideStatus}
          displayedColumn={status}
        />
      )}
      {/* List Display */}
      {display === "List" && (
        <ListDisplay
          kanbanData={Laporan.data}
          hideColumn={hideStatus}
          displayedColumn={status}
        />
      )}
    </div>
  );
};
