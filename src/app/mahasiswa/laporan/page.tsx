// Props Import
import { type ColumnProps } from "~/app/_components/laporan/board/report-column";
// Components Import
import { LaporanMainContainer } from "~/app/_components/laporan/laporan-main-container";

const DummyData: ColumnProps[] = [

];
const LaporanPage = () => {
  return <LaporanMainContainer data={DummyData}/>;
};

export default LaporanPage;
