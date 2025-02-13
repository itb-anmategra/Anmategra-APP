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
    <div className="flex w-[600px] cursor-pointer items-center gap-4 rounded-2xl border border-[#C4CACE] bg-white px-7 py-5 hover:shadow-md">
      <div className="w-[80px] h-[80px] overflow-hidden rounded-full">
        <Image
          src={logo}
          alt={`${title} logo`}
          width={80}
          height={80}
          className="object-cover h-[80px] w-[80px]"
        />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-[#2B6282]">{title}</h3>
        <p className="text-lg text-[#768085]">{category}</p>
      </div>
    </div>
  );
};
