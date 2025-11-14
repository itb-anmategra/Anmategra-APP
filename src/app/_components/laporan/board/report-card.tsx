import { useDraggable } from '@dnd-kit/core';
import Link from 'next/link';

export interface Report {
  id: string;
  name: string;
  date: string;
  category: string;
}

export function ReportCard({ report }: { report: Report }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: report.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
      }}
      className="rounded-md bg-white shadow"
    >
      <Link
        href={`/lembaga/laporan/${report.id}`}
        className="block px-6 py-5"
        onClick={(e) => e.stopPropagation()} 
        draggable="false"
      >
        <h3 className="mb-2 text-left text-[20px] font-semibold text-primary-400">
          {report.name}
        </h3>
        <div className="text-secondary-1100 flex items-center justify-between">
          <span className="text-[18px] text-gray-500">{report.date}</span>
          <span className="rounded-full border border-[#636A6D] bg-transparent px-4 py-1 text-[18px] text-[#636A6D]">
            {report.category}
          </span>
        </div>
      </Link>
    </div>
  );
}
