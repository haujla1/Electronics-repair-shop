import React, {useContext, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import axios from "axios";
import AddDevice from './addDevice.jsx'
import DeviceCard from "./deviceCard.jsx";

import {
    Grid
  } from '@mui/material';


function Devices({clientId}){
    let [devices, setDevices] = useState([]);
    let [loading, setLoading] = useState(true);
    let [showAddDevice, setShowAddDevice] = useState(false)

    useEffect(() => {
        async function getDevices(clientId) {
            try {
                let { data } = await axios.get(`http://localhost:3000/clients/${clientId}`);
                console.log(data.Devices);
                setDevices(data.Devices);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        getDevices(clientId);
    }, []);

    function openAddDevice(){
        setShowAddDevice(true)
    }

    function closeAddDevice(){
        setShowAddDevice(false)
    }

    function updateDevices(newDevice){
        let newList = [...devices]
        newList.push(newDevice)
        setDevices(newList)
    }

    return (
        <>
            <h3>Devices</h3>
            <div>
                {
                    loading
                        ? (
                            <div>
                                <h4>Loading Devices...</h4>
                            </div>
                        )
                        : (
                            devices.length > 0
                                ?
                                    <Grid container spacing={0}
                                    style={{display: "flex", "flexFlow": "row wrap"}}
                                    >
                                        {devices.map(device => {
                                            return (
                                                <Grid marginTop={"auto"} item xs key={device._id}> <DeviceCard device={device} clientId={clientId} /> </Grid>
                                            );
                                        })}
                                    </ Grid>
                                :
                                    (
                                        <>
                                            <h4>No Devices Found</h4>
                                        </>
                                    )
                        )
                }
            </div>

            <br/>

            <button onClick={openAddDevice}>Add Device</button>
            {showAddDevice && <AddDevice clientId={clientId} isOpen={showAddDevice} handleClose={closeAddDevice} updateDevices={updateDevices}/>}

        </>
    )
}


export default Devices