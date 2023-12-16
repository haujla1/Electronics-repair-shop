import React, {useContext, useEffect, useState} from "react";
import { Route, Link, Routes} from 'react-router-dom';
import { AuthContext } from "../../context/authContext";
import SignOut from "../signOut"
import Nav from "../navBar";

import SearchBar from "./search";
import ActiveWorkorders from "./activeWorkorders";
import ReadyForPickup from "./readyForPickup";

import axios from 'axios'

import RepairCard from "../repairCard";

import {
    Grid
  } from '@mui/material';



function Home(){
    const {currentUser, role} = useContext(AuthContext)
    const [active, setActive] = useState([])
    const [pickUp, setPickUp] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    

    useEffect(()=>{
        async function getWOs(){
            setError("")
            try{
                let actives = await(await axios.get("http://localhost:3000/repairs/activeRepairs")).data
                let pickups = await(await axios.get("http://localhost:3000/repairs/readyForPickupRepairs")).data

                //get device client name and device name for each
                if(actives){
                    for (let i = 0; i<actives.length; i++){
                        if(!actives[i]){
                            continue
                        }
                        let client = (await axios.get("http://localhost:3000/clients/" + actives[i].clientID)).data
                        actives[i]["clientName"] = client.name
                        let device = client.Devices.filter(x=>x._id == actives[i].deviceID)[0]
                        actives[i]["deviceName"] = device.manufacturer + " " + device.modelName
                    }
                    setActive(actives)
                }

                if(pickups){
                    for (let i = 0; i<pickups.length; i++){
                        let client = (await axios.get("http://localhost:3000/clients/" + pickups[i].clientID)).data
                        pickups[i]["clientName"] = client.name
                        let device = client.Devices.filter(x=>x._id == pickups[i].deviceID)[0]
                        pickups[i]["deviceName"] = device.manufacturer + " " + device.modelName
                    }
                    setPickUp(pickups)
                }

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
                {active.length != 0 ? 
                <Grid container >
                {active.map(wo => <Grid marginTop={"auto"} item xs key={wo._id}> <RepairCard repair={wo} deviceName={wo.clientName + "'s " + wo.deviceName}/> </Grid> )}
                </Grid>
                : <h4>No Active Workorders</h4>}

            </div>
            <div className="readyForPickupWorkorders">
                <h3>Ready for Pickup</h3>
                {pickUp.length != 0 ? 
                <Grid container >
                {pickUp.map(wo => <Grid marginTop={"auto"} item xs key={wo._id}> <RepairCard repair={wo} deviceName={wo.clientName + "'s " + wo.deviceName}/> </Grid> )}
                </Grid>
                : <h4>No Ready to Pickup Devices</h4>}
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