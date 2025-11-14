import {
  LaporanCard,
  type Attachment,
} from "~/app/_components/laporan/detail/laporan-card";
import { SearchBar } from "~/app/_components/placeholder/search-bar";
import { api } from "~/trpc/server";

export default async function ReportDetail() {  
  const data = await api.users.getAllReportsUser({});

  // asumsi: isi dari atribut attachment adalah string
  const reportCards = data.reports.map((report) => {
    let attachments: Attachment[] = [];
    if (report.attachment && typeof report.attachment === 'string') {
      try {
        attachments = JSON.parse(report.attachment) as Attachment[];
      } catch (error) {
        console.error('Failed to parse attachments:', error);
      }
    }

    return (
      <LaporanCard
        status={report.status}
        content={report.description}
        id={report.id}
        name={report.subject}
        date={report.created_at}
        category={report.urgent}
        attachment={attachments}
      />
    );
  });

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

      {reportCards}
    </div>
  );
}
