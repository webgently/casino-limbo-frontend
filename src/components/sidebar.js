import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Token } from "@mui/icons-material";
import { ListItemIcon, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function SideBar({ socket }) {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    if (socket) {
      socket.on("all-bets", (data) => {
        setHistory(data.gameHistory);
      });
    }
  }, [socket]);
  return (
    <Box sx={{ width: "100%", bgcolor: "transparent" }}>
      <List component="nav" aria-label="secondary mailbox folder">
        <ListItem className="bet-history-thead">
          <ListItemText
            sx={{
              flex: "1",
            }}
            primary="Player"
          />
          <ListItemText
            sx={{
              flex: "1",
              textAlign: "right",
            }}
            primary="Time"
          />
          <ListItemText
            sx={{
              flex: "1",
              textAlign: "right",
            }}
            primary="Amount"
          />
          <ListItemText
            sx={{
              flex: "1",
              textAlign: "right",
            }}
            primary="Multiplier"
          />
          <ListItemText
            sx={{
              flex: "1",
              textAlign: "right",
            }}
            primary="Payment"
          />
        </ListItem>
        <Divider className="bet-history-divider" />
        {history.length > 0 ? (
          history.map((data, key) => {
            return (
              <div key={key}>
                <ListItem className="bet-history-tr">
                  <ListItemText sx={{ flex: "1" }} primary="User715890..." />
                  <ListItemText
                    sx={{ flex: "1", textAlign: "right" }}
                    primary={new Date(data.time).toLocaleTimeString()}
                  />
                  <ListItemText
                    sx={{ flex: "1", textAlign: "right" }}
                    primary={data.betAmount}
                  />
                  <ListItemText
                    sx={{ flex: "1", textAlign: "right" }}
                    primaryTypographyProps={{
                      color: data.flag ? "#04ff04" : "gray",
                    }}
                    primary={Number(data.multiplier).toFixed(2)}
                  />
                  <ListItemText
                    primaryTypographyProps={{
                      color: data.flag ? "#04ff04" : "gray",
                    }}
                    sx={{ flex: "1", textAlign: "right" }}
                    primary={data.flag ? data.payout : 0}
                  />
                </ListItem>
                <Divider className="bet-history-divider" />
              </div>
            );
          })
        ) : (
          <Box sx={{ textAlign: "center" }} pt={2}>
            <Typography sx={{ fontWeight: "900", fontSize: "20px" }}>
              No History
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  );
}
