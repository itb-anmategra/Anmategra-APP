import { CalendarIcon, PersonIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { Kepanitiaan } from "~/types/kepanitiaan";

interface KepanitiaanCardProps {
  kepanitiaan: Kepanitiaan;
  orientation?: "vertical" | "horizontal";
}

export const KepanitiaanCard = ({
  kepanitiaan,
  orientation = "vertical",
}: KepanitiaanCardProps) => {
  return (
    <Card
      className={cn(
        "flex w-full cursor-pointer overflow-hidden transition-shadow ease-out hover:shadow-md",
        orientation === "vertical" && "flex-col",
        orientation === "horizontal" && "flex-row",
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          orientation === "vertical" && "aspect-[2.35]",
          orientation === "horizontal" && "aspect-square max-w-52",
        )}
      >
        <Image
          src="/logo-hmif.png"
          alt={kepanitiaan.lembaga.name}
          className="object-cover object-top"
          fill
        />
      </div>
      <div className="flex w-full flex-col gap-[0.6rem] px-6 py-5">
        <div className="flex w-fit items-center gap-2 rounded-full bg-primary-400 px-3 py-1 text-[0.7rem] text-white">
          <Avatar className="size-4 bg-white">
            <AvatarImage
              className="object-contain"
              src={kepanitiaan.lembaga.profilePicture}
            />
            <AvatarFallback>
              {kepanitiaan.lembaga.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="line-clamp-1 font-semibold">
            {kepanitiaan.lembaga.name}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-lg font-semibold leading-tight text-primary-400">
            {kepanitiaan.name}
          </span>
          <div className="flex items-center gap-1 text-sm text-Regent-Gray">
            <PersonIcon />
            {kepanitiaan.quota}
          </div>
        </div>
        <span className="line-clamp-3 text-sm leading-tight">
          {kepanitiaan.description}
        </span>
        <div className="mt-auto flex items-center gap-1 text-sm text-Regent-Gray">
          <CalendarIcon />
          {dayjs(kepanitiaan.startDate).format("MMMM YYYY")} -{" "}
          {dayjs(kepanitiaan.endDate).format("MMMM YYYY")}
        </div>
      </div>
    </Card>
  );
};
