import Image, { type StaticImageData } from 'next/image';
import { Accordion, AccordionItem } from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import { type Report } from '../board/report-card';
import { type ColumnType } from '../board/report-column';
import LaporanFormDialog from '../detail/laporan-form';
import Link from 'next/link';
import { api } from '~/trpc/react';
import { useToast } from '~/hooks/use-toast';
import { getToken } from 'next-auth/jwt';


interface AccordionProps {
  title: ColumnType;
  logo: StaticImageData;
  reports: Report[];
  selectedStatus: ColumnType[];
  isAdminView?: boolean;
  onEditReport?: (report: Report) => void;
  onRefresh?: () => void;
}

type DataItem = Report & {
  onEdit?: () => void;
  onDelete?: () => void;
  column: ColumnType;
  isAdminView?: boolean;
};

export const ListDisplayItem = ({ id, name, date, category, onEdit, onDelete, column, isAdminView }: DataItem) => {
  const showMenu = column === "Draft";

  return (
    <li className="relative flex flex-row items-center justify-between gap-2 rounded-xl border-b p-4 text-[17px] text-[#636A6D] shadow-sm">
      

      <Link href={isAdminView ? `/admin/${id}` : `/laporan/${id}`} className="flex items-center justify-between w-full">
        <h1 className="">{name}</h1>
        <div className="flex flex-row items-center justify-evenly space-x-20">
          <h2>{date}</h2>
          <span className="border-[#636A6D] rounded-full border px-4 py-2 text-sm">
            {category}
          </span>
        </div>
      </Link>
      {showMenu && (
        <div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="text-2xl select-none" onClick={(e) => e.stopPropagation()}>
              ...
            </DropdownMenuTrigger>

            <DropdownMenuContent className="text-xl">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}>
                <Button variant="ghost" className="w-full justify-start">
                  Edit
                </Button>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}>
                <Button variant="ghost" className="w-full justify-start">
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </li>
  );
};

export const AccordionDisplay = ({
  title,
  logo,
  reports,
  isAdminView,
  onEditReport,
  onRefresh,
}: AccordionProps) => {
  const { toast } = useToast();

  const deleteReportMutation = api.users.deleteReport.useMutation({
    onSuccess: () => {
      toast({
        title: 'Laporan berhasil dihapus',
        description: 'Laporan draft telah dihapus.',
      });
      onRefresh?.();
    },
    onError: () => {
      toast({
        title: 'Gagal menghapus laporan',
        description: 'Terjadi kesalahan saat menghapus laporan.',
      });
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteReportMutation.mutateAsync({ id });
    } catch (e) {
      console.error('deleteReport failed', e);
    }
  };

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
              {(!isAdminView && title === "Draft") && <LaporanFormDialog isAdmin={isAdminView ?? false} />}
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
              description={report.description}
              urgent={report.urgent}
              attachment={report.attachment}
              column={title}
              isAdminView={isAdminView}
              onEdit={() => onEditReport?.(report)}
              onDelete={() => handleDelete(report.id)}
            />
          ))}
        </ul>
      </AccordionItem>
    </Accordion>
  );
};
