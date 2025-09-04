'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

const InboxPage = () => {
  return (
    // <main>
    //   <div className="p-6 w-full h-full">
    //     <h1 className="mb-4 text-2xl font-semibold"> Permintaan Asosiasi</h1>
    //     <Input
    //       value={searchTerm}
    //       onChange={handleSearch}
    //       placeholder="Cari nama pemohon"
    //       className="rounded-2xl bg-white placeholder:text-neutral-700 focus-visible:ring-transparent"
    //       startAdornment={
    //         <MagnifyingGlassIcon className="size-4 text-gray-500" />
    //       }
    //     />
    //     <div className="mt-5 flex justify-end">
    //       <Button variant="outline" className="font-bold">
    //         <Filter />
    //         Filter
    //       </Button>
    //     </div>
    //     <div className="mt-5">
    //       <Table>
    //         <TableHeader>
    //           <TableRow>
    //             <TableHead className="w-[50%]">Nama</TableHead>
    //             <TableHead className="w-[20%]">NIM</TableHead>
    //             <TableHead className="w-[10%]">Jurusan</TableHead>
    //             <TableHead className="w-[10%]">Request</TableHead>
    //             <TableHead className="w-[10%]"></TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           {filteredUsers.map((user) => (
    //             <TableRow key={user.id}>
    //               {/* Taro profile disini */}
    //               <TableCell className="flex w-[50%] items-center gap-5">
    //                 <div className="h-9 w-9 rounded-full bg-[#D9D9D9]"></div>
    //                 {user.name}
    //               </TableCell>
    //               <TableCell className="w-[20%]">{user.nim}</TableCell>
    //               <TableCell className="w-[10%]">{user.major}</TableCell>
    //               <TableCell className="w-[10%]">
    //                 <div className="cursor-pointer font-semibold text-[#F16350]">
    //                   DECLINE
    //                 </div>
    //               </TableCell>
    //               <TableCell className="w-[10%]">
    //                 <Button className="bg-[#29BC5B] font-semibold">
    //                   ACCEPTS
    //                 </Button>
    //               </TableCell>
    //             </TableRow>
    //           ))}
    //           {filteredUsers.length === 0 && (
    //             <TableRow>
    //               <TableCell colSpan={5} className="text-center">
    //                 No results found
    //               </TableCell>
    //             </TableRow>
    //           )}
    //         </TableBody>
    //       </Table>
    //     </div>
    //   </div>
    // </main>
    <div className="w-full h-screen bg-gray-50">
      {/* <MahasiswaSidebar /> */}

      <main className="h-full flex flex-col items-center justify-center w-full">
        <div className="relative w-full">
          <div className="absolute left-0 top-16 -translate-y-1/2 w-48 h-96 opacity-20">
            <Image
              src="/images/placeholder/coming-soon1.png"
              alt="Coming Soon decoration"
              width={192}
              height={384}
            />
          </div>
          <div className="absolute right-0 top-16 -translate-y-1/2 w-48 h-96 opacity-20">
            <Image
              src="/images/placeholder/coming-soon2.png"
              alt="Coming Soon decoration"
              width={192}
              height={384}
            />
          </div>

          <div className="text-center relative z-10">
            <h1 className="text-6xl font-bold text-[#2B6777] mb-6">
              Coming Soon
            </h1>
            <p className="text-2xl text-gray-400 mb-12">
              Kami sedang membangun sesuatu yang menarik untuk Anda
            </p>
            <Link href="/lembaga">
              <Button className="bg-[#2B6777] hover:bg-[#2B6777]/90 text-white px-8 py-6 text-lg">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InboxPage;
