import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ admin, setAdmin ] = useState(null);
    const [ role, setRole ] = useState(null);
    const [ authToken, setAuthToken ] = useState(localStorage.getItem('token'));
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

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
                        setRole('admin');
                    } else {
                        setUser(response.data);
                        setRole('user');
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error during verification:', error);
                    logout();
                    setLoading(false);
                });
        } else {
            setUser(null);
            setAdmin(null);
            setRole(null);
            setLoading(false);
        }
    }, [authToken]);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthToken(token);

        setUser(null);
        setAdmin(null);

        if (userData.role === 'admin') {
            setAdmin(userData);
            setRole('admin');
            navigate('/account/admin/main');
        } else {
            setUser(userData);
            setRole('user');
            navigate('/account/user/main');
        }
    };

    const logout = () => {
        console.log('Logging out');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setAdmin(null);
        setRole(null);
        setAuthToken(null);
        navigate('/account/login');
    };

    return (
        <AuthContext.Provider value={{ user, admin, role, authToken, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};