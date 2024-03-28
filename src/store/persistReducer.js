import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["auth"],
};

const persist = (reducers) => persistReducer(persistConfig, reducers);

export default persist;