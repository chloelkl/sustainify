import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { user, admin, role, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user && !admin) {
        return <Navigate to="/account/login" />;
    }

    if (roles && !roles.includes(role)) {
        return role === 'admin' ? <Navigate to="/account/admin/main" /> : <Navigate to="/account/user/main" />;
    }

    return children;
};

export default ProtectedRoute;