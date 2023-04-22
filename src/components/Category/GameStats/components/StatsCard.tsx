import React from "react";
import {GameStatsItem} from "../../../../types";

interface IStatsCard {
  text: string;
  data: GameStatsItem[];
}

export const StatsCard = React.memo((props: IStatsCard) => {
  const {data, text} = props;
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
          <h5 className="m-3"> {data.reduce((x, y) => parseFloat(y.wager) + x, 0)} MATIC</h5>
        </div>
      </div>
    </div>
  )
})