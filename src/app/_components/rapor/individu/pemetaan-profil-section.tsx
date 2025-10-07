import { type ProfilGroup } from '~/app/lembaga/kegiatan/[kegiatanId]/profil/constant';
import { eventProfilProp } from '~/app/lembaga/kegiatan/[kegiatanId]/profil/constant';
import ProfilTable from '~/app/lembaga/kegiatan/_components/table/event-profil-table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';

export type PemetaanProfilSectionProps = {
  pemetaanProfilData?: ProfilGroup[];
  isLembaga: boolean;
};

export default function DetailPemetaanProfilSection({
  pemetaanProfilData = eventProfilProp,
  isLembaga,
}: PemetaanProfilSectionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-[20px]/8 text-neutral-700 mb-[10px] font-normal no-underline">
          {isLembaga ? 'Pemetaan Profil Lembaga' : 'Pemetaan Profil Kegiatan'}
        </AccordionTrigger>
        <AccordionContent>
          <ProfilTable profilData={pemetaanProfilData} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
