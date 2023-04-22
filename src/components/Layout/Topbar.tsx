import {Link, matchPath} from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../../hooks";
import { selectUser } from "../../store/slices/user";
import { connectWallet } from "../../utils/wallet";
import { Address } from "./Address";
import { selectChain } from "../../store/slices/chain";
import { CategoryIcon } from "../share/CategoryIcon";
import {CategoryType} from "../../types";

export function Topbar() {
  const match = matchPath({path: "play/:categoryKey"}, window.location.pathname);
  const categoryKey = match?.params.categoryKey;

  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const chain = useAppSelector(selectChain);
  const supportChain = chain.id !== null && chain.support;

  const accountInfo = user.authed ? (
    <>
      {user.balance !== undefined ? (
        <div className="navbar-text me-3" title={user.balance}>
          <i className="bi bi-wallet-fill me-2"></i>
          <span className="text-primary">
            {parseFloat(user.balance).toFixed(4)}
          </span>
        </div>
      ) : null}
      <div className="navbar-text me-3" title={user.address}>
        <i className="bi bi-person-fill me-2"></i>
        <Address address={user.address} />
      </div>
    </>
  ) : (
    <div className="navbar-text me-3">
      <button
        type="button"
        className="btn btn-primary button"
        onClick={connectWallet}
      >
        {t("connectWallet")}
      </button>
    </div>
  );
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src="/logo-b.png"
            alt="Barsino"
            width="24"
            height="24"
            className="d-inline-block align-text-top me-2"
          />
          {t("appName")}
        </Link>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link
              className={`nav-link ${
                categoryKey === CategoryType[CategoryType.finance] ? "active" : ""
              }`}
              to={`/play/${CategoryType[CategoryType.finance]}`}
            >
              <CategoryIcon category={CategoryType.finance} />
              <span className="ms-1">
                {t("category.finance.name")}
              </span>
            </Link>
            <Link
              className={`nav-link ${
                categoryKey === CategoryType[CategoryType.gameStats] ? "active" : ""
              }`}
              to={`/play/${CategoryType[CategoryType.gameStats]}`}
            >
              <CategoryIcon category={CategoryType.gameStats} />
              <span className="ms-1">
                {t("category.gameStats.name")}
              </span>
            </Link>
          </div>
        </div>
        <div className="d-flex flex-row">
          {accountInfo}
          {supportChain ? (
            <>
              <span className="navbar-brand me-2 pt-1">
                <img
                  src={chain.info.icon}
                  className="rounded"
                  alt={chain.info.name}
                  width="20"
                  height="20"
                />
              </span>
              <span className="navbar-text">{chain.info.name}</span>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
