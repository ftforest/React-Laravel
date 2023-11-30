import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    const setAuthToken = (newToken) => {
        setToken(newToken);
    };

    useEffect(() => {
        // Здесь могут быть дополнительные действия при изменении токена
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
};
