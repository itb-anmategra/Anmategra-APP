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
        <ActivityList propActivites={formattedActivities}/>
    </main>
  );
}
