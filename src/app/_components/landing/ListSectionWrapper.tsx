import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ListSectionWrapperProps extends React.PropsWithChildren {
  className?: string;
  title: string;
  seeAllLink: string;
}

export const ListSectionWrapper = ({
  className,
  title,
  seeAllLink,
  children,
}: ListSectionWrapperProps) => {
  return (
    <div
      className={cn("flex size-full flex-col gap-4 px-4 sm:px-12", className)}
    >
      <div className="flex w-full items-center justify-between gap-4">
        <span className="text-xl font-semibold">{title}</span>
        <Button asChild variant="ghost" className="flex items-center gap-2">
          <Link href={seeAllLink}>
            Lihat Semua
            <ChevronRightIcon />
          </Link>
        </Button>
      </div>
      {children}
    </div>
  );
};
