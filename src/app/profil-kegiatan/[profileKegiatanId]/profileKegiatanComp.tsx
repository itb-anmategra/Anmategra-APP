"use client"

// Library Import
import React from 'react'
// Components Import
import {Input} from '~/components/ui/input';
// Icons Import
import {MagnifyingGlassIcon} from '@radix-ui/react-icons';
import Image from "next/image";
import Link from "next/link";

const ProfileKegiatanComp = (
    {
        anggota
    }: {
        anggota: {
            userId: string,
            nama: string | null,
            nim: number,
            jurusan: string,
            image: string | null
            position: string | null
            divisi: string | null
            bidang: string | null
        }[]
    }
) => {

    const [search, setSearch] = React.useState<string>('')
    const [filteredAnggota, setFilteredAnggota] = React.useState<{
        userId: string,
        nama: string | null,
        nim: number,
        jurusan: string,
        image: string | null
        position: string | null
        divisi: string | null
        bidang: string | null
    }[]>([])

    React.useEffect(() => {
        setFilteredAnggota(
            anggota.filter((item) => {
                return item.nama?.toLowerCase().includes(search.toLowerCase()) ?? false
            })
        )
    }, [search])

    return (
        <>
            <div className="">

                <div className="my-4 mt-6 flex items-center justify-between">
                    <h2 className="text-3xl font-semibold text-slate-900">Anggota</h2>
                </div>

                <div className="mb-4">
                    <Input
                        placeholder="Cari nama anggota"
                        className="rounded-2xl bg-white focus-visible:ring-transparent placeholder:text-neutral-700"
                        startAdornment={
                            <MagnifyingGlassIcon className="size-4 text-gray-500"/>
                        }
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div>
                    {filteredAnggota.length > 0 ? filteredAnggota.map((item) => (
                        <div key={item.userId}
                             className="flex items-center justify-between py-4 border-b border-neutral-200">
                            <div className="flex items-center gap-x-4">
                                <Image src={item.image ?? '/placeholder/profilepic.png'} alt="Profile Picture"
                                     className="w-12 h-12 rounded-full"
                                       width={48}
                                        height={48}
                                />
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-semibold text-slate-900">{item.nama}</h3>
                                    <p className="text-sm text-slate-600">{item.nim} - {item.jurusan}</p>
                                    <div className="flex items-center gap-x-2">
                                        <p className="text-sm text-slate-600">{item.position}</p>
                                        <p> | </p>
                                        <p className="text-sm text-slate-600">{item.divisi}</p>
                                        <p> | </p>
                                        <p className="text-sm text-slate-600">{item.bidang}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button className="text-sky-600 font-semibold">
                                    <Link href={`/profil-mahasiswa/${item.userId}`}> Lihat Profil</Link>
                                </button>
                            </div>
                        </div>
                    )) : <p className="text-slate-600">Tidak ada anggota</p>
                    }
                </div>
            </div>
        </>
    )
}

export default ProfileKegiatanComp