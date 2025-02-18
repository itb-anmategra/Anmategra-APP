import type { Lembaga } from "./lembaga";
export interface Kepanitiaan {
  lembaga: Lembaga;
  id?: string;
  name: string;
  image: string | null;
  description: string | null;
  quota: number;
  startDate: Date;
  endDate: Date | null;
  position?: string;
  division?: string;
}
