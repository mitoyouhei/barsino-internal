import React, {useContext} from "react";
import {Outlet} from "react-router-dom";
import Topbar from "./Topbar";
import {WalletContext} from "../contexts/WalletContext";

const Layout = React.memo(() => {
  const { chain } = useContext(WalletContext);

  return (
    <>
      <Topbar/>
      {/* @ts-ignore */}
      <div className="container-fluid mt-3" key={chain?.info?.chainId}>
        <div className="row">
          <div className="col-2">
            {/*<GameList />*/}
            <div> Contract List </div>
          </div>
          <div className="col-10">
            <div className="App container">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  )
});

export default Layout;