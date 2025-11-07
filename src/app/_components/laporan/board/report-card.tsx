'use client';

export interface Report {
  id: string;
  name: string;
  date: string;
  category: string;
}

export interface ReportCardProps {
  report: Report;
  onClick?: () => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-[20px] bg-white px-6 py-5 pr-[20%] shadow w-full"
      style={{ cursor: 'pointer' }}
    >
      <h3 className="mb-2 text-left text-[20px] font-semibold text-primary-400">
        {report.name}
      </h3>
      <div className="text-secondary-1100 flex items-center justify-between">
        <span className="text-[18px] text-gray-500">{report.date}</span>
        <span className="border border-[#636A6D] rounded-full bg-transparent text-[#636A6D] px-4 py-1 text-[18px]">
          {report.category}
        </span>
      </div>
    </button>
  );
}
