import { store } from "../store";
import { openSnackbar } from "../store/reducers/snackbar";

const snackbar = (message, color) => {
  store.dispatch(
    /* @ts-ignore */
    openSnackbar({
      open: true,
      message,
      variant: "alert",
      transition: "SlideLeft",
      alert: { color },
      anchorOrigin: { vertical: "top", horizontal: "right" },
    })
  );
};

export default snackbar;
