import React from "react";
import ReactDOM from "react-dom";
import AppContainer from "./common/containers/App";
import "./styles/_main.scss";
import Routes from "./routes";
import { DarkModeProvider } from "./context/DarkModeContext";

// wrappe a application with darkmode context provider
ReactDOM.render(
  <AppContainer>
    <DarkModeProvider>
      <Routes />
    </DarkModeProvider>
  </AppContainer>,
  document.getElementById("root")
);
