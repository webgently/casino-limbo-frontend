import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  balance: null,
  token: "",
  status: false,
  isLoggedIn: false,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    Login(state, action) {
      const { balance, user, status, session } = action.payload;
      state.user = user;
      state.token = session.accessToken;
      state.balance = balance;
      state.status = status;
      state.isLoggedIn = status;
    },

    UpdateInfo(state, action) {
      const { balance, user, status } = action.payload;
      state.user = user;
      state.balance = balance;
      state.status = status;
      state.isLoggedIn = status;
    },

    UpdateUserInfo(state, action) {
      const { user } = action.payload;
      state.user = user;
    },

    UpdateBalances(state, action) {
      const balance = action.payload;
      state.balance = balance;
    },

    // SetCode(state, action) {
    //   state.code = action.payload;
    // },

    // SetBetsId(state, action) {
    //   state.betsId = action.payload;
    // },

    Logout(state, action) {
      state.user = {};
      state.balance = [];
      state.status = false;
      state.isLoggedIn = false;
    },
  },
});

export default auth.reducer;

export const { Login, Logout, UpdateBalances, UpdateInfo, UpdateUserInfo } =
  auth.actions;