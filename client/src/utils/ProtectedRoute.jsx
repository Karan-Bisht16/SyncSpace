import React from "react"
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props) => {
    const { Component, user, ...rest } = props;
    return user ? <Component user={user} {...rest} /> : <Navigate to="/authentication" />
};

export default ProtectedRoute;