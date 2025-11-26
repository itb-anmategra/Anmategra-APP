import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Image, { type StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import { type Report } from './report-card';
import { SortableReportCard } from './sortable-report-card';
import DraftIcon from '/public/images/laporan/draft.svg';
import InProgressIcon from '/public/images/laporan/in-progress.svg';
import ResolvedIcon from '/public/images/laporan/resolved.svg';

export type ColumnType = 'Draft' | 'Backlog' | 'In Progress' | 'Resolved';

export interface ColumnProps {
  title: ColumnType;
  reports: Report[];
}

interface ReportColumnProps extends ColumnProps {
  displayedStatus: ColumnType[];
  hideColumn: (type: ColumnType) => void;
  activeReportId?: string;
  isAdminView?: boolean;
  onEditReport?: (id: string) => void;
  onDeleteReport?: (id: string) => void;
}

export function getTypeImage(type: ColumnType) {
  switch (type) {
    case 'Draft':
      return DraftIcon as StaticImageData;
    case 'Backlog':
      return DraftIcon as StaticImageData;
    case 'In Progress':
      return InProgressIcon as StaticImageData;
    case 'Resolved':
      return ResolvedIcon as StaticImageData;
  }
}

export function ReportColumn({
  title,
  reports,
  displayedStatus,
  hideColumn,
  // activeReportId,
  isAdminView = false,
  onEditReport,
  onDeleteReport,
}: ReportColumnProps) {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/lembaga/laporan/${id}`);
  };

  return (
    <>
      {displayedStatus.includes(title) && (
        <div className="flex flex-col bg-gray-100 rounded-xl p-4 shadow-sm w-full flex-shrink-0 h-auto md:h-[574px]">
          <div className="mb-4 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-3">
              <Image src={getTypeImage(title)} alt="Status" />
              <h2 className="text-lg font-semibold">{title}</h2>
              <span className="rounded-full px-2 py-1 text-sm text-gray-500">
                {reports.length}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="mb-2 text-2xl select-none">
                ...
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-xl">
                <DropdownMenuItem>
                  <Button variant="ghost" onClick={() => hideColumn(title)}>
                    Hide Column
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div
            className="
            flex-1 overflow-y-auto pr-2 

            /* SCROLLBAR STYLE */
            scrollbar-thin 
            scrollbar-thumb-gray-400 
            scrollbar-track-transparent

            /* MOBILE SCROLLBAR HIDE */
            [-webkit-overflow-scrolling:touch]
          "
          >
            <SortableContext
              id={title}
              items={reports.map((r) => r.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col space-y-4 min-h-[120px] pb-4 pr-1">
                {reports.map((report) => (
                  <SortableReportCard
                    key={report.id}
                    report={report}
                    column={title}
                    onClickAction={() => handleClick(report.id)}
                    onEdit={() => onEditReport?.(report.id)}
                    onDelete={() => onDeleteReport?.(report.id)}
                    isAdminView={isAdminView}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        </div>
      )}
    </>
  );
}
