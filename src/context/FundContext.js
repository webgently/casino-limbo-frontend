import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

const FundContext = createContext(null);

export const FundProvider = ({ children }) => {
  // let token =
  //   "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhY2IxOTBjNDBhY2Y0ZGEzYjM3YTEwNDJmY2EzMWQxMyIsInN1YiI6IntcImFwcFR5cGVcIjpcIjIzNFwiLFwiY2hhbm5lbElkXCI6XCJoNVwiLFwiY3JlYXRlVGltZVwiOjE2ODQzMjQzMjgwMDAsXCJpbnZpdGVDb2RlXCI6XCJBUlFET1dcIixcImlzVGVzdFwiOjAsXCJsYXN0TG9naW5UaW1lXCI6MTY4NDUwMDc3NjA0MCxcIm1lbWJlckxldmVsXCI6MSxcInBhY2thZ2VJZFwiOjQsXCJwYXNzd29yZFwiOlwiYTQxNjcxZDliOTg1NDkwNTExYzdlNDMwNzZlZTIzOWZsb3R0ZXJ5LTIwMjJcIixcInJlZ2lzdGVySXBcIjpcIjIxOC4xOTAuMjQ1LjQ0XCIsXCJyZWdpc3RlclNvdXJjZVwiOlwiaDVcIixcInJlZ2lzdGVyVmVyc2lvbkNvZGVcIjoyMzQsXCJzdGF0dXNcIjowLFwidXBkYXRlVGltZVwiOjE2ODQ1MDA3NzYwNDAsXCJ1c2VySWRcIjoxNjc3MTMsXCJ1c2VyTmFtZVwiOlwiMTExMTFcIixcInVzZXJQaG9uZVwiOlwiMTIzNDU2Nzg4OFwifSIsImlzcyI6InNnIiwiaWF0IjoxNjg0NTAwNzc2fQ.mzk9PbmIqh_ms2bHq1E6w_aECC-592RRGrFCFW7DIkg";
  // let token = document.location.href.split("=")[1];
  let token = new URLSearchParams(useLocation().search).get('cert');
  const [fund, setFund] = useState(1000);
  const [userId, setUserId] = useState(0);
  const [depositFlag, setdepositFlag] = useState(false);
  const [autobetFlag, setAutobetFlag] = useState(false);

  const getUserInfo = async () => {
    let userInfo = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/game/get-userInfo`,
      {
        token,
      }
    );
    if (userInfo.data.balance == 0) {
      setdepositFlag(true);
    }

    setUserId(userInfo.data.userId);
    setFund(userInfo.data.balance);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <FundContext.Provider
      value={{
        fund,
        setFund,
        userId,
        setUserId,
        depositFlag,
        setAutobetFlag,
        autobetFlag,
      }}
    >
      {children}
    </FundContext.Provider>
  );
};

export default FundContext;
