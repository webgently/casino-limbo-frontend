import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";

import Header from "../components/header";
import { Toaster } from "react-hot-toast";

const MainLayout = ({ children }) => {
  return (
    <>
      <Toaster />
      <Header />
      <Container maxWidth="lg">{!children && <Outlet />}</Container>
    </>
  );
};

export default MainLayout;
