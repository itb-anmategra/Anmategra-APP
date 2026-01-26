// Props Import
import { type ColumnProps } from '~/app/_components/laporan/board/report-column';
// Components Import
import { LaporanMainContainer } from '~/app/_components/laporan/laporan-main-container';
import { api } from '~/trpc/server';

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export default async function LaporanPage() {
  const { reports } = await api.admin.getAllReportsAdmin({});

  const columns: ColumnProps[] = ['Reported', 'In Progress', 'Resolved'].map(
    (status) => ({
      title: status as ColumnProps['title'],
      reports: reports
        .filter((r) => r.status === status)
        .map((r) => ({
          id: r.id,
          name: r.subject,
          date: formatDate(r.created_at),
          category: r.urgent,
          description: r.description,
          urgent: r.urgent,
          attachment: r.attachment,
        })),
    }),
  );

  return <LaporanMainContainer data={columns} isAdminView={true} />;
}
