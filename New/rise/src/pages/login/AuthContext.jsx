import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('USER_TOKEN');
        if (token) {
            setAuthToken(token);
        }
    }, []);

    const login = (token) => {
        setAuthToken(token);
        sessionStorage.setItem('USER_TOKEN', token);
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
