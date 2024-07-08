import React from "react"
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props) => {
    const { Component, user } = props;
    return user ? <Component user={user} /> : <Navigate to="/authentication" />
};

export default ProtectedRoute;