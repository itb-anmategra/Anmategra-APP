import type { Lembaga } from "./lembaga";
export interface Kepanitiaan {
  lembaga: Lembaga;
  name: string;
  description: string | null;
  quota: number;
  startDate: Date;
  endDate: Date | null;
}
