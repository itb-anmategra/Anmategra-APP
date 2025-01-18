import { Home, Calendar, Users, Inbox, FileText, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Sidebar() {
  return (
    <div className="flex h-screen w-1/4 flex-col border-r bg-white">
      <div className="p-4">
        <Image
          src="/anmategra.png"
          alt="anmategra"
          width={150}
          height={40}
          priority
        />
      </div>

      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          <Link
            href="#"
            className="group flex items-center rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-900"
          >
            <Home className="mr-3 h-4 w-4" />
            Beranda
          </Link>
          <Link
            href="#"
            className="group flex items-center rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <Calendar className="mr-3 h-4 w-4" />
            Kegiatan
          </Link>
          <Link
            href="#"
            className="group flex items-center rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <Users className="mr-3 h-4 w-4" />
            Anggota
          </Link>
          <Link
            href="#"
            className="group flex items-center rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <Inbox className="mr-3 h-4 w-4" />
            Inbox
          </Link>
          <Link
            href="#"
            className="group flex items-center rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <FileText className="mr-3 h-4 w-4" />
            Laporan
          </Link>
        </div>
      </nav>

      <div className="border-t p-4">
        <div className="mb-4 flex items-center gap-3">
          <Image
            src="/placeholder/pepega.png"
            alt="anmategra"
            width={40}
            height={40}
            priority
          />
          <div>
            <p className="text-sm font-medium">PEPEGA ITB</p>
            <p className="text-xs text-slate-500">Lembaga</p>
          </div>
        </div>
        <button className="flex items-center text-sm text-red-500 hover:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}