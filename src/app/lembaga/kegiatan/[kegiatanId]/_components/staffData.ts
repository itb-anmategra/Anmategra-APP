export type Division = {
  name: string;
  candidates: string[];
};

export type Month = {
  value: string;
  label: string;
};

export const divisions: Division[] = [
  { name: 'Human Resources', candidates: ['Andi', 'Budi', 'Citra'] },
  { name: 'Finance', candidates: ['Dewi', 'Eko', 'Fajar'] },
  { name: 'Marketing', candidates: ['Gilang', 'Hana', 'Irfan'] },
  { name: 'IT', candidates: ['Joko', 'Kiki', 'Lina'] },
];

export const months: Month[] = [
  { value: 'jan', label: 'Januari' },
  { value: 'feb', label: 'Februari' },
  { value: 'mar', label: 'Maret' },
];

export const years: string[] = ['2024', '2025'];
