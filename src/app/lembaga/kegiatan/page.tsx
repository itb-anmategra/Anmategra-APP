import ActivityList, {Activity} from "./_components/kegiatanContainer";
import {api, HydrateClient} from "~/trpc/server";


export default async function Home() {

  // Get activities from API
  // const activitites = await api.kegiatan.getAllByLembaga(); // Belum ada Auth
  const activitites = await api.kegiatan.getAllPublic();
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
      <>
        <HydrateClient>
          <ActivityList  propActivites={formattedActivities}/>
        </HydrateClient>
      </>
  );
}
