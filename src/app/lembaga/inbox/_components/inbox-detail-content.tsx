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
      <div className="flex-1 p-10">
        <h1 className="m-0 mb-3 text-[32px] weight-600 font-semibold">
          Permintaan Asosiasi
        </h1>

        <div className="flex items-center mb-5 gap-[18px]">
          <div className="flex-1 relative align-center">
            <Input
              type="text"
              placeholder="Cari nama pemohon"
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
            filterTitle="Divisi"
            filterOptions={filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div>
          <RequestTableAssociationsEntries id={id} data={data} />
        </div>
      </div>
    </div>
  );
}
