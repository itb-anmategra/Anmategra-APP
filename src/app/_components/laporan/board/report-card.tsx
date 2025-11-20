'use client';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import { type ColumnType } from './report-column';

export interface Report {
  id: string;
  name: string;
  date: string;
  category: string;
}

export interface ReportCardProps {
  report: Report;
  column: ColumnType;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ReportCard({ report, column, onClick, onEdit, onDelete }: ReportCardProps) {
  const showMenu = column === "Draft";

  return (
    <div className="relative w-full">
      {showMenu && (
        <div className="absolute right-3 top-3 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger className="text-2xl select-none">
              ...
            </DropdownMenuTrigger>

            <DropdownMenuContent className="text-xl">
              <DropdownMenuItem onClick={onEdit}>
                <Button variant="ghost" className="w-full justify-start">
                  Edit
                </Button>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onDelete}>
                <Button variant="ghost" className="w-full justify-start">
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <button
        onClick={onClick}
        className="rounded-[20px] bg-white px-6 py-5 pr-[20%] shadow w-full text-left"
      >
        <h3 className="mb-2 text-[20px] font-semibold text-primary-400">
          {report.name}
        </h3>

        <div className="flex items-center justify-between text-secondary-1100">
          <span className="text-[18px] text-gray-500">{report.date}</span>

          <span className="border border-[#636A6D] rounded-full bg-transparent text-[#636A6D] px-4 py-1 text-[18px]">
            {report.category}
          </span>
        </div>
      </button>
    </div>
  );
}
