import { AlignLeft, LayoutGrid } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export const LaporanHeader = () => {
  return (
    <header className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Laporan</h1>
      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center rounded-md border px-4 py-2"
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Display
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="flex items-center rounded-md border px-4 py-2"
          >
            <DropdownMenuCheckboxItem checked>Draft</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>In Progress</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Resolved</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[100px]">
              <AlignLeft className="mr-2 h-4 w-4" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuCheckboxItem checked>
              In Review
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Approved</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Rejected</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white">
          + Buat laporan
        </button>
      </div>
    </header>
  );
};
