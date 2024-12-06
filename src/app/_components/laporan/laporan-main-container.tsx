"use client";

import { useState } from "react";

import { KanbanBoard } from "./board/kanban-board";
import { CurrentDisplay, LaporanHeader } from "./laporan-header";
import { ColumnProps, ColumnType } from "./board/report-column";
import { ListDisplay } from "./list/list-display";
import { SearchBar } from "./search-bar";

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
    <div className="container mx-auto p-4">
      <LaporanHeader
        setCurrentDisplay={setCurrentDisplay}
        status={status}
        toggleStatus={toggleStatus}
      />

      <SearchBar />

      {display === "Board" && (
        <KanbanBoard
          kanbanData={Laporan.data}
          hideColumn={hideStatus}
          displayedColumn={status}
        />
      )}
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
