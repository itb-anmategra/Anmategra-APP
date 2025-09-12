'use client';

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

const BestStaff = () => {
  const divisions = [
    { name: 'Human Resources', candidates: ['Andi', 'Budi', 'Citra'] },
    { name: 'Finance', candidates: ['Dewi', 'Eko', 'Fajar'] },
    { name: 'Marketing', candidates: ['Gilang', 'Hana', 'Irfan'] },
    { name: 'IT', candidates: ['Joko', 'Kiki', 'Lina'] },
  ];

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
        <Button className="bg-[#2B6282] hover:bg-sky-800 text-white">
          Pilih Best Staff
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[724px] rounded-[20px] p-6 sm:p-10">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-[32px] font-bold">
            Pilih Best Staff
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-black">
            Periode Penilaian
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full gap-4 mb-6 items-center">
          <Select>
            <SelectTrigger className="h-[40px] rounded-lg flex-[2]">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jan">Januari</SelectItem>
              <SelectItem value="feb">Februari</SelectItem>
              <SelectItem value="mar">Maret</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="h-[40px] rounded-lg flex-[1] ">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>

          <span className="self-center">s.d.</span>

          <Select>
            <SelectTrigger className="h-[40px] rounded-lg flex-[2]">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jan">Januari</SelectItem>
              <SelectItem value="feb">Februari</SelectItem>
              <SelectItem value="mar">Maret</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="h-[40px] rounded-lg flex-[1]   ">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full max-w-[500px] h-[300px] sm:h-[420px] mx-auto overflow-y-auto pr-2 space-y-3">
          {/* Header */}
          <div className="flex gap-[15px] sticky top-0 bg-white z-10 py-2 font-semibold text-sm">
            <div className="w-[120px] sm:w-[140px]">Divisi</div>
            <div className="flex-1">Best Staff</div>
          </div>

          {/* Rows */}
          {divisions.map((divisi, i) => (
            <div key={i} className="flex items-center gap-[15px]">
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
                  <SelectTrigger className="w-full h-[40px] rounded-lg">
                    <SelectValue placeholder="Pilih anggota" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisi.candidates.map((staff, j) => (
                      <SelectItem key={j} value={staff}>
                        {staff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-6 gap-4">
          <Button
            onClick={handleSubmit}
            className="bg-[#2B6282] text-sm text-white font-semibold leading-[26px] w-[100px] sm:w-[120px] h-[40px] rounded-xl hover:bg-sky-800 transition"
          >
            SIMPAN
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BestStaff;
