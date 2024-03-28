import * as React from "react";
import Content from "../components/content";
import Sidebar from "../components/sidebar";
import BetHistory from "../components/history";
import { Grid } from "@mui/material";
import { useEffect, useContext, useState } from "react";
import { io } from "socket.io-client";
import FundContext from "../context/FundContext";
import axios from "axios";

export default function CSSGrid() {
  const { userId } = useContext(FundContext);
  const [socket, setSocket] = useState();
  const [myBets, setMyBets] = useState([]);
  const load = async () => {
    let socketConnection = io(process.env.REACT_APP_SERVER_URL);
    console.log(userId, "userId");
    setSocket(socketConnection);
  };

  const SaveSocketId = async (userId, socketId) => {
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/api/game/save-socketId`, {
        userId,
        socketId,
      })
      .then((result) => {
        console.log(result, "result");
      })
      .catch((error) => {
        console.log(error, "error---------");
      });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (userId !== 0 && socket) {
      SaveSocketId(userId, socket.id);
    }
  }, [userId, socket]);
  return (
    <Grid container spacing={2} mt={2}>
      <Grid item md={6} sm={12}>
        <Content setMyBets={setMyBets} myBets={myBets} />
      </Grid>
      <Grid item md={6} sx={{ display: { xs: "none", md: "block" } }}>
        <Sidebar socket={socket} />
      </Grid>
      <Grid item md={12} xs={12}>
        <BetHistory socket={socket} myBets={myBets} />
      </Grid>
    </Grid>
  );
}
