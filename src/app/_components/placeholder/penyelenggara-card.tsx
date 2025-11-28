import Image from "next/image";

interface PenyelenggaraCardProps {
  title: string;
  category: string;
  logo: string;
}

export const PenyelenggaraCard: React.FC<PenyelenggaraCardProps> = ({
  title,
  category,
  logo,
}) => {
  return (
    <div className="flex w-3/4 md:w-1/2 cursor-pointer items-center gap-4 rounded-2xl border border-[#C4CACE] bg-white px-7 py-5 hover:shadow-md">
      <div className="h-8 w-8 sm:h-16 sm:w-16 md:h-20 md:w-20 overflow-hidden rounded-full">
        <Image
          src={logo}
          alt={`${title} logo`}
          width={80}
          height={80}
          className="object-cover h-8 w-8 sm:h-16 sm:w-16 md:h-20 md:w-20"
        />
      </div>
      <div>
        <h3 className="text-sm sm:text-lg md:text-xl font-semibold text-[#2B6282]">{title}</h3>
        <p className="text-xs sm:text-base md:text-lg text-[#768085]">{category}</p>
      </div>
    </div>
  );
};
