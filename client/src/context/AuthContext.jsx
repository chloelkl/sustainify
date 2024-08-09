import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner.jsx';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ admin, setAdmin ] = useState(null);
    const [ role, setRole ] = useState(null);
    const [ authToken, setAuthToken ] = useState(localStorage.getItem('token'));
    const [ isLoading, setIsLoading ] = useState(false);
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
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error during verification:', error);
                    logout();
                    setIsLoading(false);
                });
        } else {
            setUser(null);
            setAdmin(null);
            setRole(null);
            setIsLoading(false);
        }
    }, [authToken]);

    const login = async (token, userData) => {
        setIsLoading(true); // Show spinner after validation
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthToken(token);
    
        setUser(null);
        setAdmin(null);
    
        setTimeout(() => {
            if (userData.role === 'admin') {
                setAdmin(userData);
                setRole('admin');
                setIsLoading(false); // Hide spinner before redirect
                navigate('/account/admin/main');
            } else {
                setUser(userData);
                setRole('user');
                setIsLoading(false); // Hide spinner before redirect
                navigate('/account/user/main');
            }
        }, 1000);
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
        <AuthContext.Provider value={{ user, admin, role, authToken, isLoading, login, logout }}>
            {children}
            {isLoading && <Spinner />}
        </AuthContext.Provider>
    );
};