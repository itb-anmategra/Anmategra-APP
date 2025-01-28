import Link from "next/link";
import Image from "next/image";
import { Calendar, Users, Inbox, FileText, LogOut } from "lucide-react";

import Plus from "~/../public/icons/plus.svg";
import Filter from "~/../public/icons/filter.svg";
import SearchIcon from "~/../public/icons/search.svg"; // Import the magnifying glass icon

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { KegiatanContainer } from "./_components/kegiatanContainer";
import { Sidebar } from "./_components/layout/Sidebar";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  return (
    <main className="flex flex-row bg-[#FAFAFA] w-full p-6">
      {/* Content */}
      <div className="flex-1 space-y-8">
        {/* Search Bar */}
        <div className="w-full">
          <p className="text-2xl mb-4 font-semibold">Kegiatan</p>
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full">
              <Image
                src={SearchIcon}
                alt="Search"
                width={20}
                height={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Cari nama anggota"
                className="rounded-2xl bg-white placeholder:text-neutral-700 focus-visible:ring-transparent"
                startAdornment={
                  <MagnifyingGlassIcon className="size-4 text-gray-500" />
                }
              />
            </div>
          </div>
        </div>

        {/* List Kegiatan */}
        <div>
          {/* Button Section */}
          <div className="flex justify-between">
            <Button className="bg-[#00B7B7] text-white rounded-[16px] px-4 shadow-none flex items-center gap-2">
              <Image src={Plus} alt="plus" width={16} height={16} />
              Tambah Kegiatan Baru
            </Button>

            {/* Filter Button */}
            <Button className="bg-white text-black rounded-[24px] px-4 shadow-none border border-neutral-400 flex items-center gap-2">
              <Image src={Filter} alt="filter" width={16} height={16} />
              Filter
            </Button>
          </div>

          {/* List Kegiatan Section */}
          <div>
            {/* Integrate KegiatanContainer here */}
            <KegiatanContainer />
          </div>
        </div>
      </div>
    </main>
  );
}
