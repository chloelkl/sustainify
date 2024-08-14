import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Spinner from '../components/Spinner.jsx';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem('admin')) || null);
    const [role, setRole] = useState(localStorage.getItem('role') || null);
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            axios.get(`${import.meta.env.VITE_API_URL}/auth/verify`)
                .then(response => {
                    console.log('Verification response:', response.data);

                    if (response.data.role === 'admin') {
                        setAdmin(response.data);
                        setRole('admin');
                        localStorage.setItem('admin', JSON.stringify(response.data));
                        localStorage.setItem('role', 'admin');
                    } else {
                        setUser(response.data);
                        setRole('user');
                        localStorage.setItem('user', JSON.stringify(response.data));
                        localStorage.setItem('role', 'user');
                    }
                    setIsLoading(false);

                    // Redirect to saved path if available
                    const savedPath = localStorage.getItem('savedPath');
                    if (savedPath) {
                        navigate(savedPath, { replace: true });
                        localStorage.removeItem('savedPath'); // Clear saved path after navigating
                    }
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

    useEffect(() => {
        // Save the current path in localStorage on route change
        if (location.pathname) {
            localStorage.setItem('savedPath', location.pathname);
        }
    }, [location.pathname]);

    const login = async (token, user) => {
        setIsLoading(true); // Show spinner after validation
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthToken(token);
    
        setUser(null);
        setAdmin(null);
    
        setTimeout(() => {
            if (user.role === 'admin') {
                setAdmin(user);
                setRole('admin');
                localStorage.setItem('admin', JSON.stringify(user));
                localStorage.setItem('role', 'admin');
                setIsLoading(false); // Hide spinner before redirect
                navigate('/account/admin/main');
            } else {
                setUser(user);
                setRole('user');
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('role', 'user');
                setIsLoading(false); // Hide spinner before redirect
                navigate('/account/user/main');
            }
        }, 1000);
    };

    const logout = () => {
        console.log('Logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        localStorage.removeItem('role');
        localStorage.removeItem('savedPath'); // Clear saved path on logout
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
