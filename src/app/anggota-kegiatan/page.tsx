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
import { MahasiswaCardTable } from "~/app/anggota-kegiatan/_components/MahasiswaCardTable"; // Adjust the path if needed
import { Sidebar } from "./_components/layout/Sidebar";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  return (
    <main className="flex flex-row bg-[#FAFAFA] w-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1">
        {/* Search Bar */}
        <div className="mt-20 mx-20 w-full">
          <p className="text-[32px] mb-2 font-semibold">Anggota</p>
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full max-w-[84%]">
              <Image
                src={SearchIcon}
                alt="Search"
                width={20}
                height={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                className="rounded-[24px] pl-12 pr-4 border-[1px] border-neutral-400 w-full"
                placeholder="Cari nama anggota"
              />
            </div>
          </div>
        </div>

        {/* List Anggota */}
        <div className="mt-6 mx-20">
          {/* Button Section */}
          <div className="flex justify-between">
            <Button className="bg-[#00B7B7] text-white rounded-[16px] px-4 py-2 shadow-none flex items-center gap-2">
              <Image src={Plus} alt="plus" width={16} height={16} />
              Tambah Anggota Baru
            </Button>

            {/* Filter Button */}
            <Button className="bg-white text-black rounded-[24px] px-4 py-2 shadow-none border border-neutral-400 flex items-center gap-2">
              <Image src={Filter} alt="filter" width={16} height={16} />
              Filter
            </Button>
          </div>

          {/* List Anggota Section */}
          <div className="mt-6">
            {/* Integrate MahasiswaCardTable here */}
            <MahasiswaCardTable />
          </div>
        </div>
      </div>
    </main>
  );
}
