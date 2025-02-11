import Image, { type StaticImageData } from "next/image";
import { type Report, ReportCard } from "./report-card";
import DraftIcon from "/public/images/laporan/draft.svg";
import InProgressIcon from "/public/images/laporan/in-progress.svg";
import ResolvedIcon from "/public/images/laporan/resolved.svg";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
export type ColumnType = "Draft" | "In Progress" | "Resolved";

export interface ColumnProps {
  title: ColumnType;
  reports: Report[];
}

interface ReportColumnProps extends ColumnProps {
  displayedStatus: ColumnType[];
  hideColumn: (type: ColumnType) => void;
}

export function getTypeImage(type: ColumnType) {
  switch (type) {
    case "Draft":
      return DraftIcon as StaticImageData;
    case "In Progress":
      return InProgressIcon as StaticImageData;
    case "Resolved":
      return ResolvedIcon as StaticImageData;
  }
}

export function ReportColumn({
  title,
  reports,
  displayedStatus,
  hideColumn,
}: ReportColumnProps) {
  return (
    <>
      {displayedStatus.includes(title) && (
        <div className="h-[574px] w-[424px] overflow-y-scroll rounded-md bg-gray-100 p-4">
          <div className="mb-4 flex flex-row items-center justify-between">
            <div className="flex flex-row">
              <div className="flex flex-row gap-4">
                <Image src={getTypeImage(title)} alt={"Status"} />
                <h2 className="text-xl font-semibold">{title}</h2>
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
                  <Button variant={"ghost"} onClick={() => hideColumn(title)}>
                    Hide Column
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col space-y-4">
            {reports.map((report) => (
              <ReportCard report={report} key={report.id}/>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
