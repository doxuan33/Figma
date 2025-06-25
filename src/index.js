import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Thêm dòng này */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
