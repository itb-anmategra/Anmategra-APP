'use client';

import Image from 'next/image';
import PartyPopper from 'public/icons/party-popper.svg';
import { useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { api } from '~/trpc/react';
import { useQueries } from '@tanstack/react-query';

export type Division = {
  name: string;
  candidates: string[];
};

export type Month = {
  value: string;
  label: string;
};

const divisions: Division[] = [
  { name: 'Human Resources', candidates: ['Andi', 'Budi', 'Citra'] },
  { name: 'Finance', candidates: ['Dewi', 'Eko', 'Fajar'] },
  { name: 'Marketing', candidates: ['Gilang', 'Hana', 'Irfan'] },
  { name: 'IT', candidates: ['Joko', 'Kiki', 'Lina'] },
  { name: 'Human Resources', candidates: ['Andi', 'Budi', 'Citra'] },
  { name: 'Finance', candidates: ['Dewi', 'Eko', 'Fajar'] },
  { name: 'Marketing', candidates: ['Gilang', 'Hana', 'Irfan'] },
  { name: 'IT', candidates: ['Joko', 'Kiki', 'Lina'] },
  { name: 'Human Resources', candidates: ['Andi', 'Budi', 'Citra'] },
  { name: 'Finance', candidates: ['Dewi', 'Eko', 'Fajar'] },
  { name: 'Marketing', candidates: ['Gilang', 'Hana', 'Irfan'] },
  { name: 'IT', candidates: ['Joko', 'Kiki', 'Lina'] },
];

const months: Month[] = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

const years: string[] = ['2024', '2025'];

type PeriodSelectProps = {
  months: Month[];
  years: string[];
  selectTriggerBase: string;
  selectContentBase: string;
  selectItemBase: string;
  onChange: (data: {
    startMonth: string | null;
    startYear: string | null;
    endMonth: string | null;
    endYear: string | null;
  }) => void;
};

function PeriodSelect({
  months,
  years,
  selectTriggerBase,
  selectContentBase,
  selectItemBase,
  onChange,
}: PeriodSelectProps) {
  const [startMonth, setStartMonth] = useState<string | null>(null);
  const [startYear, setStartYear] = useState<string | null>(null);
  const [endMonth, setEndMonth] = useState<string | null>(null);
  const [endYear, setEndYear] = useState<string | null>(null);

  const handleChange = (
    key: 'startMonth' | 'startYear' | 'endMonth' | 'endYear',
    value: string,
  ) => {
    const newState = {
      startMonth,
      startYear,
      endMonth,
      endYear,
      [key]: value,
    };
    if (key === 'startMonth') setStartMonth(value);
    if (key === 'startYear') setStartYear(value);
    if (key === 'endMonth') setEndMonth(value);
    if (key === 'endYear') setEndYear(value);
    onChange(newState);
  };

  return (
    <div className="flex w-full gap-4 mb-2 items-center">
      <Select onValueChange={(val) => handleChange('startMonth', val)}>
        <SelectTrigger className={`${selectTriggerBase} flex-[2]`}>
          <SelectValue placeholder="Bulan" />
        </SelectTrigger>
        <SelectContent className={selectContentBase}>
          {months.map((m) => (
            <SelectItem
              key={m.value}
              value={m.value}
              className={selectItemBase}
            >
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => handleChange('startYear', val)}>
        <SelectTrigger className={`${selectTriggerBase} flex-[1]`}>
          <SelectValue placeholder="Tahun" />
        </SelectTrigger>
        <SelectContent className={selectContentBase}>
          {years.map((y) => (
            <SelectItem key={y} value={y} className={selectItemBase}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="self-center text-xs">s.d.</span>

      <Select onValueChange={(val) => handleChange('endMonth', val)}>
        <SelectTrigger className={`${selectTriggerBase} flex-[2]`}>
          <SelectValue placeholder="Bulan" />
        </SelectTrigger>
        <SelectContent className={selectContentBase}>
          {months.map((m) => (
            <SelectItem
              key={m.value}
              value={m.value}
              className={selectItemBase}
            >
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => handleChange('endYear', val)}>
        <SelectTrigger className={`${selectTriggerBase} flex-[1]`}>
          <SelectValue placeholder="Tahun" />
        </SelectTrigger>
        <SelectContent className={selectContentBase}>
          {years.map((y) => (
            <SelectItem key={y} value={y} className={selectItemBase}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

type DivisionTableProps = {
  divisions: Division[];
  onSelect: (divisionName: string, staff: string) => void;
};

function DivisionTable({ divisions, onSelect }: DivisionTableProps) {
  return (
    <div className="w-full max-w-[500px] max-h-[300px] sm:max-h-[420px] mx-auto overflow-y-auto pr-2 space-y-3">
      <div className="flex gap-12 sticky top-0 bg-white z-10 py-2 font-semibold text-sm">
        <div className="w-[120px] sm:w-[140px]">Divisi</div>
        <div className="flex-1">Best Staff</div>
      </div>

      {divisions.map((divisi, i) => (
        <div key={i} className="flex items-center gap-12">
          <div className="w-[120px] sm:w-[140px] text-sm text-[#636A6D]">
            {divisi.name}
          </div>
          <div className="flex-1">
            <Select onValueChange={(val) => onSelect(divisi.name, val)}>
              <SelectTrigger className="w-full h-[32px] rounded-xl text-sm text-[#636A6D] border border-[#C4CACE]">
                <SelectValue placeholder="Pilih anggota" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-[#C4CACE] [&_[data-radix-select-viewport]]:p-0">
                {divisi.candidates.map((staff, j) => (
                  <SelectItem
                    key={j}
                    value={staff}
                    className="py-1.5 px-3 border-b last:border-0 border-[#C4CACE] rounded-none text-xs text-[#636A6D] hover:bg-gray-100"
                  >
                    {staff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
}

type BestStaffProps = {
  trigger?: React.ReactNode;
};

const BestStaff = ({ trigger,lembagaId }: BestStaffProps) => {
  const selectTriggerBase =
    'h-[40px] rounded-lg border border-[#636A6D] [&>span]:text-[#9DA4A8] [&>span]:text-xs';
  const selectContentBase =
    'border border-[#C4CACE] [&_[data-radix-select-viewport]]:p-0';
  const selectItemBase =
    'py-2.5 px-3 border-b last:border-0 border-[#636A6D] rounded-none text-xs text-[#636A6D] hover:bg-gray-100';

  const [periode, setPeriode] = useState<{
    startMonth: string | null;
    startYear: string | null;
    endMonth: string | null;
    endYear: string | null;
  }>({
    startMonth: null,
    startYear: null,
    endMonth: null,
    endYear: null,
  });

  const [selectedStaff, setSelectedStaff] = useState<Record<string, string>>(
    {},
  );
  const [staffOptions, setStaffOptions] = useState<Record<string, string[]>>({}); 

  // Ambil divisions dari backend
  const { data: divisionData, isLoading: isLoadingDivisions } =
    api.lembaga.getAllLembagaDivision.useQuery(
      { lembaga_id: lembagaId },
      { enabled: !!lembagaId }
    );
  
  // fetch staff options per division setelah divisions tersedia
  useEffect(() => {
    if (!divisionData) return;

    divisionData.divisions.forEach((division) => {
      const query = api.lembaga.getBestStaffLembagaOptions.useQuery(
        { lembaga_id: lembagaId, division },
        { enabled: !!lembagaId }
      );
      setStaffOptions(prev => ({
        ...prev,
        [division]: query.data?.staff_options.map(s => s.name) ?? []
      }));
    });
  }, [divisionData, lembagaId]);


  const handleSubmit = () => {
    const { startMonth, startYear, endMonth, endYear } = periode;

    if ((startMonth && !startYear) || (!startMonth && startYear)) {
      alert('Bulan dan Tahun Awal harus dipilih berpasangan.');
      return;
    }

    if ((endMonth && !endYear) || (!endMonth && endYear)) {
      alert('Bulan dan Tahun Akhir harus dipilih berpasangan.');
      return;
    }

    if (!startMonth || !startYear || !endMonth || !endYear) {
      alert('Bulan & Tahun Awal serta Bulan & Tahun Akhir wajib diisi.');
      return;
    }

    const sYear = parseInt(startYear, 10);
    const eYear = parseInt(endYear, 10);
    const sMonth = parseInt(startMonth, 10);
    const eMonth = parseInt(endMonth, 10);

    if (isNaN(sYear) || isNaN(eYear) || isNaN(sMonth) || isNaN(eMonth)) {
      alert('Bulan & Tahun harus berupa angka valid.');
      return;
    }

    const startTotal = sYear * 12 + (sMonth - 1);
    const endTotal = eYear * 12 + (eMonth - 1);

    if (endTotal < startTotal) {
      alert('Periode akhir harus sama atau setelah periode awal.');
      return;
    }

    const emptyDivisi = divisions.filter((d) => !selectedStaff[d.name]?.trim());
    if (emptyDivisi.length > 0) {
      alert(
        `Masih ada divisi yang belum dipilih: ${emptyDivisi
          .map((d) => d.name)
          .join(', ')}`,
      );
      return;
    }

    // Format tanggal: YYYY-MM-01
    const start_date = `${startYear}-${startMonth.padStart(2, '0')}-01`;
    const end_date = `${endYear}-${endMonth.padStart(2, '0')}-01`;

    // Mapping division ke data staff lengkap dari backend
    const [divisionDataMapping, setDivisionDataMapping] = useState<Record<string, {name: string, user_id: string}[]>>({});

    useEffect(() => {
      if (!divisionData) return;
    
      divisionData.divisions.forEach((division) => {
        const query = api.lembaga.getBestStaffLembagaOptions.useQuery(
          { lembaga_id: lembagaId, division },
          { enabled: !!lembagaId }
        );
      
        if (query.data?.staff_options) {
          setStaffOptions((prev) => ({
            ...prev,
            [division]: query.data.staff_options.map((s) => s.name),
          }));
        
          setDivisionDataMapping((prev) => ({
            ...prev,
            [division]: query.data.staff_options,
          }));
        }
      });
    }, [divisionData, lembagaId]);


    // Mapping selectedStaff ke best_staff_list[]
    const best_staff_list = Object.entries(selectedStaff).map(
      ([division, userName]) => {
        const usersInDivision = divisionDataMapping[division] ?? []; // fallback ke array kosong
        const userObj = usersInDivision.find((s) => s.name === userName);
        return {
          user_id: userObj?.user_id ?? '', // kasih fallback string kosong kalau undefined
          division,
        };
      }
    );

    
    const payload = {
    lembaga_id: lembagaId,
    start_date,
    end_date,
    best_staff_list,
    };

    console.log('Payload submit:', payload);

    const result = {
      periode: {
        start: { month: startMonth, year: startYear },
        end: { month: endMonth, year: endYear },
      },
      staff: selectedStaff,
    };


    console.log('Data Best Staff:', result);

    // Hook untuk submit data ke backend
    const chooseBestStaffMutation = api.lembaga.chooseBestStaffLembaga.useMutation({
      onSuccess: () => {
        alert('Best Staff berhasil disimpan!');
      },
      onError: (err) => {
        console.error(err);
        alert('Terjadi kesalahan saat menyimpan Best Staff.');
      },
    });

    // Panggil mutation dengan payload
    chooseBestStaffMutation.mutate(payload);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="w-[191px] h-[50px] bg-[#00B7B7] rounded-2xl hover:bg-[#00A5A5] text-white text-[18px] font-semibold">
            Pilih Best Staff
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[724px] rounded-[20px] p-6 sm:p-10 [&>button[aria-label='Close']]:hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-[32px] font-bold">
            Pilih Best Staff
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-black">
            Periode Penilaian
          </DialogDescription>
        </DialogHeader>

        <PeriodSelect
          months={months}
          years={years}
          selectTriggerBase={selectTriggerBase}
          selectContentBase={selectContentBase}
          selectItemBase={selectItemBase}
          onChange={setPeriode}
        />

        <DivisionTable
          divisions={divisionData?.divisions.map((div) => ({
            name: div,
            candidates: staffOptions[div] ?? [],
          })) ?? []} // fallback ke array kosong kalau undefined
          onSelect={(division, staff) =>
            setSelectedStaff((prev) => ({ ...prev, [division]: staff }))
          }
        />

        <div className="flex justify-center gap-4 mt-6">
          <DialogClose asChild>
            <Button
              onClick={handleSubmit}
              className="bg-[#2B6282] text-sm text-white font-semibold leading-[26px] w-[100px] sm:w-[120px] h-[40px] rounded-xl hover:bg-[#265673] transition"
            >
              SIMPAN
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BestStaff;
