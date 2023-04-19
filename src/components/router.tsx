import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./Layout/ErrorPage";
import { App } from "./App";
import { Home } from "./Home/Home";
import Finance from "./Category/Finance";
import GameStats from "./Category/GameStats";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/play/finance",
        element: <Finance />,
      },
      {
        path: "/play/games",
        element: <GameStats />,
      },
    ],
  },
]);
