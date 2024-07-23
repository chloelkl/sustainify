import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { user, admin, role } = useAuth();

    if (!user && !admin) {
        return <Navigate to="/account/login" />;
    }

    if (roles && !roles.includes(role)) {
        return <Navigate to="/account/login" />;
    }

    return children;
};

export default ProtectedRoute;
