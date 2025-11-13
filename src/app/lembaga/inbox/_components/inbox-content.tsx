'use client';

import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import FilterDropdown, {
  type FilterOption,
} from '~/app/_components/filter/filter-dropdown';
import { Input } from '~/components/ui/input';

import RequestTableEventsEntries from './request-table-events-entries';

type PermintaanAsosiasi = {
  id: string;
  image: string;
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
      <div className="flex-1 p-10">
        <h1 className="m-0 mb-3 text-[32px] weight-600 font-semibold">
          Permintaan Asosiasi
        </h1>

        <div className="flex items-center mb-5 gap-[18px]">
          <div className="flex-1 relative align-center">
            <Input
              type="text"
              placeholder="Cari nama lembaga atau kegiatan"
              className="w-full pl-[48px] border border-[#C4CACE] rounded-[20px] bg-white h-[50px] font-regular weight-400 text-[18px] text-[#636A6D]"
            />
            <Image
              src="/icons/search.svg"
              alt="Search Icon"
              width={24}
              height={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 ml-1"
            />
          </div>

          <FilterDropdown
            filterTitle="Tujuan"
            filterOptions={filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div>
          <RequestTableEventsEntries data={entries} />
        </div>
      </div>
    </div>
  );
}
