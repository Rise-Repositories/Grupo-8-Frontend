import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import VolunteerRegistration from "./pages/cadastros/volunteerRegistration/volunteerRegistration";
import InstituteRegistration from "./pages/cadastros/instituteRegistration/InstituteRegistration";
import Dashboard from "./pages/dashboard/Dashboard";
import InstituteList from "./pages/instituteList/InstituteList";
import DashboardMapping from "./pages/dashboardMapping/DashboardMapping";
import PrivateRoute from "./pages/login/PrivateRoute";
import Home from "./pages/home/Home";
import DashboardWrapper from "./pages/dashboardWrapper/DashboardWrapper";
import RecoverPassword from "./pages/recoverPassword/RecoverPassword";
import ChangePassword from "./pages/changePassword/ChangePassword";

function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/recover-password" element={<RecoverPassword />} />
                <Route path="/change-password/:id"  element={<ChangePassword/>} />
                <Route path="/volunteer-registration" element={<VolunteerRegistration />} />
                <Route path="/institute-registration" element={<InstituteRegistration />} />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <DashboardWrapper />
                    </PrivateRoute>
                } >
                    <Route path="main" element={<Dashboard />} />
                    <Route path="mapping" element={<DashboardMapping />} />
                    <Route path="institute-list" element={<InstituteList />} />
                </Route>
                <Route path="/institute-list" element={<InstituteList />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;
