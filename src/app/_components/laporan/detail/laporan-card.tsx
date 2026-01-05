'use client';

import Image from 'next/image';
import PDFIcon from 'public/images/laporan/pdf.png';
import { Card, CardContent, CardHeader } from '~/components/ui/card';

import { type Report } from '../board/report-card';
import { type ColumnType, getTypeImage } from '../board/report-column';

export interface LaporanDetailProps extends Report {
  status: ColumnType;
  content: string;
  attachment?: Attachment[];
}

export interface Attachment {
  name: string;
  //TODO: Add name in here maybe
}

export const LaporanCard = (Laporan: LaporanDetailProps) => {
  return (
    <Card className="rounded-2xl border-neutral-400 bg-transparent">
      <CardHeader>
        {
          <div className="flex w-full justify-between text-black">
            <div className="flex flex-col gap-2">
              <h1 className="text-[32px] font-semibold break-words">{Laporan.name}</h1>
              <h3 className="text-[18px] text-[#636A6D] break-words">{Laporan.date}</h3>
              <span className="border-gray-[#636A6D] rounded-full border px-4 py-2 text-[16px] text-[#636A6D] justify-content-center w-fit">
                {Laporan.category}
              </span>
            </div>
            <div className="flex h-fit flex-row items-center gap-2 text-[18px] font-semibold">
              <Image
                src={getTypeImage(Laporan.status)}
                alt={Laporan.status + ' Icon'}
              />
              <h4 className="break-words">{Laporan.status}</h4>
            </div>
          </div>
        }
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <>
          <div className="h-fit text-justify text-[20px] whitespace-pre-wrap break-words">
            {Laporan.content}
          </div>
          {Laporan.attachment && Laporan?.attachment.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[20px]">
                Attachment:{' '}
              </span>
              <div className="inline">
                {Laporan.attachment.map((attch, index) => (
                  <a
                    key={index}
                    href={attch.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-fit flex-row items-center gap-2 rounded-3xl border border-neutral-400 bg-white px-[24px] py-2 transition-colors hover:bg-neutral-100 cursor-pointer"
                  >
                    <Image
                      className="h-5 w-5"
                      src={PDFIcon}
                      alt={'Attachment Icon'}
                    />
                    <h1 className="text-[18px] max-w-[400px] truncate">
                        {attch.name}
                    </h1>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      </CardContent>
    </Card>
  );
};
