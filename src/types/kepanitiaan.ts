import type { Lembaga } from "./lembaga";
export interface Kepanitiaan {
  lembaga: Lembaga;
  name: string;
  description: string;
  quota: number;
  startDate: Date;
  endDate: Date;
}
