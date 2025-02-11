import {
  LaporanCard,
  type LaporanDetailProps,
} from "~/app/_components/laporan/detail/laporan-card";
import { SearchBar } from "~/app/_components/placeholder/search-bar";

export default function ReportDetail() {
  const dummyData: LaporanDetailProps = {
    id: "1",
    name: "Report 1",
    date: "15/07/2024",
    category: "Kategori",
    content:
      "      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ac auctor mauris. Vestibulum vel pulvinar ex. Aenean in enim nisi. Morbi vitae dapibus eros, in pellentesque arcu. Integer in nunc lorem. Morbi eu quam nulla. Praesent tristique ex sed dolor laoreet dignissim. Aliquam egestas mi sed ipsum blandit egestas scelerisque elementum risus.\nNulla convallis, neque sed gravida feugiat, neque nulla consequat augue, nec mattis ex lorem consectetur felis. Curabitur fringilla, lectus non mattis molestie, ex risus varius quam, in luctus diam justo ac nulla. Vestibulum magna nulla, gravida in tellus consequat, tempus tempus quam. Nam a nunc mattis, egestas enim quis, hendrerit velit. Cras elementum nisi nec maximus gravida. Maecenas a lectus a quam feugiat rutrum. Integer posuere, sapien sit amet tempus fringilla, lorem dolor hendrerit neque, a tincidunt sapien libero sed odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur sem dolor, imperdiet ut sapien id, sodales auctor tortor.",
    status: "In Progress",
    attachment: [{ name: "Attachment1.pdf" }],
  };

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
        status={dummyData.status}
        content={dummyData.content}
        id={dummyData.id}
        name={dummyData.name}
        date={dummyData.date}
        category={dummyData.category}
        attachment={dummyData.attachment}
      />
    </div>
  );
}
