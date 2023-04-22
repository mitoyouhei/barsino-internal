export enum CategoryType {
  finance,
  gameStats,
}

export interface IBankrollRecord {
  from: string;
  to: string;
  value: string;
  type: string;
}