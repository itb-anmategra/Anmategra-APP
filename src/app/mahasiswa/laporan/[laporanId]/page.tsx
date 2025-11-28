import {
  type Attachment,
  LaporanCard,
} from "~/app/_components/laporan/detail/laporan-card";
import { api } from "~/trpc/server";
import { formatTanggal } from "../page";
import { RaporBreadcrumb } from "~/app/_components/breadcrumb";

export default async function ReportDetail({params}: {params: { laporanId: string }}) {
  const data = await api.users.getAllReportsUser({});
  const report = data.reports.find((r) => r.id === params.laporanId);

  if (!report) {
    return (
      <div className="flex flex-col gap-3 p-8">
        <h1>Laporan Tidak Ditemukan</h1>
        <p>Laporan dengan ID {params.laporanId} tidak dapat ditemukan.</p>
      </div>
    );
  }
  const attachment: Attachment[] = [];
  if (report.attachment && typeof report.attachment === "string") {
    attachment.push({ name: report.attachment });
  }

  return (
    <div className="flex flex-col gap-3 p-8">
      <RaporBreadcrumb
        items={[
          { label: "Laporan", href: "/laporan" },
          { label: "Detail Laporan", href: `/laporan/${report.id}` },
        ]}
      />
      <LaporanCard
        status={report.status}
        content={report.description}
        id={report.id}
        name={report.subject}
        date={formatTanggal(report.created_at)}
        category={report.urgent}
        attachment={attachment}
      />
    </div>
  );
}
