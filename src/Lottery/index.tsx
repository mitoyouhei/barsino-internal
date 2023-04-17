import React, {useCallback, useContext, useEffect, useState} from "react";

import {WalletContext} from "../contexts/WalletContext";
import "./index.css";

const LOTTERY_DEFAULT_STATE = {balance: 0, records: []};

const Lottery = React.memo(() => {
  const {casino} = useContext(WalletContext);
  const [data, setData] = useState(LOTTERY_DEFAULT_STATE);
  const [deposit, setDeposit] = useState(0)
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
    // @ts-ignore
    await casino.bankrollWithdraw();
  }, [casino]);

  return (
    <div>
      <div className={"withdraw"}>
        <span className={"g-col-4"}>{`Balance Left: ${data.balance}`}</span>
        <button
          className="btn btn-primary" type="button" id="button-addon2"
          onClick={onWithdrawBalance}
        >
          Withdraw
        </button>
      </div>
      <div className="input-group input-group-lg deposit">
        <span className="input-group-text" id="inputGroup-sizing-lg">ETH</span>
        <input
          type="number"
          className="form-control"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-lg"
          value={deposit}
          /* @ts-ignore */
          onChange={e => setDeposit(e.target.value)}
        />
        <button className="btn btn-primary" type="button" id="button-addon2">
          Deposit
        </button>
      </div>
      <h2>Detail</h2>
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
  )
});

export default Lottery;