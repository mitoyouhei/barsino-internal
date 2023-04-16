import React from "react";
import {createBrowserRouter} from "react-router-dom";
import Lottery from "./Lottery";
import Layout from "./Layout";

const ErrorPage = React.memo(() => (
  <div>
    ErrorPage
  </div>
));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: <Lottery/>,
      },
      {
        path: "/lottery",
        element: <Lottery/>,
      },
    ],
  },
]);
