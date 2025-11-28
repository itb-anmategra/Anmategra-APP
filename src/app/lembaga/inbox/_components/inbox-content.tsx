'use client';

import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import FilterDropdown, {
  type FilterOption,
} from '~/app/_components/filter/filter-dropdown';
import { Input } from '~/components/ui/input';
import search from 'public/icons/search.svg';

import RequestTableEventsEntries from './request-table-events-entries';

type PermintaanAsosiasi = {
  id: string;
  image: string | null;
  nama: string;
  jumlah: string;
  tujuan: string;
};

type InboxContentProps = {
  entries: PermintaanAsosiasi[];
};

export default function InboxContent({ entries }: InboxContentProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterOptions: FilterOption[] = useMemo(() => {
    const uniqueTujuan = Array.from(
      new Set(entries.map((item) => item.tujuan)),
    ).filter(Boolean);
    return uniqueTujuan.map((tujuan) => ({
      id: tujuan,
      label: tujuan,
      value: tujuan,
    }));
  }, [entries]);

  const handleFilterChange = useCallback((filters: string[]) => {
    setSelectedFilters(filters);
    // TODO: Implement server-side filtering when BE is ready
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <div className="flex-1 p-4 sm:p-6 lg:p-10">
        <h1 className="m-0 mb-3 text-2xl md:text-[28px] lg:text-[32px] font-semibold">
          Permintaan Asosiasi
        </h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-5 gap-4 sm:gap-[18px]">
          <div className="relative w-full sm:flex-1">
            <Input
              type="text"
              placeholder="Cari nama lembaga atau kegiatan"
              className="w-full pl-12 border border-[#C4CACE] rounded-[20px] bg-white h-11 sm:h-12 text-[16px] sm:text-[18px] text-[#636A6D]"
            />
            <Image
              src={search}
              alt="Search Icon"
              width={20}
              height={20}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
          </div>

          <div className="w-full sm:w-auto">
            <FilterDropdown
              filterTitle="Tujuan"
              filterOptions={filterOptions}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <RequestTableEventsEntries data={entries} />
        </div>
      </div>
    </div>
  );
}
