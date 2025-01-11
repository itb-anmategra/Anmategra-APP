import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import Image from "next/image";

interface KegiatanCardProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  organization: string;
  participantCount: number;
  lembagaImageUrl: string;
  kegiatanImageUrl: string;
}

export default function KegiatanCard({
  title = "Judul",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
  startDate = "Jan 2024",
  endDate = "Mei 2024",
  organization = "Lembaga ITB",
  participantCount = 50,
  lembagaImageUrl = "/placeholder/logo if.png",
  kegiatanImageUrl = "/placeholder/kegiatan thumbnail.png",
}: KegiatanCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-3xl border border-black/10 shadow-none md:flex-row">
      <div className="relative h-[200px] w-full flex-shrink-0 bg-black md:w-[200px]">
        <Image
          alt={`${organization} logo`}
          className="h-full w-full object-cover"
          height={200}
          src={kegiatanImageUrl}
          width={200}
        />
      </div>
      <div className="flex flex-col justify-between p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="gap-2 rounded-full bg-[#2B6282] text-white">
              <div className="relative flex-shrink-0">
                <Image
                  alt={`${organization} logo`}
                  className="h-full w-full object-cover"
                  height={200}
                  src={lembagaImageUrl}
                  width={200}
                />
              </div>
              {organization}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Image
                src="/icons/people_alt.svg"
                className="h-4 w-4"
                height={16}
                width={16}
                alt="Participants"
              />
              <span>{participantCount}</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[#2B6282]">{title}</h3>
            <p className="text-sm text-black">{description}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Image
            src="/icons/calendar.svg"
            className="h-4 w-4"
            height={16}
            width={16}
            alt="Participants"
          />
          <span>
            {startDate} - {endDate}
          </span>
        </div>
      </div>
    </Card>
  );
}
