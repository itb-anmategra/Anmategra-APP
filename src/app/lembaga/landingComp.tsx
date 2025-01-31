"use client";
// Library Import
import React, { useState } from "react";
import Link from "next/link";
// Components Import
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { KepanitiaanCard } from "../_components/beranda/KepanitiaanCard";
import LembagaCard from "../_components/beranda/LembagaCard";
// Icons Import
import { ChevronRightIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
// Constants Import
import {
    SearchResultKegiatan,
    SearchResultLembaga,
    SearchResultMahasiswa,
} from "~/lib/constants";
import MahasiswaCard from "../_components/beranda/MahasiswaCard";
// Asset Import
import dummyProfile from "public/placeholder/profilepic.png";
import dummyLembaga from "public/logo-hmif.png";
import {Kepanitiaan} from "~/types/kepanitiaan";
import {Session} from "next-auth";

export default function LandingComp(
    {
        data,
        session
    }: {
        data: {
            kepanitiaanTerbaru: Kepanitiaan[];
            kegiatanTerbaru: Kepanitiaan[];
            kepanitiaanTerbesar: Kepanitiaan[];
        }
        session: Session | null
    }
) {
    const [isSearchBegin, setIsSearchBegin] = useState(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setIsSearchBegin(value.trim() !== "");
    };

    return (
        <div className="flex w-full flex-col gap-4 p-6">
            {/* Title and Search */}
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-semibold text-neutral-1000">Beranda</h1>
                <Input
                    placeholder="Cari lembaga, kegiatan, atau mahasiswa"
                    className="rounded-2xl bg-white placeholder:text-neutral-700 focus-visible:ring-transparent"
                    startAdornment={
                        <MagnifyingGlassIcon className="size-4 text-gray-500" />
                    }
                    onChange={handleSearchChange}
                />
            </div>

            {/* List of Kepanitiaan */}
            {!isSearchBegin && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-xl font-semibold">Kepanitiaan Terbaru</h2>
                        <Button variant="ghost" className="flex items-center gap-2">
                            Lihat Semua
                            <ChevronRightIcon />
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {data.kepanitiaanTerbaru.map((kepanitiaan) => (
                            <Link key={kepanitiaan.name} href={`/profile-kegiatan/${kepanitiaan.name}`}>
                                <KepanitiaanCard
                                    kepanitiaan={kepanitiaan}
                                    key={kepanitiaan.name}
                                />
                            </Link>
                        ))}
                    </div>
                    <div className="mt-10 flex items-center justify-between gap-4">
                        <h2 className="text-xl font-semibold">Event Terbaru</h2>
                        <Button variant="ghost" className="flex items-center gap-2">
                            Lihat Semua
                            <ChevronRightIcon />
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {data.kegiatanTerbaru.map((kepanitiaan) => (
                            <Link key={kepanitiaan.name} href={`/profile-kegiatan/${kepanitiaan.name}`}>
                                <KepanitiaanCard
                                    kepanitiaan={kepanitiaan}
                                    key={kepanitiaan.name}
                                />
                            </Link>
                        ))}
                    </div>
                    <div className="mt-10 flex items-center justify-between gap-4">
                        <h2 className="text-xl font-semibold">Event Terbesar</h2>
                        <Button variant="ghost" className="flex items-center gap-2">
                            Lihat Semua
                            <ChevronRightIcon />
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {data.kepanitiaanTerbaru.map((kepanitiaan) => (
                            <Link key={kepanitiaan.name} href={`/profile-kegiatan/${kepanitiaan.name}`}>
                                <KepanitiaanCard
                                    kepanitiaan={kepanitiaan}
                                    key={kepanitiaan.name}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Result */}
            {isSearchBegin && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h5 className="text-xl font-semibold text-neutral-1000">
                            Mahasiswa
                        </h5>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {SearchResultMahasiswa.map((item) => (
                                <Link key={item.id} href={`/mahasiswa/${item.name}`}>
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
                    <div className="space-y-2">
                        <h5 className="text-xl font-semibold text-neutral-1000">Lembaga</h5>
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
                    <div className="space-y-2">
                        <h5 className="text-xl font-semibold text-neutral-1000">
                            Kegiatan
                        </h5>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {SearchResultKegiatan.map((item) => (
                                <Link key={item.name} href={`/profile-kegiatan/${item.name}`}>
                                    <KepanitiaanCard kepanitiaan={item} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
