// Library Impoty
import Image from "next/image";
import {api} from "~/trpc/server";
// Component Import
import {Input} from "~/components/ui/input";
// Icons Import
import SearchIcon from "~/../public/icons/search.svg";
import {MagnifyingGlassIcon} from "@radix-ui/react-icons";
import ActivityList from "~/app/lembaga/kegiatan/_components/kegiatanContainer";

export default async function Home() {

  // Get activities from API
  const activitites = await api.kegiatan.getAllByLembaga(); // Belum ada Auth
  const formattedActivities = activitites.map((activity) => ({
    id: activity.id,
    name: activity.name,
    description: activity.description,
    start_date: activity.start_date.toLocaleDateString(),
    participant_count: activity.participant_count,
    status: activity.status,
    thumbnail: activity.image,
  }));

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
          <div>
            <ActivityList propActivites={formattedActivities}/>
          </div>
        </div>
      </div>
    </main>
  );
}
