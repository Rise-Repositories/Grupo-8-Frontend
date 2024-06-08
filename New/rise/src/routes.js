
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import VolunteerRegistration from "./pages/cadastros/volunteerRegistration/volunteerRegistration";
import InstituteRegistration from "./pages/cadastros/instituteRegistration/InstituteRegistration";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardMapping from "./pages/dashboardMapping/DashboardMapping";

function Rotas() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/volunteer-registration" element={<VolunteerRegistration />} />
                    <Route path="/institute-registration" element={<InstituteRegistration />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard-mapping" element={<DashboardMapping />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default Rotas;