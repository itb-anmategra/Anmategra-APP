import Image from "next/image";

import Plus from "~/../public/icons/plus.svg";
import SearchIcon from "~/../public/icons/search.svg"; // Import the magnifying glass icon
import {Button} from "~/components/ui/button";
import {Input} from "~/components/ui/input";
import {MahasiswaCardTable, Member} from "~/app/lembaga/anggota-kegiatan/_components/MahasiswaCardTable";
import {Session} from "next-auth";

export default function AnggotaComp(
    {
        session,
        data
    }: {
        session: Session | null,
        data: Member[]
    }
) {

    return (
        <main className="flex flex-row bg-[#FAFAFA] w-full p-6">
            {/* Content */}
            <div className="flex-1 space-y-8">
                {/* Search Bar */}
                <div className="w-full">
                    <p className="text-2xl mb-4 font-semibold">Anggota</p>
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
                        <Button
                            className="bg-[#00B7B7] text-white rounded-[16px] px-4 py-2 shadow-none flex items-center gap-2">
                            <Image src={Plus} alt="plus" width={16} height={16}/>
                            Tambah Anggota Baru
                        </Button>
                    </div>

                    {/* List Anggota Section */}
                    <div className="mt-6">
                        {/* Integrate MahasiswaCardTable here */}
                        <MahasiswaCardTable data={[]}/>
                    </div>
                </div>
            </div>
        </main>
    );
}
