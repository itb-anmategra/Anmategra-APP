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
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
];

export const years: string[] = ['2024', '2025'];
