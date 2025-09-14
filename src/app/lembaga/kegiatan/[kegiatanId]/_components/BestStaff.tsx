'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import {
  type Division,
  type Month,
  divisions,
  months,
  years,
} from './staffData';

type BestStaffProps = {
  divisions: Division[];
  months: Month[];
  years: string[];
};

const BestStaff = ({ divisions, months, years }: BestStaffProps) => {
  const selectTriggerBase =
    'h-[40px] rounded-lg [&>span]:text-[#9DA4A8] [&>span]:text-xs border border-[#636A6D]';
  const selectContentBase =
    'border border-[#C4CACE] [&_[data-radix-select-viewport]]:p-0';
  const selectItemBase =
    'py-2.5 px-3 border-b last:border-0 border-[#636A6D] rounded-none text-xs text-[#636A6D] hover:bg-gray-100';

  const [selectedStaff, setSelectedStaff] = useState<Record<string, string>>(
    {},
  );

  const handleSubmit = () => {
    console.log('Pilihan Best Staff:', selectedStaff);
    alert(JSON.stringify(selectedStaff, null, 2));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-[191px] h-[50px] bg-[#00B7B7] rounded-2xl hover:bg-[#00A5A5] text-white text-[18px] font-semibold">
          <Image
            src="/images/icon/image 22.svg"
            alt="confetti"
            width={24}
            height={24}
          />
          Pilih Best Staff
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[724px] max-h-[90vh] flex flex-col rounded-[20px] p-6 sm:p-10 [&>button[aria-label='Close']]:hidden">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-[32px] font-bold">
            Pilih Best Staff
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-black">
            Periode Penilaian
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 pt-2">
          {/* Periode */}
          <div className="flex w-full gap-4 mb-6 items-center">
            <Select>
              <SelectTrigger className={`${selectTriggerBase} flex-[2]`}>
                <SelectValue placeholder="Bulan" />
              </SelectTrigger>
              <SelectContent className={selectContentBase}>
                {months.map((m) => (
                  <SelectItem
                    key={m.value}
                    value={m.value}
                    className={selectItemBase}
                  >
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className={`${selectTriggerBase} flex-[1]`}>
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent className={selectContentBase}>
                {years.map((y) => (
                  <SelectItem key={y} value={y} className={selectItemBase}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="self-center text-xs">s.d.</span>

            <Select>
              <SelectTrigger className={`${selectTriggerBase} flex-[2]`}>
                <SelectValue placeholder="Bulan" />
              </SelectTrigger>
              <SelectContent className={selectContentBase}>
                {months.map((m) => (
                  <SelectItem
                    key={m.value}
                    value={m.value}
                    className={selectItemBase}
                  >
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className={`${selectTriggerBase} flex-[1]`}>
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent className={selectContentBase}>
                {years.map((y) => (
                  <SelectItem key={y} value={y} className={selectItemBase}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Daftar Divisi */}
          <div className="w-full max-w-[500px] mx-auto space-y-3">
            <div className="flex gap-12 bg-white z-10 py-2 font-semibold text-sm">
              <div className="w-[120px] sm:w-[140px]">Divisi</div>
              <div className="flex-1">Best Staff</div>
            </div>

            {divisions.map((divisi, i) => (
              <div key={i} className="flex items-center gap-12">
                <div className="w-[120px] sm:w-[140px] text-sm text-[#636A6D]">
                  {divisi.name}
                </div>
                <div className="flex-1">
                  <Select
                    onValueChange={(val) =>
                      setSelectedStaff((prev) => ({
                        ...prev,
                        [divisi.name]: val,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full h-[32px] rounded-xl text-sm text-[#636A6D] border border-[#C4CACE]">
                      <SelectValue placeholder="Pilih anggota" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-[#C4CACE] [&_[data-radix-select-viewport]]:p-0">
                      {divisi.candidates.map((staff, j) => (
                        <SelectItem
                          key={j}
                          value={staff}
                          className="py-1.5 px-3 border-b last:border-0 border-[#C4CACE] rounded-none text-xs text-[#636A6D] hover:bg-gray-100"
                        >
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-4 pt-4">
          <DialogClose asChild>
            <Button
              onClick={handleSubmit}
              className="bg-[#2B6282] text-sm text-white font-semibold leading-[26px] w-[100px] sm:w-[120px] h-[40px] rounded-xl hover:bg-[#265673] transition"
            >
              SIMPAN
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BestStaff;
