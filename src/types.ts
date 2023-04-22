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

export interface GameStatsItem {
  id: string,
  wager: string,
  gameType: string,
}

export enum GameTypeFromAPI {
  dice = 1,
  rps = 2,
}