import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from 'react-router-dom';
import Nav from "../navBar";




function NewRepair(){
    let {clientId, deviceId} = useParams()
    return (
        <>
            <Nav pagename="New Repair"/>
            <p>Client Id: {clientId}, Device Id: {deviceId}</p>

        </>
        
    )
}


export default NewRepair