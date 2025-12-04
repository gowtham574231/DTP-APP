import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";      // <-- includes Ta
import { BrowserRouter } from "react-router-dom";
import { MergeProvider } from "./context/MergeContext"; // ✅ import context provider

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MergeProvider>
        <App />
      </MergeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
