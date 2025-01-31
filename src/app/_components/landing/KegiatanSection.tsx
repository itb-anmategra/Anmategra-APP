import { KEPANITIAAN_DATA } from "~/lib/constants";
import { KepanitiaanCard } from "../beranda/KepanitiaanCard";
import { ListSectionWrapper } from "./ListSectionWrapper";
import {Kepanitiaan} from "~/types/kepanitiaan";
import Link from "next/link";

export const KegiatanSection = (
    {
        data
    }: {
        data: Kepanitiaan[];
    }
) => {
  return (
    <ListSectionWrapper
      className="container mx-auto"
      title="Kegiatan Terbaru"
      seeAllLink="#"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* show only first 6 data (depends on api response), click show all to see every data */}
        {data.map((kepanitiaan) => (
          <Link href={`/profil-kegiatan/${kepanitiaan.id}`}>
            <KepanitiaanCard
              key={kepanitiaan.name + kepanitiaan.description}
              kepanitiaan={kepanitiaan}
              orientation="vertical"
            />
          </Link>
        ))}
      </div>
    </ListSectionWrapper>
  );
};
