import {Link, matchPath} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../../hooks";
import {selectUser} from "../../store/slices/user";
import {connectWallet} from "../../utils/wallet";
import {Address} from "./Address";
import {selectChain} from "../../store/slices/chain";
import {CategoryIcon} from "../share/CategoryIcon";
import {CategoryType} from "../../types";
import React from "react";

const AccountInfo = React.memo(() => {
  const user = useAppSelector(selectUser);
  const {t} = useTranslation();

  return user.authed ? (
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
        <Address address={user.address}/>
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
  )
});

const HomeLink = React.memo(({title}: { title: string }) => (
  <Link className="navbar-brand" to="/">
    <img
      src="/logo-b.png"
      alt="Barsino"
      width="24"
      height="24"
      className="d-inline-block align-text-top me-2"
    />
    {title}
  </Link>
));

interface INaveButton {
  text: string;
  category: CategoryType;
}

const NaveButton = React.memo((props: INaveButton) => {
  const match = matchPath({path: "play/:categoryKey"}, window.location.pathname);
  const categoryKey = match?.params.categoryKey;
  const {text, category} = props;

  return (
    <Link
      className={`nav-link ${
        categoryKey === CategoryType[category] ? "active" : ""
      }`}
      to={`/play/${CategoryType[category]}`}
    >
      <CategoryIcon category={category}/>
      <span className="ms-1">{text}</span>
    </Link>
  )
});

const ChainInfo = React.memo(() => {
  const chain = useAppSelector(selectChain);
  const supportChain = chain.id !== null && chain.support;

  return supportChain ? (
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
  ) : null
});

export function Topbar() {
  const {t} = useTranslation();
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <HomeLink title={t("appName")}/>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NaveButton
              category={CategoryType.finance}
              text={t("category.finance.name")}
            />
            <NaveButton
              category={CategoryType.gameStats}
              text={t("category.gameStats.name")}
            />
          </div>
        </div>
        <div className="d-flex flex-row">
          <AccountInfo/>
          <ChainInfo/>
        </div>
      </div>
    </nav>
  );
}
