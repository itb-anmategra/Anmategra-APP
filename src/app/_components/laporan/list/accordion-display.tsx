import Image, { StaticImageData } from "next/image";
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from "~/components/ui/accordion";
import { Report } from "../board/report-card";
import { ColumnType } from "../board/report-column";

interface AccordionProps {
  title: ColumnType;
  logo: StaticImageData;
  reports: Report[];
  selectedStatus : ColumnType[];
}

interface DataItem extends Report {}

export const ListDisplayItem = ({ name, date, category }: DataItem) => {
  return (
    <li className="flex flex-row items-center justify-between gap-6 rounded-xl border-b p-6 text-sm text-[#636A6D] shadow-sm">
      <h1 className="">{name}</h1>
      <div className="flex flex-row items-center justify-evenly space-x-16">
        <h2>{date}</h2>
        <span className="border-gray-[#636A6D] rounded-full border px-4 py-2 text-sm">
          {category}
        </span>
        <span className="h-4 w-4 rounded-full bg-[#F5CB69]"></span>
      </div>
    </li>
  );
};

export const AccordionDisplay = ({ title, logo, reports }: AccordionProps) => {
  return (
    <Accordion type="multiple">
      <AccordionItem value={title}>
        {/* Trigger */}
        <AccordionTrigger className="rounded-xl bg-[#E9EDF1] px-5">
          <div className="flex items-center space-x-4">
            <Image src={logo} alt={`${title} Icon`} width={24} height={24} />
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
        </AccordionTrigger>

        {/* Content */}
        <AccordionContent>
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
