import Image from 'next/image';

interface StudentProfileProps {
  nama: string;
  nim: string;
  jurusan: string;
  angkatan: string;
  profileImageUrl: string;
}

export default function ProfilMahasiswa({
  nama = 'Nama Mahasiswa',
  nim = 'NIM',
  jurusan = 'Jurusan',
  angkatan = 'Angkatan',
  profileImageUrl = '/images/placeholder/profile-pic.png',
}: StudentProfileProps) {
  return (
    <div className="flex items-center justify-center gap-6 bg-white p-6">
      <div className="relative flex h-[180px] w-[180px] shrink-0">
        <Image
          alt="Profile photo"
          className="rounded-full object-cover"
          src={profileImageUrl}
          fill
          priority
        />
      </div>
      <div className="space-y-1 py-4">
        <div>
          <h2 className="text-[26px] font-semibold text-[#0F172A]">{nama}</h2>
        </div>
        <div>
          <h3 className="text-[21px] font-semibold text-[#0F172A]">{nim}</h3>
        </div>
        <div>
          <p className="text-[21px] font-medium text-[#64748B]">
            {jurusan}&apos;{angkatan}
          </p>
        </div>
      </div>
    </div>
  );
}
