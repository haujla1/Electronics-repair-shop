import React, {useContext} from "react";
import { Route, Link, Routes} from 'react-router-dom';
import { AuthContext } from "../context/authContext";
import SignOut from "./signOut"
import Nav from "./navBar";




function Home(){
    const {currentUser, role} = useContext(AuthContext)
    
    //only if the current user is the admin
    return (
        <>
        <Nav pagename="Home"/>
        <p>Bodybodybody</p>
        </>
        // <>
        //     <h1>{"Hello " + currentUser.displayName + " (" + role + ")"}</h1>
        //     <SignOut />
        //     <Link to='/adminTools'>Admin Tools</Link> 
        // </>
    )
}

export default Home