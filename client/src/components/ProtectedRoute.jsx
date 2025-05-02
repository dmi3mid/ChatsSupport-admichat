import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Redirect to auth page but save the attempted url
        return <Navigate to="/regist" state={{ from: location }} replace />;
    }

    return children;
} 