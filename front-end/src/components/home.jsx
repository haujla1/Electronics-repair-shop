import React, {useContext} from "react";
import { Route, Link, Routes} from 'react-router-dom';
import { AuthContext } from "../context/authContext";
import SignOut from "./signOut"



function Home(props){
    const {currentUser} = useContext(AuthContext)

    return (
        <>
            <h1>{"Hello " + currentUser.displayName}</h1>
            <SignOut />
        </>
    )
}

export default Home