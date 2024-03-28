import { useRoutes } from "react-router-dom";

import MainRoutes from "./MainRoutes";

import Error from "../pages/error";

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, { path: "*", element: <Error /> }]);
}