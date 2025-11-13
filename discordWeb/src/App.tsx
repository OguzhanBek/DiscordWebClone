import { RouterProvider } from "react-router-dom";

import "./App.css";
import { router } from "./routes/router";
import AppProvider from "./context/userProvider";

function App() {
  return (
    <>
    <AppProvider>
      <RouterProvider key={"bombo"} router={router} />
      </AppProvider>
    </>
  );
}

export default App;
