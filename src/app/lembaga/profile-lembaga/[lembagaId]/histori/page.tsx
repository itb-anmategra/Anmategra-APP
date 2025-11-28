import { Pencil } from 'lucide-react';
import React from 'react';
import CarouselBestStaff from '~/app/_components/carousel/carousel-best-staff';
import BestStaff from '~/app/lembaga/_components/best-staff-form';
import { Button } from '~/components/ui/button';

// import { dummyDate } from './_components/dummy-histori';
import { api } from '~/trpc/server';
import { HistoriBreadCrumb } from './_components/histori-breadcrumb';

interface Props {
  params: {
    lembagaId: string;
  };
}

const HistoriBestStaffPage = async ({ params }: Props) => {
  // const session = await getServerAuthSession();
  const { lembagaId } = params;

  const historyData = await api.lembaga.getAllHistoryBestStaffLembaga({
    lembaga_id: lembagaId,
  });

  const lembagaInfo = await api.profile.getLembaga({ lembagaId: lembagaId });
  const namaLembaga = lembagaInfo?.lembagaData?.name ?? 'Lembaga';

  // const is_authorized = lembagaInfo.lembagaData?.users.id === session?.user?.id;

  return (
    <div className="w-full flex h-screen flex-col items-center overflow-y-hidden">
      <div className="flex max-w-7xl w-full flex-col gap-6 px-9 py-[68px]">
        <div className="flex w-full flex-col gap-2">
          <h1 className="font-semibold text-[32px]">{namaLembaga}</h1>
          <HistoriBreadCrumb
            items={[
              { label: 'Beranda', href: '/' },
              { label: 'Lembaga', href: `/profile-lembaga/${lembagaId}` },
              {
                label: 'Histori',
                href: `/profile-lembaga/${lembagaId}/histori`,
              },
            ]}
          />
        </div>
        <div
          className="flex flex-col max-h-[70vh] overflow-y-auto scroll-smooth gap-[50px]
        [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/*kalo bisa pake shadcn scrollbar biar bisa hidden*/}
          {historyData.periode.length > 0 ? (
            historyData.periode.map((periode, id) => {
              const startDate = new Date(periode.start_date).toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric',});
              const endDate = new Date(periode.end_date).toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric',
              });
              return (
            <div key={id} className="flex flex-col gap-3">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  Best Staff Periode {startDate}–{endDate}
                </h2>
                <BestStaff
                  lembagaId={params.lembagaId}
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

              <CarouselBestStaff bestStaffList={periode.best_staff_list} />
            </div>
          )})) : (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <h2 className="text-2xl font-semibold mb-4">
                Belum ada histori Best Staff
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoriBestStaffPage;
