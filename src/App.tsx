import React, {useEffect, useReducer} from 'react';
import './App.css';
import {RouterProvider} from "react-router-dom";
import {router} from "./router";
import {initialWallet, WALLET_ACTION_TYPES, WalletContext, walletReducer} from './contexts/WalletContext';
import {getAccounts, getBalance, getChainId} from "./utils";
// @ts-ignore
const { ethereum } = window;

function useInitializeApp() {
  const [wallet, walletDispatch] = useReducer(walletReducer, initialWallet);
  // const [notification, notificationDispatch] = useReducer(
  //   notificationReducer,
  //   initialNotification
  // );

  useEffect(() => {
    // Global error handler
    // function errorHandler(errorEvent) {
    //   // event.preventDefault(); // This will not print the error in the console });
    //
    //   const { message } = errorEventParser(errorEvent);
    //   if (message) {
    //     const notification = createNotification(
    //       NotificationType.danger,
    //       message
    //     );
    //     notificationDispatch({
    //       type: NOTIFICATION_ACTION_TYPES.ADD_NOTIFICATION,
    //       notification,
    //     });
    //     setTimeout(() => {
    //       notificationDispatch({
    //         type: NOTIFICATION_ACTION_TYPES.REMOVE_NOTIFICATION,
    //         id: notification.id,
    //       });
    //     }, 3000);
    //   }
    // }
    // Add listener on all possible error event
    // TODO: https://reactjs.org/docs/error-boundaries.html
    // window.addEventListener("error", errorHandler);
    // window.addEventListener("unhandledrejection", errorHandler);

    // Fetch and dispatch necessary wallet information
    async function dispatchUpdatedWallet() {
      const chainId = await getChainId();
      const accounts = await getAccounts();
      const balance = {};
      if (accounts.length > 0) {
        const defaultAccount = accounts[0];
        // @ts-ignore
        balance[defaultAccount] = await getBalance(defaultAccount);
      }

      walletDispatch({
        type: WALLET_ACTION_TYPES.UPDATE_WALLET,
        wallet: { accounts, balance, chainId, initialized: true },
      });
    }
    // Initialize necessary wallet information
    dispatchUpdatedWallet();
    function onConnect(connectInfo: any) {
      console.log("[wallet.event] connect. ConnectInfo:", connectInfo);
      dispatchUpdatedWallet();
    }
    function onDisconnect(error: any) {
      console.log("[wallet.event] disconnect. ProviderRpcError:", error);
      dispatchUpdatedWallet();
    }
    function onAccountsChanged(accounts: any) {
      console.log("[wallet.event] accountsChanged. accounts:", accounts);
      dispatchUpdatedWallet();
    }
    function onChainChanged(chainId: any) {
      console.log("[wallet.event] chainChanged. chainId:", chainId);
      dispatchUpdatedWallet();
    }
    function onMessage(message: any) {
      console.log("[wallet.event] message. ProviderMessage:", message);
      dispatchUpdatedWallet();
    }

    ethereum.on("connect", onConnect);
    ethereum.on("disconnect", onDisconnect);
    ethereum.on("accountsChanged", onAccountsChanged);
    ethereum.on("chainChanged", onChainChanged);
    ethereum.on("message", onMessage);

    // eventEmitter.on(Events.CREATE_GAME, dispatchUpdatedWallet);
    // eventEmitter.on(Events.COMPLETE_GAME, dispatchUpdatedWallet);
    return () => {
      // window.removeEventListener("error", errorHandler);
      // window.removeEventListener("unhandledrejection", errorHandler);

      ethereum.removeListener("connect", onConnect);
      ethereum.removeListener("disconnect", onDisconnect);
      ethereum.removeListener("accountsChanged", onAccountsChanged);
      ethereum.removeListener("chainChanged", onChainChanged);
      ethereum.removeListener("message", onMessage);

      // eventEmitter.removeListener(Events.CREATE_GAME, dispatchUpdatedWallet);
      // eventEmitter.removeListener(Events.COMPLETE_GAME, dispatchUpdatedWallet);
    };
  }, []);
  return { wallet, walletDispatch };
}

function App() {
  const { wallet } = useInitializeApp();
  // if (!wallet.initialized) return null;
  return (
    <div className="App">
      <WalletContext.Provider value={wallet}>
        <RouterProvider router={router}/>
      </WalletContext.Provider>
    </div>
  );
}

export default App;
