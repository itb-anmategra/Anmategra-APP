import { type ColumnProps } from '~/app/_components/laporan/board/report-column';
import { LaporanMainContainer } from '~/app/_components/laporan/laporan-main-container';
import { type Report } from '~/app/_components/laporan/board/report-card';
import { api } from '~/trpc/server';

type Status = 'Draft' | 'Backlog' | 'In Progress' | 'Resolved';

function isValidStatus(status: string): status is Status {
  return ['Draft', 'Backlog', 'In Progress', 'Resolved'].includes(status);
}

export function formatTanggal(dateInput: Date | string): string {
  const date = new Date(dateInput);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Jakarta',
  };

  return new Intl.DateTimeFormat('id-ID', options).format(date);
}

async function LaporanPage() {
  const data = await api.users.getAllReportsUser({});
  
    const reportsByStatus: Record<Status, Report[]> = {
    'Draft': [],
    'Backlog': [],
    'In Progress': [],
    'Resolved': [],
  };

  (data.reports || []).forEach((report) => {
    if (isValidStatus(report.status)) {
      reportsByStatus[report.status].push({
        id: report.id,
        name: report.subject,
        date: formatTanggal(report.created_at),
        category: report.urgent,
      });
    }
  });

  const finalData: ColumnProps[] = [
    { title: 'Draft', reports: reportsByStatus.Draft },
    { title: 'Backlog', reports: reportsByStatus.Backlog },
    
    { title: 'In Progress', reports: reportsByStatus['In Progress'] },
    { title: 'Resolved', reports: reportsByStatus.Resolved },
  ];

  return <LaporanMainContainer data={finalData} isAdminView={false} />;
};

export default LaporanPage;
