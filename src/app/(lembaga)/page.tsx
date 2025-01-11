// Components Import
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { KepanitiaanCard } from "../_components/lembaga/KepanitiaanCard";
// Icons Import
import { ChevronRightIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
// Constants Import
import { KEPANITIAAN_DATA } from "~/lib/constants";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full flex-col gap-4 p-6">
      {/* Title and Search */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Beranda</h1>
        <Input
          placeholder="Cari lembaga, kegiatan, atau mahasiswa"
          className="rounded-2xl bg-white focus-visible:ring-transparent placeholder:text-neutral-700"
          startAdornment={
            <MagnifyingGlassIcon className="size-4 text-gray-500" />
          }
        />
      </div>

      {/* List of Kepanitiaan */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Kepanitiaan Terbaru</h2>
          <Button variant="ghost" className="flex items-center gap-2">
            Lihat Semua
            <ChevronRightIcon />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {KEPANITIAAN_DATA.map((kepanitiaan) => (
            <Link href={`/profile-kegiatan/${kepanitiaan.name}`}>
              <KepanitiaanCard kepanitiaan={kepanitiaan} key={kepanitiaan.name} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}