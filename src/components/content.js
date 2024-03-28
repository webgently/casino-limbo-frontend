import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import $ from "jquery";
import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import Limbo1 from "../assets/img/limbo1.png";
import Limbo2 from "../assets/img/limbo2.png";
import Mountain from "../assets/img/mountain.png";
import Rocket from "../assets/img/rocket.png";
import FundContext from "../context/FundContext";
import Axios from "../hooks/axios";
import snackbar from "../hooks/snackbar";

let BetCount = 0;
let AutoBet = false;
let PrevFund = 0;
let CurFund = 0;

let borderBottomStyles = {
  "& div": {
    background: "transparent !important",
    "&:hover:not(.Mui-disabled, .Mui-error):before": {
      borderBottom: "none",
    },
    "&::before": {
      borderBottom: "none",
    },
    "&::after": {
      borderBottom: "none",
    },
    input: {
      height: "50px",
      fontSize: "20px !important",
    },
  },
};

let optionTextField = {
  "& div fieldset": { display: "none" },
  "& div input": {
    color: "white",
    fontWeight: "700",
  },
};

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

export default function GameContent({ setMyBets, myBets }) {
  const [value, setValue] = useState(0);
  const [autoBet, setAutoBet] = useState(false);
  const [cashOut, setCashOut] = useState(2);
  const [betAmount, setBetAmount] = useState(10);
  const [disable, setDisable] = useState(false);
  const [betCount, setbetCount] = useState(0);
  const [stopProfit, setstopProfit] = useState(0);
  const [stopLose, setstopLose] = useState(0);
  const [maxBet, setmaxBet] = useState(0);
  const [onWin, setonWin] = useState(0);
  const [onLoss, setonLoss] = useState(0);
  const { fund, setFund, userId, setAutobetFlag } = useContext(FundContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const Bet = (betAmount) => {
    setFund((prev) => {
      CurFund = prev - betAmount;
      return CurFund;
    });
    Axios.post("/api/game/bet-game", {
      userId,
      betAmount: betAmount * 100,
      cashOut,
    })
      .then(({ data }) => {
        console.log(data, 'data-----')
        if (data.flag) {
          setFund((prev) => {
            CurFund = prev + data.payout;
            return CurFund;
          });
        }
        setMyBets((prev) => {
          if (prev.length > 9) {
            prev.pop();
          }
          return [data, ...prev];
        });
        const win = data.flag;
        // eslint-disable-next-line
        $(".counter").each(function () {
          const size = $(this).text().split(".")[1]
            ? $(this).text().split(".")[1].length
            : 0;
          $(this)
            .prop("Counter", 0)
            .animate(
              { Counter: data.multiplier },
              {
                duration: 600,
                step: (func) => {
                  $(this).text(parseFloat(func).toFixed(size));
                },
              }
            );
        });
        $(".rocket-wrap").addClass("flying");
        $(".rocket-payout").attr("class", "rocket-payout");
        $(".counter").attr("class", "counter");
        $(".rocket-wrap").addClass("flying");
        setTimeout(() => {
          $(".rocket-wrap, .rocket-boom").addClass("boom");
          setTimeout(() => {
            if (win) {
              $(".rocket-payout, .counter").toggleClass("text-success");
            } else {
              $(".rocket-payout, .counter").toggleClass("text-danger");
            }
            $(".rocket-wrap").removeClass("flying").removeClass("boom");
            $(".rocket-boom").removeClass("boom");

            setDisable(false);

            if (
              (stopProfit !== 0 && stopProfit <= CurFund - PrevFund) ||
              (stopLose !== 0 && stopLose <= PrevFund - CurFund)
            ) {
              AutoBet = false;
              setAutoBet(false);
              setAutobetFlag(false);
            }

            if (value === 1 && BetCount > 0 && AutoBet === true) {
              setTimeout(() => {
                if (data.flag && onWin !== 0) {
                  betAmount = Number(betAmount * (1 + onWin / 100)).toFixed(2);
                  setBetAmount(betAmount);
                }
                if (!data.flag && onLoss !== 0) {
                  betAmount = Number(betAmount * (1 + onLoss / 100)).toFixed(2);
                  setBetAmount(betAmount);
                }
                if (CurFund >= betAmount) {
                  Bet(betAmount);
                } else {
                  AutoBet = false;
                  setAutoBet(false);
                  setAutobetFlag(false);
                  snackbar("Not enough fund!", "error");
                }
              }, 400);
              BetCount--;
              setbetCount(BetCount);
            }

            if (BetCount === 0) {
              AutoBet = false;
              setAutoBet(false);
              setAutobetFlag(false);
            }
          }, 400);
        }, 400);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onPlay = async () => {
    if (Number(betAmount) < 10 || Number(betAmount) > 1000) {
      snackbar(`Maximum bet 1000, minimum bet 10`, "error");
    } else if (cashOut < 1.1) {
      snackbar(`Min CashOut is 1.1`, "error");
      setDisable(false);
    } else if (betAmount > fund) {
      snackbar(`Not enough fund!`, "error");
    } else {
      if (value === 1) {
        if (betCount < 1) {
          snackbar("Bet Count is Invalid", "error");
          return;
        } else if (AutoBet === true) {
          AutoBet = false;
          setAutoBet(false);
          setAutobetFlag(false);
        } else {
          if (maxBet >= 10 && maxBet <= 1000) {
            AutoBet = true;
            setAutoBet(AutoBet);
            setAutobetFlag(true);
            BetCount = betCount - 1;
            setbetCount(BetCount);
            PrevFund = fund;
            if (betAmount > maxBet && maxBet !== 0) {
              setBetAmount(maxBet);
              Bet(maxBet);
            } else {
              Bet(betAmount);
            }
          } else {
            snackbar("Max Bet is Invalid", "error");
          }
        }
      } else {
        Bet(betAmount);
      }
    }
  };

  return (
    <Box className="gameContent">
      <Stack
        className="game-container game-limbo"
        sx={{
          flexDirection: "row",
          "@media (max-width:767px)": {
            flexDirection: "column",
          },
        }}
      >
        <Stack
          sx={{
            background: "transparent",
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box className="game-content game-content-limbo">
            <Box className="limbo-canvas">
              <img src={Limbo1} className="cloud cloud-r" alt="" />
              <img src={Limbo2} className="cloud cloud-d" alt="" />
              <img src={Limbo1} className="cloud cloud-v" alt="" />
              <img src={Limbo2} className="cloud cloud-g" alt="" />
              <img src={Mountain} className="limbo-bg" alt="" />
              <Box className="bg-star show-1">
                <Box className="l-star e-r" />
                <Box className="l-star s-p" />
                <Box className="l-star r-p" />
              </Box>
              <Box className="game-rocket notranslate">
                <Box className="rocket-number">
                  <span className="rocket-payout">
                    <span className="counter">1.00</span>x
                  </span>
                  <Box className="rocket-boom" />
                </Box>
                <Box className="rocket-wrap fire">
                  <Box className="rocket-img">
                    <img src={Rocket} alt="" />
                  </Box>
                  <Box className="rocket-fire" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Stack>
      <Stack className="game-control" mt={5}>
        <Grid container spacing={1} gap={{ xs: "15px", md: "0" }}>
          <Grid item md={5} xs={12}>
            <Stack className="game-control-stack" gap={1} flexDirection="row">
              <Stack flex={1} gap={1}>
                <Button
                  className="game-control-button"
                  onClick={() => {
                    setBetAmount(1);
                  }}
                >
                  min
                </Button>
                <Button
                  className="game-control-button"
                  onClick={() => {
                    setBetAmount(1000);
                  }}
                >
                  max
                </Button>
              </Stack>
              <TextField
                hiddenLabel
                id="filled"
                variant="filled"
                className="game-control-text"
                sx={borderBottomStyles}
                value={betAmount}
                onChange={(e) => {
                  Number(e.target.value) >= 0 && Number(e.target.value) <= 1000
                    ? setBetAmount(Number(e.target.value))
                    : setBetAmount(betAmount);
                }}
              />
              <Stack flex={1} gap={1} sx={{ display: "flex", width: "100%" }}>
                <Button
                  className="game-control-button"
                  onClick={() => {
                    betAmount / 2 >= 1 ?
                      setBetAmount(betAmount / 2) : setBetAmount(1);
                  }}
                >
                  1/2
                </Button>
                <Button
                  className="game-control-button"
                  onClick={() => {
                    betAmount * 2 <= 1000 ?
                      setBetAmount(betAmount * 2) : setBetAmount(1000);
                  }}
                >
                  2
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid item md={3.5} xs={12}>
            <Stack className="game-control-stack" gap={1}>
              <Stack flexDirection="row" gap={1}>
                <Button
                  className="game-control-button"
                  onClick={() => {
                    if (Number(cashOut) >= 2.1 && cashOut <= 1000) {
                      setCashOut((Number(cashOut) - 1).toFixed(2));
                    }
                  }}
                >
                  -
                </Button>
                <TextField
                  hiddenLabel
                  id="filled"
                  variant="filled"
                  className="game-control-text"
                  sx={borderBottomStyles}
                  value={cashOut}
                  onChange={(e) => {
                    Number(e.target.value) >= 0 && Number(e.target.value) <= 1000
                      ? setCashOut(Number(e.target.value))
                      : setCashOut(cashOut);
                  }}
                />
                <Button
                  className="game-control-button"
                  onClick={() => {
                    cashOut < 1000
                      ? setCashOut((Number(cashOut) + 1).toFixed(2))
                      : setCashOut(cashOut);
                  }}
                >
                  +
                </Button>
              </Stack>
              <Typography sx={{ color: "#55657e", fontWeight: "900" }}>
                Cash Out
              </Typography>
            </Stack>
          </Grid>
          <Grid item md={3.5} xs={12} sx={{ position: "relative" }}>
            <Button
              sx={{
                width: "100% !important",
                height: "115%",
                position: "relative",
              }}
              variant="contained"
              className="btn-bet"
              onClick={() => {
                if (!disable) {
                  setDisable(true);
                  onPlay();
                }
              }}
              disabled={disable}
            >
              {value === 0 ? "Bet" : autoBet ? "Stop" : "Start"}
            </Button>
          </Grid>
        </Grid>
      </Stack>
      <Box className="game-setting" mt={{ xs: 10, md: 3 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon tabs example"
        >
          <Tab
            aria-label="Manual"
            label="Manual"
            className="game-setting-tab"
            disabled={autoBet}
          />
          <Tab aria-label="Auto" label="Auto" className="game-setting-tab" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={1}>
        <Stack className="game-control-stack" gap={1}>
          <Grid container spacing={4} p={2}>
            <Grid
              item
              md={4}
              xs={6}
              gap={1}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Typography className="game-auto-option-text">
                Number of Bets
              </Typography>
              <TextField
                id="outlined-multiline-flexible"
                type="number"
                hiddenLabel
                className="game-auto-option-textfield"
                sx={optionTextField}
                value={betCount}
                onChange={(e) => {
                  Number(e.target.value) >= 0
                    ? setbetCount(Number(e.target.value).toFixed(0))
                    : setbetCount(betCount);
                }}
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={6}
              gap={1}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Typography className="game-auto-option-text">
                Stop on Profit
              </Typography>
              <TextField
                id="outlined-multiline-flexible"
                hiddenLabel
                className="game-auto-option-textfield"
                type="number"
                sx={optionTextField}
                value={stopProfit}
                onChange={(e) => {
                  Number(e.target.value) >= 0
                    ? setstopProfit(Number(e.target.value).toFixed(0))
                    : setstopProfit(stopProfit);
                }}
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={6}
              gap={1}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Typography className="game-auto-option-text">
                Stop on Lose
              </Typography>
              <TextField
                id="outlined-multiline-flexible"
                hiddenLabel
                className="game-auto-option-textfield"
                sx={optionTextField}
                type="number"
                value={stopLose}
                onChange={(e) => {
                  Number(e.target.value) >= 0
                    ? setstopLose(Number(e.target.value).toFixed(0))
                    : setstopLose(stopLose);
                }}
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={6}
              gap={1}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Typography className="game-auto-option-text">Max Bet</Typography>
              <TextField
                id="outlined-multiline-flexible"
                hiddenLabel
                className="game-auto-option-textfield"
                sx={optionTextField}
                type="number"
                value={maxBet}
                onChange={(e) => {
                  Number(e.target.value) >= 0
                    ? setmaxBet(Number(e.target.value).toFixed(0))
                    : setmaxBet(maxBet);
                }}
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={6}
              gap={1}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Typography className="game-auto-option-text">
                When Win
              </Typography>
              <>
                <TextField
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" className="adornment">
                        %
                      </InputAdornment>
                    ),
                  }}
                  id="outlined-multiline-flexible"
                  hiddenLabel
                  className="game-auto-option-textfield"
                  sx={optionTextField}
                  value={onWin}
                  type="number"
                  onChange={(e) => {
                    Number(e.target.value) >= 0
                      ? setonWin(Number(e.target.value).toFixed(0))
                      : setonWin(onWin);
                  }}
                />
              </>
            </Grid>
            <Grid
              item
              md={4}
              xs={6}
              gap={1}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Typography className="game-auto-option-text">
                When Lose
              </Typography>
              <TextField
                id="outlined-multiline-flexible"
                hiddenLabel
                className="game-auto-option-textfield"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" className="adornment">
                      %
                    </InputAdornment>
                  ),
                }}
                sx={optionTextField}
                type="number"
                value={onLoss}
                onChange={(e) => {
                  Number(e.target.value) >= 0
                    ? setonLoss(Number(e.target.value).toFixed(0))
                    : setonLoss(onLoss);
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </TabPanel>
    </Box>
  );
}
