// Library Import
import React from 'react'
// Components Import
import { SearchBar } from "~/app/_components/placeholder/search-bar";
import { EventHeader } from "~/app/_components/placeholder/event-header";
import { PenyelenggaraCard } from "~/app/_components/placeholder/penyelenggara-card";
import { FilterButton } from "~/app/_components/placeholder/filter-button";
import { Input } from '~/components/ui/input';
// Icons Import
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

const ProfileKegiatan = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-neutral-1000">Kegiatan</h1>
      </div>

      <div className="mb-5">
        <Input
          placeholder="Cari lembaga, kegiatan, atau mahasiswa"
          className="rounded-2xl bg-white focus-visible:ring-transparent placeholder:text-neutral-700"
          startAdornment={
            <MagnifyingGlassIcon className="size-4 text-gray-500" />
          }
        />
      </div>

      <EventHeader
        title="Nama Event"
        organizer="Nama penyelenggara"
        backgroundImage="/profile-kegiatan-placeholder/kegiatan-header-background.png"
        logoImage="/profile-kegiatan-placeholder/oskm-header.png"
      />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[28px] font-semibold text-slate-900">
          Penyelenggara
        </h2>
      </div>

      <PenyelenggaraCard
        title="Lembaga/UKM ITB"
        category="Kategori"
        logo="/profile-kegiatan-placeholder/oskm-organizer.png"
      />

      <div className="my-4 mt-6 flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-slate-900">Anggota</h2>
      </div>

      <div className="mb-4">
        <SearchBar placeholder="Cari nama anggota" />
      </div>
      <div>
        <FilterButton />
      </div>
  </div>
  )
}

export default ProfileKegiatan