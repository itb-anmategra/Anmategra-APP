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
    <div className="flex w-[400px] cursor-pointer items-center gap-4 rounded-2xl border border-[#C4CACE] bg-white px-7 py-5 hover:shadow-md">
      <div className="relative h-20 w-20 overflow-hidden rounded-full border-[1px] border-[#C4CACE]">
        <Image
          src={logo}
          alt={`${title} logo`}
          fill
          className="rounded-full object-cover object-center"
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-[#2B6282]">{title}</h3>
        <p className="text-lg text-[#768085]">{category}</p>
      </div>
    </div>
  );
};
