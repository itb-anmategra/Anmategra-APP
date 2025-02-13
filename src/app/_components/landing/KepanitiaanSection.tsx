import { KepanitiaanCard } from "../beranda/KepanitiaanCard";
import { ListSectionWrapper } from "./ListSectionWrapper";
import {type Kepanitiaan} from "~/types/kepanitiaan";
import Link from "next/link";

export const KepanitiaanSection = (
    {
        data
    }: {
        data: Kepanitiaan[];
    }
) => {


  return (
    <ListSectionWrapper
      className="container mx-auto"
      title="Kegiatan Terbesar"
      seeAllLink="#"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data?.map((kepanitiaan) => (
          <Link 
            key={kepanitiaan.name + kepanitiaan.description}  
            href={`profil-lembaga/${kepanitiaan.id}`}
          >
            <KepanitiaanCard
              kepanitiaan={kepanitiaan}
              orientation="vertical"
            />
          </Link>
        ))}
        {!data || data.length === 0 && (
          <div>
            <p className="text-slate-600">Tidak ada kepanitiaan terbaru yang dapat ditampilkan.</p>
          </div>
        )}
      </div>
    </ListSectionWrapper>
  );
};
