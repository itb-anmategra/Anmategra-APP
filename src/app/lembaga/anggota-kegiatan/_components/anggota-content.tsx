"use client"
// Library Import
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
// Auth Import
import {type Session} from "next-auth";
// Components Import
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import {MahasiswaCardTable, type Member} from "~/app/lembaga/anggota-kegiatan/_components/table/mahasiswa-card-table";
import {Button} from "~/components/ui/button";
import {Input} from "~/components/ui/input";
// Icon Import
import Plus from "~/../public/icons/plus.svg";
import SearchIcon from "~/../public/icons/search.svg"; // Import the magnifying glass icon
import TambahAnggotaForm, {type comboboxDataType} from "~/app/_components/form/anggota-kegiatan/tambah-anggota-form";
import TambahAnggotaKegiatanForm from "~/app/_components/form/anggota-kegiatan/tambah-anggota-kegiatan-form";
import {MahasiswaKegiatanCardTable} from "~/app/lembaga/anggota-kegiatan/_components/table/mahasiswa-kegiatan-card-table";

  

export default function AnggotaComp(
    {
        session,
        data,
        dataAddAnggota
    }: {
        session: Session | null,
        data: Member[],
        dataAddAnggota: {
            mahasiswa: comboboxDataType[],
            posisi: comboboxDataType[],
            bidang: comboboxDataType[],
        }
    }
) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const isAnggota = pathname === "/lembaga/anggota-kegiatan"
    let tableData;
    if (!isAnggota) {
        tableData = data.map((member) => {
            return {
                ...member,
                event_id: pathname.split("/")[3]
            }
        })
    }
    return (
        <main className="flex flex-row bg-[#FAFAFA] w-full p-6">
            {/* Content */}
            <div className="flex-1 space-y-4">
                {/* Search Bar */}
                <div className="w-full">
                    <p className="text-2xl mb-4 font-semibold">
                        {isAnggota ? (
                            <span>Anggota</span>
                        ):(
                            <span>Anggota Kegiatan</span>
                        )}
                    </p>
                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative w-full">
                            <Image
                                src={SearchIcon}
                                alt="Search"
                                width={20}
                                height={20}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <Input
                                className="rounded-[24px] pl-12 pr-4 border-[1px] border-neutral-400 w-full"
                                placeholder="Cari nama anggota"
                            />
                        </div>
                    </div>
                </div>

                {/* List Anggota */}
                <div>
                    {/* Button Section */}
                    <div className="flex justify-between">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#00B7B7] hover:bg-[#00B7B7]/75 text-white rounded-[16px] px-4 shadow-none flex items-center gap-2">
                                <Image src={Plus} alt="Tambah Anggota" width={24} height={24} />
                                Tambah Anggota Baru
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tambah Anggota</DialogTitle>
                            </DialogHeader>
                            {isAnggota ? (
                                <TambahAnggotaForm session={session} data={dataAddAnggota} setIsOpen={setIsOpen} />
                            ):(
                                <TambahAnggotaKegiatanForm session={session} data={dataAddAnggota} setIsOpen={setIsOpen} pathname={pathname} />
                            )}
                        </DialogContent>
                    </Dialog>
                    </div>

                    {/* List Anggota Section */}
                    <div className="mt-6">
                        {/* Integrate MahasiswaCardTable here */}
                        {isAnggota ? (
                            <MahasiswaCardTable data={data}/>
                        ):(
                            <MahasiswaKegiatanCardTable data={tableData}/>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
