import { Search } from 'lucide-react'

export function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input
        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-slate-500"
        placeholder="Cari lembaga, kegiatan, atau mahasiswa"
        type="search"
      />
    </div>
  )
}

