import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from 'react-router-dom';
import Nav from "../navBar";
import Devices from "./clientDevices";



function ClientDetails(){
    let {clientId} = useParams()
    return (
        <>
            <Nav pagename="Client Info"/>
            <p>Client Info Here</p>
            <p>Client Id: {clientId}</p>
            
            <Devices clientId={clientId} />
        </>
        
    )
}


export default ClientDetails