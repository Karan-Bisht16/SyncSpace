import React from "react"
import { Navigate } from "react-router-dom";

const GuestRoute = (props) => {
    const { Component, user, ...rest } = props;
    return !user ? <Component user={user} {...rest} /> : <Navigate to="/" />
};

export default GuestRoute;