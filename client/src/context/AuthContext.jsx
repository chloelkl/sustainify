import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get(`${import.meta.env.VITE_API_URL}/auth/verify`)
                .then(response => {
                    if (response.data.role === 'admin') {
                        setAdmin(response.data.admin);
                    } else {
                        setUser(response.data.user);
                    }
                    setRole(response.data.role);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, []);

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
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setAdmin(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, admin, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
