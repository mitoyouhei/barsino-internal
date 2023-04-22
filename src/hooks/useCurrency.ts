import {useAppSelector} from "./index";
import {selectChain} from "../store/slices/chain";
import {useMemo} from "react";

export const useCurrency = () => {
  const chain = useAppSelector(selectChain);
  // @ts-ignore
  const currency = useMemo(() => chain.info.nativeCurrency.symbol, [chain]);

  return currency;
}