"use client";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

// Data dummy
const usersData = [
  {
    id: 1,
    profile: "",
    name: "Jason Jahja",
    nim: "13523014",
    major: "HMIF",
  },
  {
    id: 2,
    profile: "",
    name: "Farrel Athalla",
    nim: "13523014",
    major: "HMIF",
  },
  {
    id: 3,
    profile: "",
    name: "Atqya Haydar",
    nim: "13523014",
    major: "HMIF",
  },
  {
    id: 4,
    profile: "",
    name: "Sigma",
    nim: "13523014",
    major: "HMIF",
  },
];

const InboxPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(usersData);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = usersData.filter((user) =>
      user.name.toLowerCase().includes(term),
    );
    setFilteredUsers(filtered);
  };

  return (
    <main>
      <div className="px-8 py-12">
        <h1 className="mb-3 text-3xl font-semibold"> Permintaan Asosiasi</h1>
        <Input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Cari nama pemohon"
          className="rounded-2xl bg-white placeholder:text-neutral-700 focus-visible:ring-transparent"
          startAdornment={
            <MagnifyingGlassIcon className="size-4 text-gray-500" />
          }
        />
        <div className="mt-5 flex justify-end">
          <Button variant="outline" className="font-bold">
            <Filter />
            Filter
          </Button>
        </div>
        <div className="mt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Nama</TableHead>
                <TableHead className="w-[20%]">NIM</TableHead>
                <TableHead className="w-[10%]">Jurusan</TableHead>
                <TableHead className="w-[10%]">Request</TableHead>
                <TableHead className="w-[10%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  {/* Taro profile disini */}
                  <TableCell className="flex w-[50%] items-center gap-5">
                    <div className="h-9 w-9 rounded-full bg-[#D9D9D9]"></div>
                    {user.name}
                  </TableCell>
                  <TableCell className="w-[20%]">{user.nim}</TableCell>
                  <TableCell className="w-[10%]">{user.major}</TableCell>
                  <TableCell className="w-[10%]">
                    <div className="cursor-pointer font-semibold text-[#F16350]">
                      DECLINE
                    </div>
                  </TableCell>
                  <TableCell className="w-[10%]">
                    <Button className="bg-[#29BC5B] font-semibold">
                      ACCEPTS
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
};

export default InboxPage;
