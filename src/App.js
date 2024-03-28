import Routes from "./routes";
import { Provider } from "react-redux";
import { store } from "./store";
import { APIProvider } from "./context/ApiContext";
import Snackbar from "./components/snackbar";
import "./App.css";
import "./assets/style.css";
import { FundProvider } from "./context/FundContext";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Provider store={store}>
      <APIProvider>
        <FundProvider>
          <ToastContainer />
          <Routes />
          <Snackbar />
        </FundProvider>
      </APIProvider>
    </Provider>
  );
}

export default App;
