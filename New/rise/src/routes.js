import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import VolunteerRegistration from "./pages/cadastros/volunteerRegistration/volunteerRegistration";
import InstituteRegistration from "./pages/cadastros/instituteRegistration/InstituteRegistration";
import Dashboard from "./pages/dashboard/Dashboard";
import InstituteList from "./pages/instituteList/InstituteList";
import DashboardMapping from "./pages/dashboardMapping/DashboardMapping";
import PrivateRoute from "./pages/login/PrivateRoute";
import History from "./pages/profile-screens/profileActionHistory/ProfileActionHistory";
import UserProfile from "./pages/profile-screens/profileMenu/ProfileMenu";


function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/volunteer-registration" element={<VolunteerRegistration />} />
                <Route path="/institute-registration" element={<InstituteRegistration />} />
                <Route path="/action-history/:mappingId" element={<History />} />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/dashboard-mapping" element={
                    <PrivateRoute>
                        <DashboardMapping />
                    </PrivateRoute>
                } />
                <Route path="/profileMenu" element={
                    <PrivateRoute>
                        <UserProfile />
                    </PrivateRoute>
                }>
                </Route>
                <Route path="/institute-list" element={<InstituteList />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;
