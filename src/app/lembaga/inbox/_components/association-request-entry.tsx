'use client';

import Image from 'next/image';
import React from 'react';
import { Button } from '~/components/ui/button';

type PermintaanAsosiasi = {
  image: string;
  nama: string;
  posisi: string;
  divisi: string;
};

const AssociationRequestEntry: React.FC<{ data: PermintaanAsosiasi[] }> = ({
  data,
}) => {
  return (
    <div className="flex flex-col rounded-xl pl-1 pb-1 p-4 font-sans">
      <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] items-center gap-4 border-b border-[#E7E9EC] p-4 font-regular weight-400 text-[18px] text-[#9DA4A8]">
        <div>Nama</div>
        <div className="pl-[50px]">Posisi</div>
        <div className="text-center">Divisi</div>
        <div className="justify-self-end mr-[110px]">Request</div>
      </div>

      {data.map((item: PermintaanAsosiasi, index: number) => (
        <div
          key={index}
          className={
            'grid grid-cols-[2fr_1fr_1fr_1.5fr] items-center gap-4 p-4 border-b border-[#E7E9EC]'
          }
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full overflow-hidden w-[60px] h-[60px]">
              <Image
                src={item.image}
                alt="Profile Picture"
                width={60}
                height={60}
              />
            </div>
            <span className="pl-[20px] text-[18px] font-regular weight-400 text-[#636A6D]">
              {item.nama}
            </span>
          </div>
          <div className="text-[18px] font-regular weight-400 pl-[50px] text-[#636A6D]">
            {item.posisi}
          </div>
          <div className="text-[18px] font-regular weight-400 text-center text-[#636A6D]">
            {item.divisi}
          </div>
          <div className="flex items-center justify-end gap-2 weight-700">
            <Button
              onClick={() =>
                console.log(`Permintaan untuk divisi ${item.divisi} ditolak.`)
              }
              className="border-none px-4 py-2 bg-[#FAFAFA] text-[14px] text-[#FF0000] hover:bg-[#FF0000] hover:text-white"
            >
              DECLINE
            </Button>

            <Button
              onClick={() =>
                console.log(`Permintaan untuk divisi ${item.divisi} diterima.`)
              }
              variant="outline"
              className="rounded-2px border-[#29BC5B] border-[2px] px-4 py-2 bg-[#FAFAFA] text-[14px] text-[#29BC5B] hover:bg-[#29BC5B] hover:text-white"
            >
              ACCEPT
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssociationRequestEntry;
