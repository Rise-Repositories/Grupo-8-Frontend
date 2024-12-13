import React, { createContext, useState, useEffect } from 'react';
import api from '../../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('USER_TOKEN');
        if (token) {
            setAuthToken(token);
        }
    }, []);

    const login = async (token) => {
        setAuthToken(token);
        sessionStorage.setItem('USER_TOKEN', token);
        const Authorization = 'Bearer ' + token;
        await api.get('/user/account', {headers: { Authorization }})
            .then(res => {
                if (res.data.voluntary.length > 0) {
                    sessionStorage.setItem("CUR_ONG", res.data.voluntary[0].ong.name);
                } else {
                    sessionStorage.setItem("CUR_ONG", null);
                }
            });
    };

    const logout = () => {
        setAuthToken(null);
        sessionStorage.removeItem('USER_TOKEN');
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
