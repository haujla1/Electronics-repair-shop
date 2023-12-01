import React, {useContext} from "react";
import { Route, Link, Routes} from 'react-router-dom';
import { AuthContext } from "../../context/authContext";
import SignOut from "../signOut"
import Nav from "../navBar";

import SearchBar from "./search";
import ActiveWorkorders from "./activeWorkorders";
import ReadyForPickup from "./readyForPickup";




function Home(){
    const {currentUser, role} = useContext(AuthContext)
    
    //only if the current user is the admin
    return (
        <>
        <Nav pagename="Home"/>
        <SearchBar />
        <ActiveWorkorders />
            <Link to='/repair/789789'>Example Repair Info Link</Link>
        <ReadyForPickup />
        </>
        
    )
}

export default Home