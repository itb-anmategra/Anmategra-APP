"use client";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { SearchBar } from "../search-bar";
import Image from "next/image";
import { Report } from "../board/report-card";
import { ColumnType, getTypeImage } from "../board/report-column";
import PDFIcon from "public/images/laporan/pdf.png";

export interface LaporanDetailProps extends Report {
  status: ColumnType;
  content: string;
  attachment?: Attachment[];
}

interface Attachment {
  name: string;
  //TODO: Add name in here maybe
}

export const LaporanDetail = (Laporan: LaporanDetailProps) => {
  return (
    <div className="flex flex-col gap-3 p-8">
      <h1>Beranda</h1>
      <span>
        <a className="underline">Beranda</a>
        {" / "}
        <a className="underline">Kegiatan</a>
        {" / "}
        <a className="underline">Detail</a>
      </span>
      <SearchBar />
      <Card className="rounded-2xl border-neutral-400 bg-transparent">
        <CardHeader>
          {
            <div className="flex w-full justify-between text-black">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold">{Laporan.name}</h1>
                <h3 className="text-[#636A6D]">{Laporan.date}</h3>
                <span className="border-gray-[#636A6D] text-[#636A6D] rounded-full border px-4 py-2 text-sm">
                  {Laporan.category}
                </span>
              </div>
              <div className="flex flex-row items-center font-semibold text-sm h-fit gap-2">
                <Image
                  src={getTypeImage(Laporan.status)}
                  alt={Laporan.status + " Icon"}
                />
                <h4>{Laporan.status}</h4>
              </div>
            </div>
          }
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <>
            <textarea readOnly className="h-fit resize-none focus-visible:ring-0 focus:ring-0">{Laporan.content}</textarea>
            {Laporan.attachment && Laporan?.attachment.length > 0 && (
              <div className="flex flex-col gap-2">
                <span>{Laporan.attachment?.length} Attachment: </span>
                <div className="inline">
                  {Laporan.attachment.map((attch, index) => (
                    <div className="flex flex-row items-center rounded-3xl border border-neutral-400 bg-white p-4 px-2 py-1 w-fit gap-2" >
                      <Image
                        className="h-5 w-5"
                        src={PDFIcon}
                        alt={"Attachment Icon"}
                      />
                      <h1 className="text-sm">{attch.name}</h1>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        </CardContent>
      </Card>
    </div>
  );
};
