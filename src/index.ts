import "./scss/custom.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

import { mountApp } from "./components/Boot";
import { store } from "./store";
import { getAccounts, getChainId } from "./utils/wallet";
import {
  auth,
  clearBalance,
  selectUser,
  updateBalance,
} from "./store/slices/user";
import {
  NotificationType,
  clearNotify,
  initialize,
  newNotification,
  notify,
} from "./store/slices/app";
import { selectCasino, setChain } from "./store/slices/chain";
import { errorEventParser } from "./utils/tools";
import { setGameResult } from "./store/slices/game";
import { GameResult, getCasino } from "./utils/casino";
import { initI18next } from "./initI18next";

const { ethereum } = window;

function errorHandler(errorEvent: any) {
  // event.preventDefault(); // This will not print the error in the console });

  const { message } = errorEventParser(errorEvent);
  if (message) {
    const notification = newNotification(NotificationType.danger, message);
    store.dispatch(notify(notification));
    setTimeout(() => store.dispatch(clearNotify(notification)), 3000);
  }
}

const onComplete = async (gameId: string) => {
  const casino = selectCasino(store.getState());
  const game = await casino?.getGame(gameId);
  const user = selectUser(store.getState());
  const isEqual = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
  let imWinner = false;
  let isDraw = true;
  for (const player of game?.players ?? []) {
    if (player.isWinner) {
      isDraw = false;
      imWinner = user.authed && isEqual(player.id, user.address);
    }
  }

  const result = isDraw
    ? GameResult.draw
    : imWinner
    ? GameResult.win
    : GameResult.lose;
  store.dispatch(setGameResult({ gameId: gameId, result }));
};
async function updateChainId() {
  const preCasino = selectCasino(store.getState());

  if (preCasino !== null) {
    preCasino.offCompleteGame();
  }

  const chainId = await getChainId();
  store.dispatch(setChain(chainId));

  const casino = getCasino(chainId);
  if (casino !== null) {
    casino.onCompleteGame(onComplete);
  }
}

async function updateAuth() {
  store.dispatch(clearBalance());
  const accounts = await getAccounts();
  if (accounts.length > 0) {
    const address = accounts[0];
    store.dispatch(auth(address));
    store.dispatch(updateBalance(address));
  }
}

async function setWallet() {
  await updateChainId();
  await updateAuth();
  store.dispatch(initialize());
}

const onWalletChange = (...args: any[]) => {
  console.log(`[wallet.event] ${args[0]}:`, args);
  setWallet();
};

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

window.addEventListener("error", errorHandler);
window.addEventListener("unhandledrejection", errorHandler);

ethereum.on("connect", onWalletChange.bind(this, "connect"));
ethereum.on("disconnect", onWalletChange.bind(this, "disconnect"));
ethereum.on("accountsChanged", onWalletChange.bind(this, "accountsChanged"));
ethereum.on("chainChanged", onWalletChange.bind(this, "chainChanged"));
ethereum.on("message", onWalletChange.bind(this, "message"));

initI18next().then(setWallet);

const rootDom = document.getElementById("root");
if (rootDom !== null) mountApp(rootDom);
