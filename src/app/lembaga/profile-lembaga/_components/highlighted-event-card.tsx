import { CalendarIcon, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import DummyFotoEvent from 'public/images/placeholder/kegiatan-thumbnail.png';
import LogoHMIFKecil from 'public/images/placeholder/logo-hmif.png';
import { type FC } from 'react';
import { Badge } from '~/components/ui/badge';
import { Card } from '~/components/ui/card';

interface HighlightedEvent {
  id: string;
  name: string;
  image?: string | null;
  description?: string | null;
  start_date: Date;
  end_date?: Date | null;
  status: 'Coming Soon' | 'On going' | 'Ended';
  oprec_link?: string | null;
  background_image?: string | null;
  location?: string | null;
  participant_limit?: number;
  participant_count?: number;
  is_highlighted?: boolean;
  is_organogram?: boolean;
}

interface HighlightedEventCardProps {
  event: HighlightedEvent;
  lembagaData: {
    users: {
      id: string;
      image: string | null;
    };
    id: string;
    name: string;
    type: string | null;
    description: string | null;
    foundingDate: Date | null;
    endingDate: Date | null;
    memberCount: number | null;
  };
}

const HighlightedEventCard: FC<HighlightedEventCardProps> = ({
  event,
  lembagaData,
}) => {
  return (
    <Link href={`/lembaga/profile-kegiatan/${event.id}`}>
      <Card className="flex flex-row items-center w-full max-w-7xl min-h-[180px] border-[0.86px] border-[#C4CACE] rounded-[28px] overflow-hidden bg-white transition-all hover:shadow-md">
        {/* Event Image */}
        <div className="w-[245px] h-[210px] flex-shrink-0 relative">
          <Image
            src={event.image ?? DummyFotoEvent}
            alt="Poster Event Highlight"
            fill
            className="object-cover rounded-l-[28px] opacity-100"
            sizes="245px"
          />
        </div>

        {/* Info Content */}
        <div className="flex flex-col justify-center items-start px-[30.96px] gap-[10.32px] flex-1 h-[122.4px] bg-white">
          {/* Badge & Participant */}
          <div className="flex flex-row justify-between items-center w-full">
            <Badge className="flex flex-row items-center gap-[6.88px] bg-[#2B6282] py-[3.44px] px-[10.32px] rounded-[13.76px]">
              <Image
                src={lembagaData?.users.image ?? LogoHMIFKecil}
                alt="Logo Lembaga"
                width={21}
                height={21}
                className="rounded-full object-cover"
              />
              <p className="text-[12px] leading-[16px] font-bold text-white">
                {lembagaData?.name}
              </p>
            </Badge>

            <div className="flex flex-row items-center gap-[6.88px] text-[#768085] text-[14px] leading-[20px]">
              <Users
                width={21}
                height={21}
                className="fill-current text-[#768085]"
              />
              <p className="font-normal">{event.participant_count}</p>
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex flex-col gap-[6.88px] w-full">
            <p className="text-[18px] font-bold leading-[26px] text-[#2B6282]">
              {event.name}
            </p>
            {event.description && (
              <p className="text-[14px] leading-[20px] text-[#1E1E1E] line-clamp-1">
                {event.description}
              </p>
            )}
          </div>

          {/* Date, Location & Status */}
          <div className="flex flex-row items-center gap-[6.88px] text-[14px] leading-[20px] text-[#768085]">
            <CalendarIcon width={21} height={21} />
            <p>
              {event.start_date.toLocaleDateString('id-ID', {
                month: 'short',
                year: 'numeric',
              })}
              -{' '}
              {event.end_date?.toLocaleDateString('id-ID', {
                month: 'short',
                year: 'numeric',
              }) ?? 'TBD'}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default HighlightedEventCard;
