'use client';

import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import FilterDropdown, {
  type FilterOption,
} from '~/app/_components/filter/filter-dropdown';
import { Input } from '~/components/ui/input';

import RequestTableAssociationsEntries from './request-table-associations-entries';

type PermintaanAsosiasiUser = {
  id: string;
  image: string;
  nama: string;
  user_id: string;
  posisi: string;
  divisi: string;
};

type InboxDetailContentProps = {
  id: string;
  data: PermintaanAsosiasiUser[];
};

export default function InboxDetailContent({
  id,
  data,
}: InboxDetailContentProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterOptions: FilterOption[] = useMemo(() => {
    const uniqueDivisions = Array.from(
      new Set(data.map((item) => item.divisi)),
    ).filter(Boolean);
    return uniqueDivisions.map((divisi) => ({
      id: divisi,
      label: divisi,
      value: divisi,
    }));
  }, [data]);

  const handleFilterChange = useCallback((filters: string[]) => {
    setSelectedFilters(filters);
    // TODO: Implement server-side filtering when BE is ready
    console.log('Selected filters:', filters);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <div className="flex-1 p-4 sm:p-6 lg:p-10">
        <h1 className="m-0 mb-3 text-2xl md:text-[32px] font-semibold">
          Permintaan Asosiasi
        </h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-5 gap-4 sm:gap-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Cari nama pemohon"
              className="w-full pl-12 border border-[#C4CACE] rounded-[20px] bg-white h-11 sm:h-12 text-[16px] sm:text-[18px] text-[#636A6D]"
            />
            <Image
              src="/icons/search.svg"
              alt="Search Icon"
              width={20}
              height={20}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
          </div>

          <div className="w-full sm:w-auto">
            <FilterDropdown
              filterTitle="Divisi"
              filterOptions={filterOptions}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        <div>
          <RequestTableAssociationsEntries id={id} data={data} />
        </div>
      </div>
    </div>
  );
}
