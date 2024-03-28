import { combineReducers } from "redux";

import authReducer from "./auth";
import snackbarReducer from "./snackbar";

const reducer = combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
});

export default reducer;