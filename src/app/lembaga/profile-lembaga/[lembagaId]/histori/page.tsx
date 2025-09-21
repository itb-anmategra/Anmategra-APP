import { Pencil } from 'lucide-react';
import React from 'react';
import CarouselBestStaff from '~/app/_components/carousel/carousel-best-staff';
import BestStaff from '~/app/lembaga/kegiatan/[kegiatanId]/_components/best-staff-form';
import { Button } from '~/components/ui/button';

import { dummyDate } from './_components/dummy-histori';
import { HistoriBreadCrumb } from './_components/histori-breadcrumb';

const HistoriBestStaffPage = () => {
  const namaLembaga = 'HMIF ITB';

  return (
    <div className="w-full flex h-screen flex-col items-center overflow-y-hidden">
      <div className="flex max-w-7xl w-full flex-col gap-6 px-9 py-[68px]">
        <div className="flex w-full flex-col gap-2">
          <h1 className="font-semibold text-[32px]">{namaLembaga}</h1>
          <HistoriBreadCrumb
            items={[
              { label: 'Beranda', href: '/lembaga' },
              { label: 'Lembaga', href: `/lembaga/profile-lembaga/uuid-hmif` },
              {
                label: 'Histori',
                href: `/lembaga/profile-lembaga/uuid-hmif/histori`,
              },
            ]}
          />
        </div>
        <div
          className="flex flex-col max-h-[70vh] overflow-y-auto scroll-smooth gap-[50px]
        [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/*kalo bisa pake shadcn scrollbar biar bisa hidden*/}
          {dummyDate.map((item, id) => (
            <div key={id} className="flex flex-col gap-3">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  Best Staff Periode {item.startDate}–{item.endDate} 2025
                </h2>
                <BestStaff
                  trigger={
                    <Button
                      variant={'dark_blue'}
                      className="rounded-xl gap-2 p-3"
                    >
                      <Pencil className="w-6 h-6" />
                      <h3 className="font-semibold text-[18px]">
                        Edit Best Staff
                      </h3>
                    </Button>
                  }
                />
              </div>

              <CarouselBestStaff />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoriBestStaffPage;
