'use client';

import { skipToken } from '@tanstack/query-core';
import React, { useEffect, useState } from 'react';
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
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';

export type Division = {
  name: string;
  candidates: string[];
};

export type Month = {
  value: string;
  label: string;
};

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

function generateYears(startYear: number, endYear: number): string[] {
  const years: string[] = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year.toString());
  }
  return years;
}

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
    <div className="flex w-full gap-4 mb-4 items-center">
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

      <span className="self-center text-sm">s.d.</span>

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
    <div className="w-full max-w-[600px] max-h-[300px] sm:max-h-[420px] mx-auto overflow-y-auto p-1 space-y-3">
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
              <SelectTrigger className="w-full h-[36px] rounded-xl text-sm text-[#636A6D] border border-[#C4CACE]">
                <SelectValue placeholder="Pilih anggota" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-[#C4CACE]">
                {divisi.candidates.map((staff, j) => (
                  <SelectItem
                    key={j}
                    value={staff}
                    className="py-2 px-3 text-sm text-[#636A6D] hover:bg-gray-100"
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
  lembagaId?: string;
  eventId?: string;
};

const BestStaff = ({ trigger, lembagaId, eventId }: BestStaffProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
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

  const { data: eventData } = api.event.getByID.useQuery(
    eventId ? { id: eventId } : skipToken,
    { enabled: !!eventId },
  );

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();

    if (eventId && eventData) {
      const startYear = new Date(eventData.start_date).getFullYear();
      const endYear = eventData.end_date
        ? new Date(eventData.end_date).getFullYear()
        : currentYear;
      return generateYears(startYear, endYear);
    }

    // For lembaga: 2015 to current year
    return generateYears(2020, currentYear);
  }, [eventId, eventData]);

  const chooseBestStaffLembagaMutation =
    api.lembaga.chooseBestStaffLembaga.useMutation({
      onSuccess: () => {
        toast({
          variant: 'default',
          title: '✓ Berhasil!',
          description: 'Best Staff berhasil disimpan.',
        });
        setIsOpen(false);
      },
      onError: (err) => {
        console.error(err);
        toast({
          variant: 'destructive',
          title: 'Gagal menyimpan',
          description: 'Terjadi kesalahan saat menyimpan Best Staff.',
        });
      },
    });

  const chooseBestStaffKegiatanMutation =
    api.lembaga.chooseBestStaffKegiatan.useMutation({
      onSuccess: () => {
        toast({
          variant: 'default',
          title: '✓ Berhasil!',
          description: 'Best Staff berhasil disimpan.',
        });
        setIsOpen(false);
      },
      onError: (err) => {
        console.error(err);
        toast({
          variant: 'destructive',
          title: 'Gagal menyimpan',
          description: 'Terjadi kesalahan saat menyimpan Best Staff.',
        });
      },
    });

  const [selectedStaff, setSelectedStaff] = useState<Record<string, string>>(
    {},
  );
  const [staffOptions, setStaffOptions] = useState<Record<string, string[]>>(
    {},
  );
  const [divisionDataMapping, setDivisionDataMapping] = useState<
    Record<string, { name: string; user_id: string }[]>
  >({});

  // Ambil divisions dari backend
  const { data: divisionData } = eventId
    ? api.lembaga.getAllKegiatanDivision.useQuery(
        { event_id: eventId },
        { enabled: !!eventId },
      )
    : api.lembaga.getAllLembagaDivision.useQuery(
        lembagaId ? { lembaga_id: lembagaId } : skipToken,
        { enabled: !!lembagaId },
      );

  // Fetch all anggota once and group by division, then build staff options
  const { data: anggotaData } = eventId
    ? api.event.getAllAnggota.useQuery(
        { event_id: eventId },
        { enabled: !!eventId },
      )
    : api.lembaga.getAllAnggota.useQuery(
        lembagaId ? { lembagaId: lembagaId } : skipToken,
        { enabled: !!lembagaId },
      );

  useEffect(() => {
    if (!anggotaData) return;

    const fullMap: Record<string, { user_id: string; name: string }[]> = {};
    for (const a of anggotaData) {
      const div = a.divisi ?? 'Umum';
      if (!fullMap[div]) fullMap[div] = [];
      fullMap[div].push({ user_id: a.id, name: a.nama });
    }

    const optionsMap: Record<string, string[]> = {};
    for (const k of Object.keys(fullMap)) {
      const list = fullMap[k] ?? [];
      optionsMap[k] = list.map((u) => u.name);
    }

    setStaffOptions((prev) => ({ ...prev, ...optionsMap }));
    setDivisionDataMapping((prev) => ({ ...prev, ...fullMap }));
  }, [anggotaData]);

  const handleSubmit = () => {
    const { startMonth, startYear, endMonth, endYear } = periode;

    if ((startMonth && !startYear) || (!startMonth && startYear)) {
      toast({
        variant: 'destructive',
        title: 'Periode tidak lengkap',
        description: 'Bulan dan Tahun Awal harus dipilih berpasangan.',
      });
      return;
    }

    if ((endMonth && !endYear) || (!endMonth && endYear)) {
      toast({
        variant: 'destructive',
        title: 'Periode tidak lengkap',
        description: 'Bulan dan Tahun Akhir harus dipilih berpasangan.',
      });
      return;
    }

    if (!startMonth || !startYear || !endMonth || !endYear) {
      toast({
        variant: 'destructive',
        title: 'Data belum lengkap',
        description:
          'Bulan & Tahun Awal serta Bulan & Tahun Akhir wajib diisi.',
      });
      return;
    }

    const sYear = parseInt(startYear, 10);
    const eYear = parseInt(endYear, 10);
    const sMonth = parseInt(startMonth, 10);
    const eMonth = parseInt(endMonth, 10);

    if (isNaN(sYear) || isNaN(eYear) || isNaN(sMonth) || isNaN(eMonth)) {
      toast({
        variant: 'destructive',
        title: 'Format tidak valid',
        description: 'Bulan & Tahun harus berupa angka valid.',
      });
      return;
    }

    const startTotal = sYear * 12 + (sMonth - 1);
    const endTotal = eYear * 12 + (eMonth - 1);

    if (endTotal < startTotal) {
      toast({
        variant: 'destructive',
        title: 'Periode tidak valid',
        description: 'Periode akhir harus sama atau setelah periode awal.',
      });
      return;
    }

    const emptyDivisi = (divisionData?.divisions ?? []).filter(
      (d) => !selectedStaff[d]?.trim(),
    );
    if (emptyDivisi.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Pilihan belum lengkap',
        description: `Masih ada divisi yang belum dipilih: ${emptyDivisi.join(', ')}`,
      });
      return;
    }

    // Format tanggal: YYYY-MM-01
    const start_date = new Date(sYear, sMonth - 1, 1).toISOString();
    const end_date = new Date(eYear, eMonth - 1, 1).toISOString();

    // divisionDataMapping is populated by the top-level anggota query effect

    // Mapping selectedStaff ke best_staff_list[]
    const best_staff_list = Object.entries(selectedStaff).map(
      ([division, userName]) => {
        const usersInDivision = divisionDataMapping[division] ?? []; // fallback ke array kosong
        const userObj = usersInDivision.find((s) => s.name === userName);
        return {
          user_id: userObj?.user_id ?? '', // kasih fallback string kosong kalau undefined
          division,
        };
      },
    );

    if (eventId) {
      // Event context
      const payload = {
        event_id: eventId,
        start_date,
        end_date,
        best_staff_list,
      };
      console.log('Payload submit (Kegiatan):', payload);
      chooseBestStaffKegiatanMutation.mutate(payload);
    } else if (lembagaId) {
      // Lembaga context
      const payload = {
        lembaga_id: lembagaId,
        start_date,
        end_date,
        best_staff_list,
      };
      console.log('Payload submit (Lembaga):', payload);
      chooseBestStaffLembagaMutation.mutate(payload);
    } else {
      toast({
        variant: 'destructive',
        title: 'Kesalahan sistem',
        description: 'ID lembaga atau kegiatan tidak ditemukan.',
      });
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <DialogDescription className="text-sm font-medium text-[#636A6D]">
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
          divisions={
            divisionData?.divisions.map((div) => ({
              name: div,
              candidates: staffOptions[div] ?? [],
            })) ?? []
          } // fallback ke array kosong kalau undefined
          onSelect={(division, staff) =>
            setSelectedStaff((prev) => ({ ...prev, [division]: staff }))
          }
        />

        <div className="flex justify-center gap-4 mt-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-[#636A6D] text-[#636A6D] w-[100px] sm:w-[120px] h-[40px] rounded-xl"
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            className="bg-[#00B7B7] text-white font-semibold w-[100px] sm:w-[120px] h-[40px] rounded-xl hover:bg-[#00A5A5]"
          >
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BestStaff;
