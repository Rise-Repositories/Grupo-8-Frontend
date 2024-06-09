import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function RequireAuth({children}) {
    let location = useLocation();
    let navigate = useNavigate();

    useEffect(() => {
        let auth = sessionStorage.getItem("USER_TOKEN")
        if (!auth) {
            return navigate('/login');
        }
    });
    return children;
}

export default RequireAuth;