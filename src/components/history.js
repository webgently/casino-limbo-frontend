import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Tab, Tabs, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function SideBar({ socket, myBets }) {
  const [history, setHistory] = useState([]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (socket) {
      socket.on("all-bets", (data) => {
        setHistory(data.gameHistory);
      });
    }
  }, [socket]);

  return (
    <Box
      sx={{ width: "100% !important", bgcolor: "transparent" }}
      mb={2}
      className="historyTab"
    >
      <Box mt={{ xs: 1, md: 3 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon tabs example"
        >
          <Tab
            aria-label="Manual"
            label="My Bet"
            className="game-setting-tab"
          />
          <Tab
            aria-label="Auto"
            label="All Bets"
            className="game-setting-tab"
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
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
          {myBets.length > 0 ? (
            myBets.map((data, key) => {
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
      </TabPanel>
      <TabPanel value={value} index={1}>
        <List component="nav" aria-label="secondary mailbox folder">
          <ListItem className="bet-history-thead">
            <ListItemText
              sx={{
                flex: "3",
              }}
              primary="Player"
            />
            <ListItemText
              sx={{
                flex: "3",
                textAlign: "right",
              }}
              primary="Time"
            />
            <ListItemText
              sx={{
                flex: "2",
                textAlign: "right",
              }}
              primary="Amount"
            />
            <ListItemText
              sx={{
                flex: "2",
                textAlign: "right",
              }}
              primary="Multiplier"
            />
            <ListItemText
              sx={{
                flex: "2",
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
                    <ListItemText sx={{ flex: "3" }} primary="User715890..." />
                    <ListItemText
                      sx={{ flex: "3", textAlign: "right" }}
                      primary={new Date(data.time).toLocaleTimeString()}
                    />
                    <ListItemText
                      sx={{ flex: "2", textAlign: "right" }}
                      primary={data.betAmount}
                    />
                    <ListItemText
                      sx={{ flex: "2", textAlign: "right" }}
                      primaryTypographyProps={{
                        color: data.flag ? "#04ff04" : "gray",
                      }}
                      primary={Number(data.multiplier).toFixed(2)}
                    />
                    <ListItemText
                      primaryTypographyProps={{
                        color: data.flag ? "#04ff04" : "gray",
                      }}
                      sx={{ flex: "2", textAlign: "right" }}
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
      </TabPanel>
    </Box>
  );
}
