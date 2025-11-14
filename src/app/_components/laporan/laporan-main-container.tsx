'use client';

// Library Import
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Input } from '~/components/ui/input';

// Components Import
import { KanbanBoard } from './board/kanban-board';
import { type ColumnProps, type ColumnType } from './board/report-column';
import LaporanFormDialog from './detail/laporan-form';
import { type CurrentDisplay, LaporanHeader } from './laporan-header';
import { ListDisplay } from './list/list-display';

interface LaporanProps {
  data: ColumnProps[];
  isAdminView?: boolean;
}

export const LaporanMainContainer = (Laporan: LaporanProps) => {
  const [display, setCurrentDisplay] = useState<CurrentDisplay>('Board');

  const [status, setStatus] = useState<ColumnType[]>([
    'Draft',
    'In Progress',
    'Resolved',
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
    <div className="min-h-screen space-y-4 p-6">
      {/* Header */}
      <LaporanHeader
        setCurrentDisplay={setCurrentDisplay}
        status={status}
        toggleStatus={toggleStatus}
        isLaporanEmpty={isLaporanEmpty}
        currentDisplay={display}
        isAdminView={Laporan.isAdminView ?? false}
      />
      {/* Input */}
      {!isLaporanEmpty && (
        <Input
          placeholder="Cari laporan"
          className="rounded-3xl py-5 h-[60px] text-[18px] bg-white placeholder:text-neutral-700 focus-visible:ring-transparent"
          startAdornment={
            <MagnifyingGlassIcon className="size-5 text-gray-500" />
          }
        />
      )}

      {/* Board Display */}
      {display === 'Board' && !isLaporanEmpty && (
        <KanbanBoard
          kanbanData={Laporan.data}
          hideColumnAction={hideStatus}
          displayedColumn={status}
        />
      )}
      {/* List Display */}
      {display === 'List' && !isLaporanEmpty && (
        <ListDisplay
          kanbanData={Laporan.data}
          hideColumnAction={hideStatus}
          displayedColumn={status}
          isAdminView={Laporan.isAdminView}
        />
      )}
      {/* Show Tambah Laporan Button in the middle of Screen */}
      {isLaporanEmpty && (
        <div className="flex h-4/5 flex-col items-center justify-center gap-3">
          <h1 className="text-2xl font-semibold text-neutral-300">
            Buat laporan baru!
          </h1>
          <LaporanFormDialog isAdmin={Laporan.isAdminView ?? false}/>
        </div>
      )}
    </div>
  );
};
