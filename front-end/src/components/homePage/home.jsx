import React, {useContext, useEffect, useState} from "react";
import { Route, Link, Routes} from 'react-router-dom';
import { AuthContext } from "../../context/authContext";
import SignOut from "../signOut"
import Nav from "../navBar";

import SearchBar from "./search";
import ActiveWorkorders from "./activeWorkorders";
import ReadyForPickup from "./readyForPickup";

import axios from 'axios'



function Home(){
    const {currentUser, role} = useContext(AuthContext)
    const [active, setActive] = useState([])
    const [pickUp, setPickUp] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    

    useEffect(()=>{
        async function getWOs(){
            try{
                let actives = (await axios.get("http://localhost:3000/repairs/activeRepairs")).data
                setActive(actives)
                let pickups = (await axios.get("http://localhost:3000/repairs/readyForPickupRepairs")).data
                setPickUp(pickups)
                setLoading(false)
            }catch(e){
                setLoading(false)
                console.log(e)
                setError(String(e))
            }
        }
        getWOs()
    },[])
    //only if the current user is the admin
    return (
        <>
        <Nav pagename="Home"/>
        <SearchBar />

        {loading? <h3>Loading Workorders</h3>:
        error? <><h3>Error Fetching Work Orders</h3><p>{error}</p></>:
        <>
            <div className="activeWorkorders">
                <h3>Active Workorders</h3>
                <ul>
                    {active.map(wo => <li key={wo._id}><Link to={'/repair/'+wo._id}>{wo._id}</Link></li>)}
                </ul>
            </div>
            <div className="readyForPickupWorkorders">
                <h3>Ready for Pickup</h3>
                <ul>
                    {pickUp.map(wo => <li key={wo._id}><Link to={'/repair/'+wo._id}>{wo._id}</Link></li>)}
                </ul>
            </div>
        </>
        }

        {/* <ActiveWorkorders />
            <Link to='/repair/655823ffd08fbef35544267f'>Example Repair Info Link</Link>
        <ReadyForPickup /> */}
        </>
        
    )
}

export default Home