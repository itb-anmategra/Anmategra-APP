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

export type ColumnType = 'Draft' | 'In Progress' | 'Resolved';

export interface ColumnProps {
  title: ColumnType;
  reports: Report[];
}

interface ReportColumnProps extends ColumnProps {
  displayedStatus: ColumnType[];
  hideColumn: (type: ColumnType) => void;
  activeReportId?: string;
}

export function getTypeImage(type: ColumnType) {
  switch (type) {
    case 'Draft':
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
  activeReportId,
}: ReportColumnProps) {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/lembaga/laporan/${id}`);
  };

  return (
    <>
      {displayedStatus.includes(title) && (
        <div className="h-[574px] w-[424px] overflow-y-scroll rounded-md bg-gray-100 p-4">
          <div className="mb-4 flex flex-row items-center justify-between">
            <div className="flex flex-row">
              <div className="flex flex-row gap-4">
                <Image src={getTypeImage(title)} alt="Status" />
                <h2 className="text-[18px] font-semibold">{title}</h2>
              </div>
              <span className="ml-2 rounded-full px-2 py-1 text-sm text-[#8196A3]">
                {reports.length}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="mb-2 text-2xl">
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

          <SortableContext
            id={title} // penting: id kolom untuk DnD
            items={reports.map((r) => r.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col space-y-4 min-h-[100px]">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={
                    report.id === activeReportId ? 'opacity-0' : 'opacity-100'
                  }
                >
                  <SortableReportCard
                    report={report}
                    onClickAction={() => handleClick(report.id)}
                  />
                </div>
              ))}
            </div>
          </SortableContext>
        </div>
      )}
    </>
  );
}
