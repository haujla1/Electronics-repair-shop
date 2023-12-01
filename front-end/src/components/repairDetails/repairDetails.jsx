import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from 'react-router-dom';
import Nav from "../navBar";




function RepairDetails(){
    let {repairId} = useParams()
    return (
        <>
            <Nav pagename="Repair Info"/>
            <p>Repair Id: {repairId}</p>
            
        </>
        
    )
}


export default RepairDetails