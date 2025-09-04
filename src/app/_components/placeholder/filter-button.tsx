import Image from 'next/image';
import React from 'react';

export const FilterButton: React.FC = () => {
  return (
    <button className="test-lg flex items-center gap-2 rounded-2xl border border-[#C4CACE] bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition-all hover:shadow-md">
      <Image
        src="/images/placeholder/profile-kegiatan-placeholder/vector.png"
        alt="filter"
        width={16}
        height={16}
      />

      <span>Filter</span>
    </button>
  );
};
