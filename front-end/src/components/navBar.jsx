import React, {useContext} from "react";
import { Route, Link, Routes} from 'react-router-dom';
import { AuthContext } from "../context/authContext";
import SignOut from "./signOut"

function Nav({pagename}){
    const {currentUser, role} = useContext(AuthContext)

    return (
        <div className="header">
            <h1 style={{display : 'inline-block'}}>{pagename}</h1>
            <br />
            <h2 style={{display : 'inline-block'}}>Company Name</h2>
            <h2 style={{display : 'inline-block'}}>{currentUser.displayName}</h2>

            <nav>
                <ul>
                    <li>{role == "Admin"?<Link to='/adminTools' style={{display : 'inline-block'}}>Admin Tools</Link>:<></>}</li>
                    <li><Link to="/">Home</Link></li>
                    <li><SignOut /></li>
                </ul>
            </nav>
        </div>
    )
}

export default Nav