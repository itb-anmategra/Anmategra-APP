export interface Report {
  id: string;
  name: string;
  date: string;
  category: string;
}

export function ReportCard({ report }: { report: Report }) {
  return (
    <div
      id={report.id}
      className="rounded-md bg-white py-5 px-6 pr-[20%] shadow"
      style={{ cursor: "grab" }}
    >
      <h3 className="mb-2 text-primary-400 text-xl text-left font-semibold ">{report.name}</h3>
      <div className="flex text-secondary-1100 items-center justify-between">
        <span className="text-sm text-gray-500">{report.date}</span>
        <span className="rounded-full bg-gray-200 px-2 py-1 text-sm">
          {report.category}
        </span>
      </div>
    </div>
  );
}
