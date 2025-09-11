'use client';

import { Fragment, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

const BestStaff = () => {
  const [isOpen, setIsOpen] = useState(true);

  const divisions = [
    'Nama Divisi',
    'Nama Divisi',
    'Nama Divisi',
    'Nama Divisi',
    'Nama Divisi',
    'Nama Divisi',
    'Nama Divisi',
    'Nama Divisi',
  ];

  return (
    <>
      {isOpen && (
        <div className="inset-0 flex items-center justify-center">
          <div className="bg-white rounded-[20px] w-full max-w-2xl p-4 sm:p-6 lg:p-10 shadow-lg relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl sm:text-[32px] font-bold">
                  Pilih Best Staff
                </h2>
                <p className="text-sm font-medium">Periode Penilaian</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black text-sm font-bold hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Periode */}
            <div className="flex gap-4 mb-6 items-center">
              <Select>
                <SelectTrigger className="w-[140px] sm:w-[167px] h-[40px] rounded-lg">
                  <SelectValue placeholder="Bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jan">Januari</SelectItem>
                  <SelectItem value="feb">Februari</SelectItem>
                  <SelectItem value="mar">Maret</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[120px] sm:w-[167px] h-[40px] rounded-lg">
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>

              <span className="self-center">s.d.</span>

              <Select>
                <SelectTrigger className="w-[140px] sm:w-[167px] h-[40px] rounded-lg">
                  <SelectValue placeholder="Bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jan">Januari</SelectItem>
                  <SelectItem value="feb">Februari</SelectItem>
                  <SelectItem value="mar">Maret</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[120px] sm:w-[167px] h-[40px] rounded-lg">
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-[15px] mb-8 w-full max-w-[500px] h-[300px] sm:h-[420px] mx-auto overflow-y-auto pr-2">
              <div className="font-semibold text-sm sticky top-0 bg-white z-10 py-2">
                Divisi
              </div>
              <div className="font-semibold text-sm sticky top-0 bg-white z-10 py-2">
                Best Staff
              </div>

              {divisions.map((divisi, i) => (
                <Fragment key={i}>
                  <div className="font-normal leading-[40px] text-sm text-[#636A6D]">
                    {divisi}
                  </div>
                  <div>
                    <Select>
                      <SelectTrigger className="w-full h-[40px] rounded-lg">
                        <SelectValue placeholder="Pilih anggota" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff1">Staff 1</SelectItem>
                        <SelectItem value="staff2">Staff 2</SelectItem>
                        <SelectItem value="staff3">Staff 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Fragment>
              ))}
            </div>

            {/* Button */}
            <div className="flex justify-center">
              <button className="bg-[#2B6282] text-sm text-white font-semibold leading-[26px] w-[100px] sm:w-[120px] h-[40px] rounded-xl hover:bg-sky-800 transition">
                SIMPAN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BestStaff;
