import React from "react";
import {Route, Routes, BrowserRouter as Router}  from 'react-router-dom'

import ForgetPassword from "./pages/ForgetPassword";
import LoginRegister from "./pages/LoginRegister"
import Home from "./pages/Home";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";
import AdminPanel from "./pages/AdminPanel";
import MySalaries from "./pages/MySalaries";
import Attendances from "./pages/Attendances";
import LeaveRequests from "./pages/LeaveRequests";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ManagerPanel from "./pages/ManagerPanel";



const App = ()=> {
  return (
    <React.Fragment>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login-register" element={<LoginRegister/>}/>
        <Route path="/reset-password" element={<ForgetPassword/>}/>
        <Route path="/admin-panel" element={<AdminPanel/>}/>
        <Route path="/manager-panel" element={<ManagerPanel/>}/>
        <Route path="/salaries" element={<MySalaries/>}/>
        <Route path="/attendances" element={<Attendances/>}/>
        <Route path="/leave-requests" element={<LeaveRequests/>}/>
        <Route path="/profile" element={<ProfilePage />}/>
      </Routes>
    </Router>
    <Footer/>
    </React.Fragment>
  );
}

export default App;
