import React, {useEffect, useState} from "react";
import {useAppSelector} from "../../../hooks";
import {selectCasino} from "../../../store/slices/chain";
import {GameStatsItem} from "../../../types";
import {StatsCard} from "./components/StatsCard";

const DEFAULT_GAME_DATA: { winGames: GameStatsItem[], loseGames: GameStatsItem[] } = {
  winGames: [],
  loseGames: [],
}

const GameStats = React.memo(() => {
  const casino = useAppSelector(selectCasino);
  const [data, setData] = useState(DEFAULT_GAME_DATA);

  useEffect(() => {
    let didCancel = false;
    // @ts-ignore
    casino.getGames()
      .then((data) => {
        if (didCancel) {
          return
        }
        setData(data)
      });

    return () => {
      didCancel = true;
    }
  }, [casino]);

  return (
    <div className="mt-5 d-flex">
      <StatsCard
        text={'WIN'}
        data={data.winGames}
      />
      <StatsCard
        text={'LOSE'}
        data={data.loseGames}
      />
    </div>
  )
})
export default GameStats;