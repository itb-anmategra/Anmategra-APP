import { cn } from "~/lib/utils";

interface ListSectionWrapperProps extends React.PropsWithChildren {
  className?: string;
  title: string;
  seeAllLink: string;
}

export const ListSectionWrapper = ({
  className,
  title,
  children,
}: ListSectionWrapperProps) => {
  return (
    <div
      className={cn("flex size-full flex-col gap-4 px-4 sm:px-12", className)}
    >
      <div className="flex w-full items-center justify-between gap-4">
        <span className="text-2xl font-semibold text-[#0B5C8A]">{title}</span>
        {/* <Button asChild variant="ghost" className="flex items-center gap-2">
          <Link href={seeAllLink}>
            Lihat Semua
            <ChevronRightIcon />
          </Link>
        </Button> */}
      </div>
      {children}
    </div>
  );
};
