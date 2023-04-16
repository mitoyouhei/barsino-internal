import React, {useContext, useEffect, useState} from "react";

import {WalletContext} from "../contexts/WalletContext";
import "./index.css";

const LOTTERY_DEFAULT_STATE = {balance: 0, records: []};

const Lottery = React.memo(() => {
  const {casino} = useContext(WalletContext);
  const [data, setData] = useState(LOTTERY_DEFAULT_STATE);

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

  return (
    <div>
      <div>{`Balance: ${data.balance}`}</div>
      <table className="table">
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
              <tr>
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