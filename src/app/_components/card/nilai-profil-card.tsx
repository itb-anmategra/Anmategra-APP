import { Card, CardContent } from '~/components/ui/card';

export type NilaiProfilCardType = {
  nilai?: number | null;
  name: string;
};

export default function NilaiProfilCard({
  nilai = 100,
  name = 'Profil 1',
}: NilaiProfilCardType) {
  return (
    <Card className="flex flex-col flex-shrink-0 w-full sm:w-[130px] md:w-[144px] min-h-[90px] sm:min-h-[100px] md:min-h-[110px] items-center justify-center gap-2 sm:gap-[10px]">
      <CardContent className="flex flex-col items-center px-4 sm:px-5 md:px-[25.8px] py-3 sm:py-4 md:py-[17.2px] justify-center">
        <div className="text-sm sm:text-base md:text-[18px] text-neutral-600 text-center">
          {name}
        </div>
        <div className="text-2xl sm:text-3xl md:text-[32px] font-medium text-[#2B6282]">{nilai}</div>
      </CardContent>
    </Card>
  );
}
