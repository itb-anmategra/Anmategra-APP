import { ChevronRightIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Kepanitiaan } from "~/types/kepanitiaan";
import { KepanitiaanCard } from "./_components/KepanitiaanCard";

export default function Home() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Beranda</h1>
        <Input
          placeholder="Cari lembaga, kegiatan, atau mahasiswa"
          className="rounded-3xl bg-white"
          startAdornment={
            <MagnifyingGlassIcon className="size-5 text-gray-500" />
          }
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Kepanitiaan Terbaru</h2>
          <Button variant="ghost" className="flex items-center gap-2">
            Lihat Semua
            <ChevronRightIcon />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {KEPANITIAAN_DATA.map((kepanitiaan) => (
            <KepanitiaanCard kepanitiaan={kepanitiaan} key={kepanitiaan.name} />
          ))}
        </div>
      </div>
    </div>
  );
}

const KEPANITIAAN_DATA: Kepanitiaan[] = [
  {
    lembaga: {
      name: "HMIF ITB",
      profilePicture: "/logo-hmif.png",
    },
    name: "Wisokto HMIF 2024",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    quota: 50,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "Anmategra ITB",
      profilePicture: "/logo-anmategra.png",
    },
    name: "Anmategra ITB 2024",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do euismod tempor.",
    quota: 15,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "Ganesha ITB",
      profilePicture: "/logo-hmif.png",
    },
    name: "Ganesha Project 2024",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
    quota: 30,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "Senapati ITB",
      profilePicture: "/logo-anmategra.png",
    },
    name: "Senapati Cup 2024",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    quota: 25,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "Himatika ITB",
      profilePicture: "/logo-hmif.png",
    },
    name: "Math Fun Day 2024",
    description:
      "Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.",
    quota: 40,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "ComLabs ITB",
      profilePicture: "/logo-anmategra.png",
    },
    name: "ComLabs Bootcamp 2024",
    description: "Cupidatat non proident, sunt in culpa qui officia deserunt.",
    quota: 20,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "KM ITB",
      profilePicture: "/logo-hmif.png",
    },
    name: "KM Leadership 2024",
    description: "Mollit anim id est laborum. Lorem ipsum dolor sit amet.",
    quota: 35,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "HMT ITB",
      profilePicture: "/logo-anmategra.png",
    },
    name: "HMT Workshop 2024",
    description: "Adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    quota: 10,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "HME ITB",
      profilePicture: "/logo-hmif.png",
    },
    name: "Electro Meet 2024",
    description: "Nisi ut aliquip ex ea commodo consequat. Duis aute irure.",
    quota: 50,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "HMTF ITB",
      profilePicture: "/logo-anmategra.png",
    },
    name: "Chemical Engineering Expo 2024",
    description:
      "Velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint.",
    quota: 60,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "HMP ITB",
      profilePicture: "/logo-hmif.png",
    },
    name: "Pharmaceutical Day 2024",
    description:
      "Non proident, sunt in culpa qui officia deserunt mollit anim.",
    quota: 25,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "PSM ITB",
      profilePicture: "/logo-anmategra.png",
    },
    name: "PSM Choir Concert 2024",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    quota: 20,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "KMK ITB",
      profilePicture: "/logo-hmif.png",
    },
    name: "Spiritual Retreat 2024",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    quota: 15,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "U-Green ITB",
      profilePicture: "/logo-anmategra.png",
    },
    name: "Environmental Awareness 2024",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    quota: 30,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "HMPPI ITB",
      profilePicture: "/logo-hmif.png",
    },
    name: "Geoscience Summit 2024",
    description:
      "Reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
    quota: 45,
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    lembaga: {
      name: "HIMAFI ITB",
      profilePicture: "/logo-anmategra.png",
    },
    name: "Physics Fair 2024",
    description: "Pariatur. Excepteur sint occaecat cupidatat non proident.",
    quota: 40,
    startDate: new Date(),
    endDate: new Date(),
  },
];
