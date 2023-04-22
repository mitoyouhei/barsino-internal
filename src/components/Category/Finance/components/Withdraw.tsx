import React from "react";
import {useCurrency} from "../../../../hooks/useCurrency";

interface IWithdraw {
  text: string;
  onWithdrawBalance: () => Promise<void>;
  value: string;
}

export const Withdraw = React.memo((props: IWithdraw) => {
  const {text, onWithdrawBalance, value} = props;
  const currency = useCurrency();
  return (
    <div className="p-3">
      <label>{currency}</label>
      <input
        type="number"
        className="form-control"
        disabled
        aria-disabled={true}
        value={value}
      />
      <div className="py-3">
        <button
          className="btn btn-primary w-100" type="button" id="button-addon2"
          // @ts-ignore
          onClick={onWithdrawBalance}
        >
          {text}
        </button>
      </div>
    </div>
  )
});
