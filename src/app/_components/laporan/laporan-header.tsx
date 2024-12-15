import { AlignLeft, LayoutGrid, Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "~/components/ui/dropdown-menu";
import { ColumnType } from "./board/report-column";
import Draft from "/public/images/laporan/draft.svg";
import InProgress from "/public/images/laporan/in-progress.svg";
import Resolved from "/public/images/laporan/resolved.svg";
import ListIcon from "/public/images/laporan/display-list.svg";
import BoardIcon from "/public/images/laporan/board.svg";

export type CurrentDisplay = "Board" | "List";

interface LaporanHeaderProps {
  setCurrentDisplay: (value: CurrentDisplay) => void;
  status: ColumnType[];
  toggleStatus: (column: ColumnType) => void;
}

export const LaporanHeader = ({
  setCurrentDisplay,
  status,
  toggleStatus,
}: LaporanHeaderProps) => {
  return (
    <header className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Laporan</h1>
      <div className="flex space-x-2 text-lg font-semibold">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center rounded-md border px-6 py-2 text-lg font-semibold"
            >
              <LayoutGrid className="h-6 w-6" />
              Display
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="flex flex-col items-center gap-4 rounded-md border py-4 pl-3 pr-3"
          >
            <DropdownMenuItem
              className="flex w-full min-w-[150px] flex-row items-center gap-5 text-lg font-semibold "
              onClick={() => setCurrentDisplay("List")}
            >
              <Image
                className="h-4 w-4"
                src={ListIcon}
                alt={"Draft Icon"}
              ></Image>
              <h1>List</h1>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full min-w-[150px] flex-row items-center gap-5 text-lg font-semibold hover:bg-gray-200"
              onClick={() => setCurrentDisplay("Board")}
            >
              <Image
                className="h-4 w-4"
                src={BoardIcon}
                alt={"Draft Icon"}
              ></Image>
              <h1>Board</h1>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="px-6 text-lg font-semibold">
              <AlignLeft className="h-4 w-4" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="flex flex-col items-center gap-4 rounded-md border py-4 pl-3 pr-3"
          >
            <DropdownMenuCheckboxItem
              className="flex w-full min-w-[150px] flex-row items-center gap-5 text-lg font-semibold"
              checked={status.includes("Draft")}
              onClick={() => toggleStatus("Draft")}
            >
              <Image src={Draft} alt="Draft Icon" className="h-5 w-5" />
              <span>Draft</span>
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              className="flex w-full min-w-[150px] flex-row items-center gap-5 text-lg font-semibold"
              checked={status.includes("In Progress")}
              onClick={() => toggleStatus("In Progress")}
            >
              <Image
                src={InProgress}
                alt="In Progress Icon"
                className="h-5 w-5"
              />
              <span>In Progress</span>
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              className="flex w-full min-w-[150px] flex-row items-center gap-5 text-lg font-semibold"
              checked={status.includes("Resolved")}
              onClick={() => toggleStatus("Resolved")}
            >
              <Image src={Resolved} alt="Resolved Icon" className="h-5 w-5" />
              <span>Resolved</span>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button className="min-w-[100px] bg-primary-400 text-white">
          <Plus /> Buat laporan
        </Button>
      </div>
    </header>
  );
};
