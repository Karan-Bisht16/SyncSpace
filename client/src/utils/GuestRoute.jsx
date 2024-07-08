import React from "react"
import { Navigate } from "react-router-dom";

const GuestRoute = (props) => {
    const { Component, user } = props;
    return !user ? <Component user={user} /> : <Navigate to="/" />
};

export default GuestRoute;