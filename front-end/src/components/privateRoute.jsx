import { Navigate, Outlet } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";


const privateRoute = () => {
    const {currentUser} = useContext(AuthContext)

    return currentUser ? <Outlet /> : <Navigate to='/login' replace={true}/>
}

export default privateRoute