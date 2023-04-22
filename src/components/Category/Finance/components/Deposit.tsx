import React, {useCallback, useMemo, useState} from "react";
import {useAppSelector} from "../../../../hooks";
import {selectChain} from "../../../../store/slices/chain";

interface IDeposit {
  text: string;
  onDeposit: (value: number) => Promise<void>;
}

export const Deposit = React.memo((props: IDeposit) => {
  const {text, onDeposit} = props;
  const chain = useAppSelector(selectChain);
  // @ts-ignore
  const currency = useMemo(() => chain.info.nativeCurrency.symbol, [chain]);
  const [deposit, setDeposit] = useState(0);

  const onInputChange = useCallback((e: any) => {
    setDeposit(parseInt(e.target.value));
  }, [setDeposit]);

  return (
    <div className="p-3">
      <label>{currency}</label>
      <input
        type="number"
        className="form-control"
        aria-label="Sizing example input"
        aria-describedby="inputGroup-sizing-lg"
        value={deposit}
        onChange={onInputChange}
      />
      <div className="py-3">
        <button
          className="btn btn-primary w-100" type="button" id="button-addon2"
          onClick={() => onDeposit(deposit)}
        >
          {text}
        </button>
      </div>
    </div>
  )
});