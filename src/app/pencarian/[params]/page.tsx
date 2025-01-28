// Library Import
import React from 'react'
import Link from 'next/link'
// Component Import
import MahasiswaSidebar from '../../_components/MahasiswaSidebar'
import MahasiswaCard from '~/app/_components/beranda/MahasiswaCard'
import LembagaCard from '~/app/_components/beranda/LembagaCard'
import { KepanitiaanCard } from '~/app/_components/beranda/KepanitiaanCard'
// Dummy Constants Import
import { SearchResultKegiatan, SearchResultLembaga, SearchResultMahasiswa } from '~/lib/constants'
// Dummy Asset Import
import dummyProfile from "public/placeholder/profilepic.png";
import dummyLembaga from "public/logo-hmif.png";

const PencarianPage = () => {
  return (
    <div className='flex flex-col overflow-hidden pb-16 sm:space-y-3 md:space-y-8'>
      <div className="mb-20 fixed w-full shadow-sm z-20">
        <MahasiswaSidebar />
      </div>
      <div className='py-4' />
      <div className="flex flex-col items-center w-full">
        <div className='w-full space-y-8 max-w-7xl'>
          <div className="space-y-2 w-full">
            <h5 className="text-2xl font-semibold text-slate-600">
              Mahasiswa
            </h5>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SearchResultMahasiswa.map((item) => (
                <Link href={`/mahasiswa/${item.name}`}>
                  <MahasiswaCard
                    key={item.id}
                    nama={item.name}
                    NIM={item.NIM}
                    jurusan={item.Jurusan}
                    profilePicture={dummyProfile}
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-2 w-full">
            <h5 className="text-2xl font-semibold text-slate-600">Lembaga</h5>
            <div className="flex w-full flex-col gap-y-4">
              {SearchResultLembaga.map((item) => (
                <Link key={item.id} href={`/lembaga/${item.id}`}>
                  <LembagaCard
                    nama={item.nama}
                    kategori={item.kategori}
                    deskripsi={item.deskripsi}
                    lembagaPicture={dummyLembaga}
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-2 w-full">
            <h5 className="text-2xl font-semibold text-slate-600">
              Kegiatan
            </h5>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {SearchResultKegiatan.map((item) => (
                <Link href={`/profile-kegiatan/${item.name}`}>
                  <KepanitiaanCard kepanitiaan={item} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PencarianPage