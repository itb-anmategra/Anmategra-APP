import { AlignLeft, LayoutGrid, Plus } from 'lucide-react';
import { LayoutDashboard } from 'lucide-react';
import { AlignJustify } from 'lucide-react';
import { Monitor, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import { type ColumnType } from './board/report-column';
import { LaporanDialog } from './detail/laporan-dialog';
import Display from '/public/icons/display.svg';
import Status from '/public/icons/status.svg';
import Draft from '/public/images/laporan/draft.svg';
import InProgress from '/public/images/laporan/in-progress.svg';
import Resolved from '/public/images/laporan/resolved.svg';

export type CurrentDisplay = 'Board' | 'List';

interface LaporanHeaderProps {
  setCurrentDisplay: (value: CurrentDisplay) => void;
  status: ColumnType[];

  toggleStatus: (column: ColumnType) => void;
  isLaporanEmpty: boolean;
}

export const LaporanHeader = ({
  setCurrentDisplay,
  status,

  toggleStatus,
  isLaporanEmpty = false,
}: LaporanHeaderProps) => {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Laporan</h1>
      <div className="flex space-x-2 text-lg font-semibold">
        {/* Dropdown for Display Management */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="">
            <Button
              variant="outline"
              className="flex items-center rounded-xl border px-7 py-3 text-lg font-semibold"
            >
              <Image src={Display} alt="Display" className="h-5 w-5" />
              <p className="text-sm">Display</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="flex flex-col items-center gap-4 rounded-md border py-4 pl-3 pr-3"
          >
            <DropdownMenuItem
              className="flex w-full min-w-[150px] flex-row items-center gap-4 text-lg font-semibold"
              onClick={() => setCurrentDisplay('List')}
            >
              <LayoutDashboard className="h-4 w-4" />
              <p className="text-sm">List</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full min-w-[150px] flex-row items-center gap-4 text-lg font-semibold hover:bg-gray-200"
              onClick={() => setCurrentDisplay('Board')}
            >
              <AlignJustify className="h-4 w-4" />
              <p className="text-sm text-neutral-900">Board</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dropdown for Status Management */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="px-7 py-2 text-lg font-semibold"
            >
              <Image src={Status} alt="Status" className="h-5 w-5" />
              <p className="text-sm">Status</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="flex flex-col items-center gap-4 rounded-md border py-4 pl-3 pr-3"
          >
            <DropdownMenuCheckboxItem
              className="flex w-full min-w-[150px] flex-row items-center gap-5 text-lg font-semibold"
              checked={status.includes('Draft')}
              onClick={() => toggleStatus('Draft')}
            >
              <Image src={Draft} alt="Draft Icon" className="h-5 w-5" />
              <span className="text-sm">Draft</span>
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              className="flex w-full min-w-[150px] flex-row items-center gap-5 text-lg font-semibold"
              checked={status.includes('In Progress')}
              onClick={() => toggleStatus('In Progress')}
            >
              <Image
                src={InProgress}
                alt="In Progress Icon"
                className="h-5 w-5"
              />
              <span className="text-sm text-yellow-500">In Progress</span>
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              className="flex w-full min-w-[150px] flex-row items-center gap-5 text-lg font-semibold"
              checked={status.includes('Resolved')}
              onClick={() => toggleStatus('Resolved')}
            >
              <Image src={Resolved} alt="Resolved Icon" className="h-5 w-5" />
              <span className="text-sm text-green-700">Resolved</span>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hide Tambah Laporan Button if current display is Board and Laporan is Empty (Move the Tambah Laporan in the middle of Screen) */}
        {!isLaporanEmpty && (
          <LaporanDialog
            trigger={
              <div className="flex flex-row items-center gap-2 rounded-lg bg-primary-400 px-3 py-[7px] text-sm text-white transition-all hover:bg-primary-500">
                <Plus width={14} height={14} /> Buat laporan
              </div>
            }
          />
        )}
      </div>
    </header>
  );
};
