import {
  LaporanCard,
  type Attachment,
} from "~/app/_components/laporan/detail/laporan-card";
import { SearchBar } from "~/app/_components/placeholder/search-bar";
import { api } from "~/trpc/server";
import { formatTanggal } from "../page";

export default async function ReportDetail({ params }: { params: { laporanId: string } }) {  
  const data = await api.users.getAllReportsUser({});
  const report = data.reports.find((r) => r.id === params.laporanId);

  // jika laporan tidak ditemukan
  if (!report) {
    return (
      <div className="flex flex-col gap-3 p-8">
        <h1>Laporan Tidak Ditemukan</h1>
        <p>Laporan dengan ID "{params.laporanId}" tidak dapat ditemukan.</p>
      </div>
    );
  }

  let attachment: Attachment[] = [];
  if (report.attachment && typeof report.attachment === 'string') {
    attachment.push({ name: report.attachment });
  }

  return (
    <div className="flex flex-col gap-3 p-8">
      <h1>Beranda</h1>
      <span>
        <a className="underline">Beranda</a>
        {" /"}
        <a className="underline">Kegiatan</a>
        {" / "}
        <a className="underline">Detail</a>
      </span>
      <SearchBar placeholder={"Cari laporan"} />

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