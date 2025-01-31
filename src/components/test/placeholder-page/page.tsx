import { Sidebar } from "~/app/_components/placeholder/sidebar";
import { SearchBar } from "~/app/_components/placeholder/search-bar";
import { EventCard } from "~/app/_components/placeholder/event-card";

import ProfilMahasiswa from "../../../app/_components/beranda/profilMahasiswa";

import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const events = [
    {
      title: "Wisokto Rick Astley 2024",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      dateRange: "Juli 2024 - Oktober 2024",
      participants: 50,
      imageUrl: "/placeholder/rick1.jpg",
    },
    {
      title: "Kaderisasi Rick Astley",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      dateRange: "Juli 2024 - Oktober 2024",
      participants: 50,
      imageUrl: "/placeholder/rick2.jpg",
    },
    {
      title: "more Rick Astley",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      dateRange: "Juli 2024 - Oktober 2024",
      participants: 50,
      imageUrl: "/placeholder/rick3.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="pl-[240px]">
        <main className="p-8">
          <div className="mb-8">
            <h1 className="mb-1 text-2xl font-semibold text-slate-900">
              Beranda
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="#" className="hover:text-slate-700">
                Beranda
              </Link>
              <span>/</span>
              <Link href="#" className="hover:text-slate-700">
                Mahasiswa
              </Link>
            </div>
          </div>

          <SearchBar />

          <ProfilMahasiswa />

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Kepanitiaan Terbaru
            </h2>
            <Link
              href="#"
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
