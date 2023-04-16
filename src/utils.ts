// @ts-ignore
const {ethereum} = window;
// @ts-ignore
const {ethers} = window;

const CREATEGAME_EVENT = "CreateGame_Event";
const COMPLETEGAME_EVENT = "CompleteGame_Event";

export const ethRequest = async (args: { method: any; params?: any[] | { chainId: string; }[]; }) => {
  try {
    const response = await ethereum.request(args);
    console.info(`[wallet.request]: ${args.method}:`, response);
    return response;
  } catch (error) {
    console.error(`[wallet.request]: ${args.method}:`, error);
    throw error;
  }
};

export async function connectWallet() {
  return await ethRequest({method: "eth_requestAccounts"});
}

export async function getAccounts() {
  return await ethRequest({method: "eth_accounts"});
}

export async function getBalance(account: any | { chainId: string; }) {
  const balance = await ethRequest({
    method: "eth_getBalance",
    params: [account, "latest"],
  });
  return ethers.utils.formatEther(balance);
}

export async function getChainId() {
  const chainId = await ethRequest({method: "eth_chainId"});
  return parseInt(chainId);
}

export async function switchNetwork(chainId: any) {
  return await ethRequest({
    method: "wallet_switchEthereumChain",
    params: [{chainId: toHex(chainId)}],
  });
}

// @ts-ignore
export async function addToNetwork({address, chain, rpc}) {
  if (!address) {
    await connectWallet();
  }

  const params = {
    chainId: toHex(chain.chainId), // A 0x-prefixed hexadecimal string
    chainName: chain.name,
    nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol, // 2-6 characters long
      decimals: chain.nativeCurrency.decimals,
    },
    rpcUrls: rpc ? [rpc] : chain.rpc.map((r: { url: any; }) => r?.url ?? r),
    blockExplorerUrls: [
      chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url
        ? chain.explorers[0].url
        : chain.infoURL,
    ],
  };

  const result = await ethRequest({
    method: "wallet_addEthereumChain",
    params: [params, address],
  });

  return result;
}

export const toHex = (num: { toString: (arg0: number) => string; }) => "0x" + num.toString(16);

export const shortenAddress = (address: string) => {
  const begin = address.substr(0, 4);
  const end = address.substr(address.length - 4, 4);
  return begin + "•••" + end;
};

const formatGame = (game: { id: any; gameType: any; wager: any; gamblers: any; }) => {
  const {id, gameType, wager, gamblers} = game;

  return {
    id: id.toString(),
    type: parseInt(gameType.toString()),
    player1: gamblers[0].id.toString(),
    betAmount: ethers.utils.formatEther(wager),
    player1BetNumber: gamblers[0].choice.toString(),
    isActive: gamblers.length < 2,
  };
};

export class Casino {
  #chain;
  #contract;
  #signedContract;
  #provider;

  constructor(chain: any) {
    if (!chain) throw new Error("Chain is required!");
    this.#chain = chain;
    const {address, abi} = this.#chain.contracts.Casino;
    this.#provider = new ethers.providers.Web3Provider(ethereum);
    this.#contract = new ethers.Contract(address, abi, this.#provider);
    const signer = this.#provider.getSigner();
    this.#signedContract = new ethers.Contract(address, abi, signer);
  }

  on(event: any, callback: any) {
    this.#contract.on(event, callback);
  }

  off(event: any, callback: any) {
    this.#contract.off(event, callback);
  }

  async bankrollGetBalance() {
    try {
      const balanceBigNumber = await this.#contract.bankrollGetBalance();
      return balanceBigNumber.toString();
    } catch (e) {
      console.error("[API] bankrollGetBalance", e)
      return 0;
    }
  }

  async bankrollDeposit(amount: any) {
    try {
      await this.#contract.bankrollDeposit({
        value: ethers.utils.parseEther(amount.toString()),
      });
    } catch (e) {
      console.error("[API] bankrollDeposit", e)
      return;
    }
  }

  async bankrollWithdraw() {
    try {
      await this.#contract.bankrollWithdraw();
    } catch (e) {
      console.error("[API] bankrollWithdraw", e)
      return;
    }
  }

  async bankrollTransactionRecords() {
    try {
      const records = await this.#contract.bankrollGetTransactionRecords();
      console.log('result', records);
      const result = records.map((record: { from: any; to: any; recordType: { toString: () => any; }; value: { toString: () => any; }; }) => {
        return {
          from: record.from,
          to: record.to,
          type: record.recordType.toString(),
          value: record.value.toString(),
        }
      });
      return result;
      // return balanceBigNumber.toString();
    } catch (e) {
      console.error("[API] bankrollTransactionRecords", e)
      return [];
    }
  }
}
