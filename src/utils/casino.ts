import {BigNumberish, ethers, utils} from "ethers";
import {ChainConfig, chains} from "./chains";
import {Casino as CasinoContract, Casino__factory} from "./contracts";
import {DisplayInfoStructOutput} from "./contracts/Casino";
import {GameStatsItem, IBankrollRecord} from "../types";

const { ethereum } = window;

enum CasinoEvent {
  CompleteGame_Event = "CompleteGame_Event",
  CreateGame_Event = "CreateGame_Event",
}

enum RawChainGameType {
  dice = 1,
  rps = 2,
}
export enum GameType {
  dice,
  rps,
}
export enum GameResult {
  win,
  lose,
  draw,
}

export interface GameChoice {
  [choice: string]: number;
}

export const DiceChoice: GameChoice = {
  small: 1,
  big: 6,
};
export const RpsChoice: GameChoice = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

interface Player {
  id: string;
  choice: bigint;
  isWinner: boolean;
}

export type Game = {
  id: string;
  type: GameType;
  players: Player[];
};

const bankRollRecordTypeTextMap = {
  '1': 'game income',
  '2': 'game payout',
  '3': 'owner withdraw',
  '4': 'owner deposit',
}

export const getGameChioce = (gameType: GameType): GameChoice => {
  switch (gameType) {
    case GameType.dice:
      return DiceChoice;
    case GameType.rps:
      return RpsChoice;
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};
export const getGameNameKey = (gameType: GameType): string => {
  switch (gameType) {
    case GameType.dice:
      return "game.dice.name";
    case GameType.rps:
      return "game.rps.name";
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};
export function parseGameType(gameTypeKey: string): GameType {
  switch (gameTypeKey) {
    case GameType[GameType.dice]:
      return GameType.dice;
    case GameType[GameType.rps]:
      return GameType.rps;
    default:
      throw new Error(`Invalid game type: ${gameTypeKey}`);
  }
}
const getGameType = (rawGameType: bigint): GameType => {
  const parseedRawGameType: RawChainGameType = parseInt(rawGameType.toString());
  switch (parseedRawGameType) {
    case RawChainGameType.dice:
      return GameType.dice;
    case RawChainGameType.rps:
      return GameType.rps;
    default:
      throw new Error(`Unknow raw game type: ${rawGameType}`);
  }
};
const getRawGameType = (gameType: GameType): RawChainGameType => {
  switch (gameType) {
    case GameType.dice:
      return RawChainGameType.dice;
    case GameType.rps:
      return RawChainGameType.rps;
    default:
      throw new Error(`Unknow game type: ${gameType}`);
  }
};

export const formatGame = (rawChainGame: DisplayInfoStructOutput): Game => {
  const { id, gameType } = rawChainGame;

  const players = rawChainGame.gamblers.map((gambler) => ({
    id: gambler.id,
    choice: gambler.choice.toBigInt(),
    isWinner: gambler.isWinner,
  }));

  const game: Game = {
    id,
    type: getGameType(gameType.toBigInt()),
    players,
  };
  return game;
};

const isEqual = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const winnerIsHost = (game: DisplayInfoStructOutput) => {
  const winner = game.gamblers.find((gambler => gambler.isWinner));
  return isEqual(winner!.id, '0x0000000000000000000000000000000000000000');
};

const isFinishedGame = (game: DisplayInfoStructOutput) => !game.isActive;
const convertGameStatsItem = (game: DisplayInfoStructOutput): GameStatsItem => ({
  id: game.id,
  gameType: game.gameType.toString(),
  wager: utils.formatEther(game.wager)
});

class Casino {
  private chainId: number;
  private chainConfig: ChainConfig;
  private provider: ethers.providers.Web3Provider;
  private contract: CasinoContract;
  private signedContract: CasinoContract;
  private completeListener:
    | ((gameId: string, winner: string) => void)
    | undefined;

  constructor(chainId: number) {
    this.chainId = chainId;
    this.chainConfig = chains[this.chainId];
    if (!this.chainConfig === undefined) throw new Error("Invalid chain!");
    const { address } = this.chainConfig.contracts.Casino;
    this.provider = new ethers.providers.Web3Provider(ethereum);
    this.contract = Casino__factory.connect(address, this.provider);
    this.signedContract = Casino__factory.connect(
      address,
      this.provider.getSigner()
    );
  }

  onCompleteGame(callback: (gameId: string, winner: string) => void) {
    if (this.completeListener !== undefined) return;
    this.completeListener = callback;
    this.contract.on(CasinoEvent.CompleteGame_Event, this.completeListener);
  }
  offCompleteGame() {
    if (this.completeListener === undefined) return;
    this.contract.off(CasinoEvent.CompleteGame_Event, this.completeListener);
    this.completeListener = undefined;
  }
  async getGame(gameId: string): Promise<Game> {
    const game = await this.contract.getGame(gameId);
    return formatGame(game);
  }

  async playGameWithDefaultHost(
    amount: string,
    gameType: GameType,
    choice: number
  ) {
    const type = getRawGameType(gameType);
    const value = utils.parseEther(amount);

    const response = await this.signedContract.playGameWithDefaultHost(
      type,
      choice,
      {
        value,
      }
    );
    const receipt = await response.wait();
    if (receipt === null) throw new Error("Receipt is null");

    for (const event of receipt.events ?? []) {
      const eventName = event.event;
      if (eventName === CasinoEvent.CreateGame_Event) {
        const game = event.args?.game;
        if (game) return formatGame(game);
      }
    }
    throw new Error("Create game event not found");
  }

  async bankrollGetBalance(): Promise<string> {
    const result = await this.signedContract.bankrollGetBalance();
    return utils.formatEther(result);
  }

  async bankrollTransactionRecords(): Promise<IBankrollRecord[]> {
    const records = await this.signedContract.bankrollGetTransactionRecords();
    const result = records.map((record: { from: any; to: any; recordType: { toString: () => any; }; value: BigNumberish; }) => {
      return {
        from: record.from,
        to: record.to,
        // @ts-ignore
        type: bankRollRecordTypeTextMap[record.recordType.toString()],
        value: utils.formatEther(record.value),
      }
    });
    return result;
  }
  async bankrollWithdraw(){
    return await this.signedContract.bankrollWithdraw();
  }
  async bankrollDeposit(amount: string){
    const value = utils.parseEther(amount);
    return await this.signedContract.bankrollDeposit({value});
  }

  async getGames(): Promise<{ winGames: GameStatsItem[], loseGames: GameStatsItem[] }> {
    const games = await this.contract.getGames();
    let winGames: GameStatsItem[] = [];
    let loseGames: GameStatsItem[] = [];

    games
      .filter(isFinishedGame)
      .forEach((game) => {
        if (winnerIsHost(game)) {
          winGames.push(convertGameStatsItem(game));
        } else {
          loseGames.push(convertGameStatsItem(game));
        }
      })
    return {
      winGames, loseGames
    }
  }
}

export const getCasino = (function () {
  const casinoCache: { [chainId: number]: Casino } = {};
  return (chainId: number | null | undefined) => {
    if (!chainId) return null;
    if (!casinoCache[chainId]) casinoCache[chainId] = new Casino(chainId);
    return casinoCache[chainId];
  };
})();
