import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../../../hooks";
import {selectCasino} from "../../../store/slices/chain";
import {selectUser} from "../../../store/slices/user";
import {connectWallet} from "../../../utils/wallet";
import {IBankrollRecord} from "../../../types";
import { Deposit } from "./components/Deposit";
import {Withdraw} from "./components/Withdraw";
import {DetailTable} from "./components/DetailTable";

const LOTTERY_DEFAULT_STATE = {balance: '0', records: []};

const Finance = React.memo(() => {
  const casino = useAppSelector(selectCasino);
  const user = useAppSelector(selectUser);
  const {t} = useTranslation();

  const [data, setData] = useState<{ balance: string; records: IBankrollRecord[] }>(LOTTERY_DEFAULT_STATE);
  useEffect(() => {
    let didCancel = false;
    if (!casino) {
      return;
    }

    Promise.all([
      // @ts-ignore
      casino.bankrollGetBalance(),
      // @ts-ignore
      casino.bankrollTransactionRecords(),
    ]).then(([balance, records]) => {
      if (didCancel) {
        return;
      }
      // @ts-ignore
      setData({balance, records});
    }).catch(err => {
      console.log('Lottery err', err);
      if (didCancel) {
        return;
      }
      setData(LOTTERY_DEFAULT_STATE);
    });

    return () => {
      didCancel = true;
    }
  }, [casino]);


  const onWithdrawBalance = useCallback(async () => {
    if (!user.authed) {
      await connectWallet();
    }
    // @ts-ignore
    await casino.bankrollWithdraw();
  }, [user, casino]);

  const onDeposit = useCallback(async (deposit: number) => {
    if (deposit < 0.5) {
      return;
    }
    if (!user.authed) {
      await connectWallet();
    }
    // @ts-ignore
    await casino.bankrollDeposit(deposit.toString());
  }, [casino, user]);

  return (
    <>
      <div className="offset-2">
        <div className="mt-5 card shadow">
          <div className="card-body p-0">
            <div className="row">
              <div className="col-6 border-end ">
                <Withdraw
                  text={t("category.finance.withdraw")}
                  onWithdrawBalance={onWithdrawBalance}
                  value={data.balance}
                />
              </div>
              <div className="col-6">
                <Deposit
                  text={t("category.finance.deposit")}
                  onDeposit={onDeposit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <DetailTable data={data.records}/>
    </>
  )
})
export default Finance;