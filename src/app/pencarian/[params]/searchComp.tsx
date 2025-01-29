"use client"

// Library Import
import React, {useEffect} from 'react'
import Link from 'next/link'
// Component Import
import MahasiswaSidebar from '../../_components/MahasiswaSidebar'
import MahasiswaCard from '~/app/_components/beranda/MahasiswaCard'
import LembagaCard from '~/app/_components/beranda/LembagaCard'
import { KepanitiaanCard } from '~/app/_components/beranda/KepanitiaanCard'
// Dummy Asset Import
import dummyProfile from "public/placeholder/profilepic.png";
import dummyLembaga from "public/logo-hmif.png";
import {useSearchParams} from "next/navigation";
import { api } from "~/trpc/react";

const PencarianPage = (
    {
        session
    }: {
        session: boolean,
    }
) => {
    const searchParams = useSearchParams();
    const query = searchParams.get('params');
    const { data : SearchResults , isLoading} = api.landing.getResults.useQuery({
        query: query ?? ''
    })

    return (
        <div className='flex flex-col overflow-hidden pb-16 sm:space-y-3 md:space-y-8'>
            <div className="mb-20 fixed w-full shadow-sm z-20">
                <MahasiswaSidebar session={session} />
            </div>
            <div className='py-4' />
            <div className="flex flex-col items-center w-full">
                <div className='w-full space-y-8 max-w-7xl'>
                    <div className="space-y-2 w-full">
                        <h5 className="text-2xl font-semibold text-slate-600">
                            Mahasiswa
                        </h5>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {SearchResults?.mahasiswa.map((item) => (
                                <Link key={item.userId} href={`/profil-mahasiswa/${item.userId}`}>
                                    <MahasiswaCard
                                        nama={item.nama ?? ''}
                                        NIM={item.nim.toString()}
                                        jurusan={item.jurusan}
                                        profilePicture={item.image ?? dummyProfile}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2 w-full">
                        <h5 className="text-2xl font-semibold text-slate-600">Lembaga</h5>
                        <div className="flex w-full flex-col gap-y-4">
                            {SearchResults?.lembaga.map((item) => (
                                <Link key={item.id} href={`/profil-gitlembaga/${item.id}`}>
                                    <LembagaCard
                                        nama={item.name}
                                        kategori={item.type ?? ''}
                                        deskripsi={item.description ?? ''}
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
                            {SearchResults?.kegiatan.map((item) => (
                                <Link key={item.name} href={`/profile-kegiatan/${item.name}`}>
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