import React, {useMemo} from "react";
import {GameStatsItem, GameTypeFromAPI} from "../../../../types";
import {useCurrency} from "../../../../hooks/useCurrency";

interface IStatsCard {
  text: string;
  data: GameStatsItem[];
}

interface IGamePanel {
  text: string;
  data: GameStatsItem[];
}

export const GamePanel = React.memo((props: IGamePanel) => {
  const {text, data} = props;
  const total = useMemo(() => data.reduce((x, y) => parseFloat(y.wager) + x, 0), [data])
  const currency = useCurrency();

  return (
    <div className="mx-5 w-50 d-flex flex-column align-items-start justify-content-start">
      <span className="m-1 text-center">{text}</span>
      <span className="m-1 "> {data.length} round</span>
      <span className="m-1 "> {`${total.toFixed(3)} ${currency}`}</span>
    </div>
  )
})

export const StatsCard = React.memo((props: IStatsCard) => {
  const {data, text} = props;
  const coinFlips = data.filter(game => game.gameType === GameTypeFromAPI.dice.toString());
  const rps = data.filter(game => game.gameType === GameTypeFromAPI.rps.toString());
  const total = useMemo(() => data.reduce((x, y) => parseFloat(y.wager) + x, 0), [data]);
  const currency = useCurrency();

  return (
    <div className="card shadow w-50 m-3">
      <div className="card-header">
        <h4 className="text-center">
          {text}
        </h4>
      </div>
      <div className="card-body p-0">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h5 className="m-3"> {data.length} round</h5>
          <h5 className="m-3"> {`${total.toFixed(3)} ${currency}`}</h5>
          <div className="d-flex justify-content-center w-100">
            <GamePanel text={'Coin Flip'} data={coinFlips} />
            <GamePanel text={'Rock Paper Scissors'} data={rps}/>
          </div>
        </div>
      </div>
    </div>
  )
})