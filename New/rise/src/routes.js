
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import VolunteerRegistration from "./pages/cadastros/volunteerRegistration/volunteerRegistration";
import InstituteRegistration from "./pages/cadastros/instituteRegistration/InstituteRegistration";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardMapping from "./pages/dashboardMapping/DashboardMapping";
import RequireAuth from "./utils/RequireAuth";

function Rotas() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/volunteer-registration" element={<VolunteerRegistration />} />
                    <Route path="/institute-registration" element={<InstituteRegistration />} />
                    <Route path="/dashboard" element={
                        <RequireAuth>
                            <Dashboard />
                        </RequireAuth>
                    } />
                    <Route path="/dashboard-mapping" element={
                        <RequireAuth>
                            <DashboardMapping />
                        </RequireAuth>
                    } />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default Rotas;