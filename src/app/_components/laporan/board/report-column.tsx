import Image from "next/image";
import { Draggable } from "./draggable";
import { Report, ReportCard } from "./report-card";
import DraftIcon from "/public/images/laporan/draft.svg";
import InProgressIcon from "/public/images/laporan/in-progress.svg";
import ResolvedIcon from "/public/images/laporan/resolved.svg";
export type ColumnType = "Draft" | "In Progress" | "Resolved";

export interface ReportColumnProps {
  title: ColumnType;
  reports: Report[];
}

function getTypeImage(type: ColumnType) {
  switch (type) {
    case "Draft":
      return DraftIcon;
    case "In Progress":
      return InProgressIcon;
    case "Resolved":
      return ResolvedIcon;
  }
}

export function ReportColumn({ title, reports }: ReportColumnProps) {
  return (
    <div className="rounded-md bg-gray-100 p-4">
      <div className="mb-4 flex items-center">
        <div className="flex flex-row gap-4">
          <Image src={getTypeImage(title)} alt={"Status"} />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <span className="ml-2 rounded-full px-2 py-1 text-sm text-[#8196A3]">
          {reports.length}
        </span>
      </div>
      <div className="flex flex-col space-y-4">
        {reports.map((report) => (
          <Draggable key={report.id} id={report.id}>
            <ReportCard report={report} />
          </Draggable>
        ))}
      </div>
    </div>
  );
}
