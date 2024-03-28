import React, { createContext, useState } from "react";
import axios from "../hooks/axios";
import { useDispatch, useSelector } from "../store";
import { Logout, UpdateInfo } from "../store/reducers/auth";

const APIContext = createContext(null);

export const APIProvider = ({ children }) => {
  const dispatch = useDispatch();
  const state = useSelector((store) => store.auth);
  const [socket, setSocket] = useState();
  const { user } = state;
  const userId = user?._id;

  const resetPassword = (email) => console.log(email);

  const register = async (loginData) => {
    const data = await axios.post("api/v2/users/signup", loginData);
    return data;
  };

  const getUpdatedInfo = async () => {
    const { data } = await axios.post("api/v2/users/getInfo");
    dispatch(UpdateInfo(data));
    return data;
  };

  const verifyTwitter = async (verifyRequest) => {
    const data = await axios.post("api/v2/users/verify-twitter", verifyRequest);
    return data;
  };

  const getTopAuctions = async () => {
    const { data } = await axios.post("api/v2/auctions/get-top");
    return data;
  };

  const getAuction = async (auctionId) => {
    const { data } = await axios.post("api/v2/auctions/get", {
      auctionId: auctionId,
    });
    return data;
  };

  const getHistory = async (auctionId) => {
    const { data } = await axios.post("api/v2/auctions/get-history", {
      auctionId: auctionId,
    });
    return data;
  };

  const logout = () => {
    dispatch(Logout({}));
  };

  const forgotPassword = async (email, recaptcha) => {
    const res = await axios.post("api/v2/users/forgot", {
      email,
      recaptcha,
    });
    return res;
  };

  const changePassword = async (data) => {
    const res = await axios.post("api/v2/users/c-password", data);
    return res;
  };

  const checkAddress = async (publicAddress) => {
    const res = await axios.post("api/v2/users/a-check", { publicAddress });
    return res;
  };

  const signInAddress = async (publicAddress, signature) => {
    const res = await axios.post("api/v2/users/a-signin", {
      publicAddress,
      signature,
    });
    return res;
  };

  const signInSolana = async (publicAddress, signature) => {
    const res = await axios.post("api/v2/users/s-signin", {
      publicAddress,
      signature,
    });
    return res;
  };

  const signUpAddress = async (publicAddress) => {
    const res = await axios.post("api/v2/users/a-signup", {
      publicAddress,
    });
    return res;
  };

  const updateUserInfo = async (info) => {
    const res = await axios.post("api/v2/users/info", { ...info, userId });
    return res;
  };

  const getReferral = async () => {
    const res = await axios.post("api/v2/users/referral", { userId });
    return res;
  };

  const getTransactions = async () => {
    const res = await axios.post("api/v2/payments/get-transaction", {
      userId,
    });
    return res;
  };

  const getBalances = async () => {
    const res = await axios.post("api/v2/payments/get-balance", { userId });
    return res;
  };

  const getCurrency = async () => {
    const res = await axios.post("api/v2/payments/get-currency", {});
    return res;
  };

  const addCurrency = async (currency) => {
    const res = await axios.post("api/v2/payments/add-currency", {
      userId,
      currency,
    });
    return res;
  };

  const changeCurrency = async (currency) => {
    const res = await axios.post("api/v2/payments/use-currency", {
      userId,
      currency,
    });
    return res;
  };

  const deposit = async () => {
    const balanceId = "";
    const res = await axios.post("api/v2/payments/deposit", {
      userId,
      balanceId,
    });
    return res;
  };

  const depositMetamask = async (transaction) => {
    const balanceId = "";
    const currencyId = "";
    const res = await axios.post("api/v2/payments/m-deposit", {
      userId,
      balanceId,
      currencyId,
      ...transaction,
    });
    return res;
  };

  const depositSolana = async (transaction, balanceId, currencyId, address) => {
    const res = await axios.post("api/v2/payments/s-deposit", {
      userId,
      balanceId,
      currencyId,
      ...transaction,
    });
    return res;
  };

  const withdrawal = async (address, method, amount, balanceId, currencyId) => {
    const res = await axios.post("api/v2/payments/withdrawal", {
      userId,
      currencyId,
      balanceId,
      address,
      method,
      amount,
    });
    return res;
  };

  const cancelWithdrawal = async (_id) => {
    const res = await axios.post("api/v2/payments/c-withdrawal", {
      userId,
      _id,
    });
    return res;
  };

  const betSport = async (data, type, stake) => {
    const currencyId = "";
    const res = await axios.post("api/v2/sports/bet", {
      data,
      type,
      stake,
      userId,
      currency: currencyId,
    });
    return res;
  };

  const getMybets = async (status) => {
    const res = await axios.post("api/v2/sports/history", {
      status,
      userId,
    });
    return res;
  };

  const getCasinoHistory = async (type, perPage) => {
    const res = await axios.post("api/v2/games/history", {
      type,
      perPage,
      userId,
    });
    return res;
  };

  const uploadFile = async (data) => {
    const res = await axios.post("api/v2/files/", data);
    return res;
  };

  const deleteFile = async (uri) => {
    const res = await axios.post("api/v2/files/delete", { uri });
    return res;
  };

  return (
    <APIContext.Provider
      value={{
        socket,
        setSocket,
        signUpAddress,
        verifyTwitter,
        getHistory,
        getAuction,
        getTopAuctions,
        getUpdatedInfo,
        register,
        logout,
        forgotPassword,
        checkAddress,
        signInAddress,
        signInSolana,
        changePassword,
        resetPassword,
        updateUserInfo,
        getReferral,
        getTransactions,
        getBalances,
        getCurrency,
        addCurrency,
        changeCurrency,
        deposit,
        depositMetamask,
        depositSolana,
        withdrawal,
        cancelWithdrawal,
        betSport,
        getMybets,
        getCasinoHistory,
        uploadFile,
        deleteFile,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

export default APIContext;
