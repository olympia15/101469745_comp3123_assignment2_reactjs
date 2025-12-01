import React from 'react';
import { Navigate } from 'react-router-dom';

// component to protect private routes
function PrivateRoute({ children }) {

    const user = localStorage.getItem('user');

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;