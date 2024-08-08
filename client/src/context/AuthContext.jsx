import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ admin, setAdmin ] = useState(null);
    const [ role, setRole ] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify`);
                    console.log('Verification response:', response.data);

                    if (response.data.role === 'admin') {
                        setAdmin(response.data);
                    } else {
                        setUser(response.data);
                    }
                    setRole(response.data.role);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Error during verification:', error.response || error.message);
                    logout();
                }
            }
            setIsLoading(false);
        };

        verifyToken();
    }, []);    

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        if (userData.role === 'admin') {
            setAdmin(userData);
            setUser(null);
        } else {
            setUser(userData);
            setAdmin(null);
        }
        setRole(userData.role);
        setIsAuthenticated(true);
    };

    const logout = () => {
        console.log('Logging out');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setAdmin(null);
        setRole(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, admin, role, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
