import React, {useContext, useEffect, useState} from "react";
import {Link} from 'react-router-dom';


function Devices({clientId}){
    return (
        <>
            <h3>Devices</h3>
            <p>Devices for {clientId} here</p>
            <p>Cards for each device, with image or stock image of device type (i.e. if iphone 8 get a pic of iphone 8 somehow). Then when clicked on opens the modal with repair history (and links to full repair info) and button to create a new repair.</p>
            <p>For now use this to get to new repair</p>
            <Link to={`/newRepair/${clientId}/456456`}>New Repair</Link>
            <br/>

            <button>Add Device Modal</button>

        </>
    )
}


export default Devices