import React, {useContext} from "react";
import { Route, Link, Routes} from 'react-router-dom';
import { AuthContext } from "../context/authContext";
import SignOut from "./signOut"

function Nav({pagename}){
    const {currentUser, role} = useContext(AuthContext)

    return (
        <nav>
            <h1 style={{display : 'inline-block'}}>{pagename}</h1>
            <h2 style={{display : 'inline-block'}}>Company Name</h2>
            <h2 style={{display : 'inline-block'}}>{currentUser.displayName}</h2>
            {role == "Admin"?<Link to='/adminTools' style={{display : 'inline-block'}}>Admin Tools</Link>:<></>}
            <SignOut />
        </nav>
    )
}

export default Nav