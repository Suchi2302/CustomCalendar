import React from "react";
import logo from "./logo.svg";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import CalendarDashboard from "./Components/CalendarDashboard";
// import Calendar from "./Components/CustomCalendar";
import Header from "./Components/Header";
import Login from "./Components/Login";
import Signup from "./Components/Signup";

function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  console.log(isLoggedIn);
  return (
    <React.Fragment>
      <header>
        <Header />
      </header>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {isLoggedIn && (
            <Route path="/calendar" element={<CalendarDashboard />} />
          )}{" "}
        </Routes>
      </main>
    </React.Fragment>
  );
}

export default App;
