import { Users } from 'lucide-react';
import Image from 'next/image';

interface EventCardProps {
  title: string;
  description: string;
  dateRange: string;
  participants: number;
  imageUrl: string;
}

export function EventCard({
  title,
  description,
  dateRange,
  participants,
  imageUrl,
}: EventCardProps) {
  return (
    <div className="flex items-center overflow-hidden rounded-lg border bg-white p-4">
      <div className="relative h-[100px] w-[100px] flex-shrink-0 rounded-lg bg-black">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="100px"
        />
      </div>
      <div className="ml-4 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded bg-[#0EA5E9] px-2 py-1 text-xs text-white">
            <Image
              src="/images/placeholder/"
              alt="ITB"
              width={16}
              height={16}
              className="rounded-full"
            />
            Lembaga ITB
          </div>
        </div>
        <h3 className="mb-2 font-medium text-slate-900">{title}</h3>
        <p className="mb-3 text-sm text-slate-500">{description}</p>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>{dateRange}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {participants}
          </div>
        </div>
      </div>
    </div>
  );
}
