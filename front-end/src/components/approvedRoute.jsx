import { Navigate, Outlet } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";


const privateRoute = () => {
    const {currentUser, role} = useContext(AuthContext)

    if(role == "Admin" || role == "Technician"){
        return <Outlet />
    }else{
        return <Navigate to='/login' replace={true}/>
    }

}

export default privateRoute