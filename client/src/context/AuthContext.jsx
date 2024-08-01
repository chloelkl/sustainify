import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ admin, setAdmin ] = useState(null);
    const [ role, setRole ] = useState(null);
    const [ authToken, setAuthToken ] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Retrieved token from local storage:', token);

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Authorization header set:', axios.defaults.headers.common['Authorization']);

            axios.get(`${import.meta.env.VITE_API_URL}/auth/verify`)
                .then(response => {
                    console.log('Verification response:', response.data);

                    if (response.data.role === 'admin') {
                        setAdmin(response.data);
                    } else {
                        setUser(response.data);
                    }
                    setRole(response.data.role);
                })
                .catch(error => {
                    console.error('Error during verification:', error);
                });
        }   
    }, [authToken]);

    const login = (token, user) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        if (user.role === 'admin') {
            setAdmin(user);
        } else {
            setUser(user);
        }
        setRole(user.role);
    };

    const logout = () => {
        console.log('Logging out');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setAdmin(null);
        setRole(null);
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, admin, role, authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
