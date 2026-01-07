// Library Impoty
import {api} from "~/trpc/server";
// Icons Import
import EventList from "~/app/lembaga/kegiatan/_components/kegiatan-container";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {

  // Get activities from API
  const events = await api.kegiatan.getAllByLembaga(); // Belum ada Auth
  const formattedActivities = events.map((activity) => ({
    id: activity.id,
    name: activity.name,
    description: activity.description,
    start_date: activity.start_date.toISOString(),
    end_date: activity.end_date?.toISOString(),
    participant_count: activity.participant_count,
    status: activity.status,
    thumbnail: activity.image,
    oprec_link: activity.oprec_link,
    location: activity.location,
    participant_limit: activity.participant_limit,
    is_highlighted: activity.is_highlighted,
    is_organogram: activity.is_organogram,
    background_image: activity.background_image,
  }));

  const session = await getServerAuthSession();

  return (
      <main className="flex flex-row bg-[#FAFAFA] w-full">
        <EventList propEvents={formattedActivities} session={session}/>
      </main>
  );
}
