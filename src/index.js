import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App";
import LoginPage from "./LoginPage";
import reportWebVitals from "./reportWebVitals";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <div>
        <BrowserRouter>
        <App />
      </BrowserRouter>,
      {/* document.getElementById('root') */}
  </div>
  </>
);

reportWebVitals();
