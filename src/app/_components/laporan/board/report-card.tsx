import { useDraggable } from "@dnd-kit/core";

export interface Report {
  id: string;
  name: string;
  date: string;
  category: string;
}

export function ReportCard({ report }: { report: Report }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: report.id,
  });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      id={report.id}
      className="rounded-md bg-white px-6 py-5 pr-[20%] shadow"
      style={{ cursor: "grab" }}
    >
      <h3 className="mb-2 text-left text-xl font-semibold text-primary-400">
        {report.name}
      </h3>
      <div className="text-secondary-1100 flex items-center justify-between">
        <span className="text-sm text-gray-500">{report.date}</span>
        <span className="rounded-full bg-gray-200 px-2 py-1 text-sm">
          {report.category}
        </span>
      </div>
    </button>
  );
}
