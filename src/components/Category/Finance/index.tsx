import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useAppSelector} from "../../../hooks";
import {selectCasino, selectChain} from "../../../store/slices/chain";
import {selectUser} from "../../../store/slices/user";
import {connectWallet} from "../../../utils/wallet";

const LOTTERY_DEFAULT_STATE = {balance: 0, records: []};

const Finance = React.memo(() => {
  const casino = useAppSelector(selectCasino);
  const user = useAppSelector(selectUser);
  const chain = useAppSelector(selectChain);
  // @ts-ignore
  const currency = useMemo(() => chain.info.nativeCurrency.symbol, [chain]);

  const [data, setData] = useState(LOTTERY_DEFAULT_STATE);
  const [deposit, setDeposit] = useState(0);
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

  const onDeposit = useCallback(async () => {
    if(deposit < 0.5) {
      return;
    }
    if (!user.authed) {
      await connectWallet();
    }
    // @ts-ignore
    await casino.bankrollDeposit(deposit);
  }, [casino, deposit, user]);


  return (
      <div className="row">
        <div className="col">
          <div className="col-8 offset-2">
            <div className="card shadow">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-6 border-end ">
                    <div className="p-3">
                      <label>{currency}</label>
                      <input
                        type="number"
                        className="form-control"
                        disabled
                        aria-disabled={true}
                        value={data.balance}
                      />
                      <div className="py-3">
                        <button
                          className="btn btn-primary w-100" type="button" id="button-addon2"
                          onClick={onWithdrawBalance}
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3">
                      <label>{currency}</label>
                      <input
                        type="number"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-lg"
                        value={deposit}
                        /* @ts-ignore */
                        onChange={e => {
                          setDeposit(parseInt(e.target.value))
                        }}
                      />
                      <div className="py-3">
                        <button
                          className="btn btn-primary w-100" type="button" id="button-addon2"
                          onClick={onDeposit}
                        >
                          Deposit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="pt-4">Detail</h2>
          <table className="table table-striped">
            <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">from</th>
              <th scope="col">to</th>
              <th scope="col">type</th>
              <th scope="col">value</th>
            </tr>
            </thead>
            <tbody>
            {
              /* @ts-ignore */
              data.records.map((record: any, index: number) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index}</th>
                    <td>{record.from}</td>
                    <td>{record.to}</td>
                    <td>{record.type}</td>
                    <td>{record.value}</td>
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        </div>
      </div>
  )
})
export default Finance;