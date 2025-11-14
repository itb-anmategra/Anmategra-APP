import Image, { type StaticImageData } from 'next/image';
import { Accordion, AccordionItem } from '~/components/ui/accordion';
import { useRouter } from 'next/navigation';

import { type Report } from '../board/report-card';
import { type ColumnType } from '../board/report-column';
import LaporanFormDialog from '../detail/laporan-form';

interface AccordionProps {
  title: ColumnType;
  logo: StaticImageData;
  reports: Report[];
  selectedStatus: ColumnType[];
  isAdminView?: boolean;
}

type DataItem = Report;

export const ListDisplayItem = ({ id, name, date, category }: DataItem) => {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/lembaga/laporan/${id}`);
  }

  return (
    <li className="flex flex-row items-center justify-between gap-2 rounded-xl border-b p-4 text-[17px] text-[#636A6D] shadow-sm">
      <h1 className="">{name}</h1>
      <div className="flex flex-row items-center justify-evenly space-x-20">
        <h2>{date}</h2>
        <span onClick={() => handleClick(id)} className="border-[#636A6D] rounded-full border px-4 py-2 text-sm">
          {category}
        </span>
        <span className="h-4 w-4 rounded-full bg-[#F5CB69]"></span>
      </div>
    </li>
  );
};

export const AccordionDisplay = ({
  title,
  logo,
  reports,
  isAdminView,
}: AccordionProps) => {
  return (
    <Accordion type="multiple">
      <AccordionItem value={title}>
        {/* Trigger */}
        <div>
          <div className="rounded-xl bg-[#E9EDF1] px-5 py-3">
            <div className="flex w-full items-center justify-between">
              {/* Kiri: Logo + Judul + Count */}
              <div className="flex items-center space-x-2">
                <Image
                  src={logo}
                  alt={`${title} Icon`}
                  width={24}
                  height={24}
                />
                <h1 className="text-xl font-semibold">{title}</h1>
                <span className="text-gray-500">{reports.length}</span>
              </div>

              {/* Kanan: Tombol Buat Laporan */}
              {!isAdminView && <LaporanFormDialog />}
            </div>
          </div>
        </div>

        {/* Content */}
        <ul className="space-y-2">
          {reports.map((report) => (
            <ListDisplayItem
              key={report.id}
              id={report.id}
              name={report.name}
              date={report.date}
              category={report.category}
            />
          ))}
        </ul>
      </AccordionItem>
    </Accordion>
  );
};
