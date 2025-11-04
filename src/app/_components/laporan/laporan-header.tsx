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
import LaporanFormDialog from './detail/laporan-form';
import DisplayBoard from '/public/icons/board-icon.svg';
import Display from '/public/icons/display.svg';
import DisplayList from '/public/icons/list-icon.svg';
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
  currentDisplay: CurrentDisplay;
  isAdminView: boolean;
}

export const LaporanHeader = ({
  setCurrentDisplay,
  status,
  toggleStatus,
  isLaporanEmpty = false,
  currentDisplay,
  isAdminView,
}: LaporanHeaderProps) => {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-[32px] font-semibold">Laporan</h1>
      <div className="flex space-x-2 gap-[19px] text-lg font-semibold">
        {/* Dropdown for Display Management */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="">
            <Button
              variant="outline"
              className="flex w-[169px] h-[50px] items-center rounded-xl border px-7 py-3 font-semibold"
            >
              <Image
                src={Display}
                alt="Display"
                className="h-[21px] w-[19.5px]"
                style={{ width: 'auto', height: 'auto' }}
              />
              <p className="text-[18px]">Display</p>
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
              <Image
                src={DisplayList}
                alt="Display-list"
                className="h-4 w-4"
                style={{ width: 'auto', height: 'auto' }}
              />
              <p className="text-sm">List</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full min-w-[150px] flex-row items-center gap-4 text-lg font-semibold hover:bg-gray-200"
              onClick={() => setCurrentDisplay('Board')}
            >
              <Image
                src={DisplayBoard}
                alt="Display-list"
                className="h-4 w-4"
                style={{ width: 'auto', height: 'auto' }}
              />
              <p className="text-sm text-neutral-900">Board</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dropdown for Status Management */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-[169px] h-[50px] gap-[10px] px-7 py-2 text-lg font-semibold"
            >
              <Image
                src={Status}
                alt="Status"
                className="h-[26px] w-[26px]"
                style={{ width: 'auto', height: 'auto' }}
              />
              <p className="text-[18px]">Status</p>
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
              <Image
                src={Draft}
                alt="Draft Icon"
                className="h-5 w-5"
                style={{ width: 'auto', height: 'auto' }}
              />
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
                style={{ width: 'auto', height: 'auto' }}
              />
              <span className="text-sm text-yellow-500">In Progress</span>
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              className="flex w-full min-w-[150px] flex-row items-center gap-5 text-lg font-semibold"
              checked={status.includes('Resolved')}
              onClick={() => toggleStatus('Resolved')}
            >
              <Image
                src={Resolved}
                alt="Resolved Icon"
                className="h-5 w-5"
                style={{ width: 'auto', height: 'auto' }}
              />
              <span className="text-sm text-green-700">Resolved</span>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hide Tambah Laporan Button if current display is Board and Laporan is Empty (Move the Tambah Laporan in the middle of Screen) */}
        {!isLaporanEmpty && currentDisplay === 'Board' && !isAdminView && (
          <LaporanFormDialog />
        )}
      </div>
    </header>
  );
};
