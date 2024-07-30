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
        console.log('Retrieved token from local storage:', token); // Debugging line

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Authorization header set:', axios.defaults.headers.common['Authorization']); // Debugging line

            axios.get(`${import.meta.env.VITE_API_URL}/auth/verify`)
                .then(response => {
                    console.log('Verification response:', response.data); // Debugging line

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
    }, []);

    const login = (token, user) => {
        console.log('Logging in with token:', token); // Debugging line
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Authorization header set during login:', axios.defaults.headers.common['Authorization']); // Debugging line

        if (user.role === 'admin') {
            setAdmin(user);
        } else {
            setUser(user);
        }
        setRole(user.role);
    };

    const logout = () => {
        console.log('Logging out'); // Debugging line
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
