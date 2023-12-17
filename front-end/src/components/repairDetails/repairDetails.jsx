import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from 'react-router-dom';
import Nav from "../navBar";
import axios from "axios"

import Edit from "./editModal.jsx";
import Complete from './completeModal.jsx'
import PickUp from './pickupModal.jsx'



function RepairDetails(){
    let {repairId} = useParams()
    let [repair, setRepair] = useState(null)
    let [loading, setLoading] = useState(true)
    let [showEdit, setShowEdit] = useState(false)
    let [showComplete, setShowComplete] = useState(false)
    let [showPickup, setShowPickup] = useState(false)

    function openEdit(){
        setShowEdit(true)
    }

    function closeEdit(){
        setShowEdit(false)
    }

    function openComplete(){
        setShowComplete(true)
    }

    function closeComplete(){
        setShowComplete(false)
    }

    function openPickup(){
        setShowPickup(true)
    }

    function closePickup(){
        setShowPickup(false)
    }

    useEffect(()=>{
        async function getRepair() {
            try{
                let data = (await axios("http://localhost:3000/repairs/"+repairId)).data
                
                
                //get the client for the name and for the device name
                let client = (await axios.get("http://localhost:3000/clients/" + data.clientID)).data
                data["clientName"] = client.name
                let device = client.Devices.filter(x=>x._id == data.deviceID)[0]
                data["deviceName"] = device.manufacturer + " " + device.modelName

                // console.log(data)
                setRepair(data)

            }catch(e){
                console.log(e)
            }
            setLoading(false)
        }

        getRepair()

    }, [repairId])

    if(loading){
        return(<>
            <Nav pagename="Repair Info"/>
            <h3>Loading</h3>
        </>)
    }

    if(!repair){
        return(<>
            <Nav pagename="Repair Info"/>
            <h3 className="error">404 Error: Repair Not Found (id:{repairId})</h3>
        </>)
    }


    return (
        <>
            <Nav pagename="Repair Info"/>
            <br />
            {/* {!repair["repairCompletionDate"] ? <button style={{backgroundColor: 'rgb(34, 191, 40)'}} onClick={openComplete}>Complete Repair</button>: <></>}
            {showComplete && <>
            <Complete isOpen={showComplete} repair={repair} handleClose={closeComplete} update={setRepair}/>
            </>} */}

            {/* {repair["repairCompletionDate"] && !repair["pickupDemoDone"] ? <button onClick={openPickup}>Process Pickup</button>: <></>}
            {showPickup && <>
            <PickUp isOpen={showPickup} repair={repair} handleClose={closePickup} update={setRepair}/>
            </>} */}

            {/* <h3>Repair Info</h3> */}
            {/* <br /> */}
            {/* <button onClick={openEdit}>Edit</button> */}
            {/* {showEdit && <Edit isOpen={showEdit} handleClose={closeEdit} repair={repair}/>} */}

            
                <h3>General Info</h3>
            <dl>
                <dt>Repair ID:</dt> <dd>{repair["_id"]}</dd>
                <dt>Device ID:</dt><dd> {repair["deviceID"]}</dd>
                <dt>Device Name:</dt><dd> {repair["deviceName"]}</dd>
                <dt>Client:</dt><dd> <Link to={'/clientDetails/' + repair["clientID"]}>{repair["clientName"]?repair["clientName"]:repair["clientID"]}</Link></dd>
                <dt>Client Email:</dt><dd> <a href={"mailto:" + repair["clientPreferredEmail"]}>{repair["clientPreferredEmail"]}</a></dd>
                <dt>Work Order Opened:</dt> <dd>{new Date(repair["repairOrderCreationDate"]).toLocaleDateString()}</dd>
                <dt>Issue:</dt> <dd> {repair["issue"]}</dd>
                <dt>Issue Verified:</dt> <dd> {repair["wasIssueVerified"]?"Yes":"No"}</dd>
                <dt>Verification Reason:</dt> <dd> {repair["stepsTakenToReplicateIssue"]}</dd>
                <dt>Repairs:</dt> <dd> {repair["workToBeDone"]}</dd>
                <dt>Device Condition:</dt> <dd> {repair["conditionOfDevice"]}</dd>
                <dt>Repair Status:</dt> <dd> {repair["repairStatus"]}</dd>
            </dl>
                
                {repair["repairCompletionDate"]?<>
                <h3>Repair Completed</h3>
                <dl>
                <dt>Repairs Completed:</dt> <dd> {new Date(repair["repairCompletionDate"]).toLocaleDateString()}</dd>
                <dt>Repair Notes:</dt> <dd> {repair["repairTechnicianNotes"]}</dd>
                <dt>Repair Success:</dt> <dd> {repair["wasTheRepairSuccessful"]?"Yes":"No"}</dd>
                </dl>
                </>:<></>}


                {repair["pickupDate"]?<>
                <h3>Pick Up</h3>
                <dl>
                <dt>Picked Up:</dt> <dd> {new Date(repair["pickupDate"]).toLocaleDateString()}</dd>
                <dt>Pick Up Notes:</dt> <dd> {repair["pickupNotes"]}</dd>
                <dt>Pick Up Demo:</dt> <dd> {repair["pickupDemoDone"]?"Yes":"No"}</dd>
                </dl>
                </>:<></>}
                {!repair["repairCompletionDate"] ? <button style={{backgroundColor: 'rgb(34, 191, 40)'}} onClick={openComplete}>Complete Repair</button>: <></>}
            {showComplete && <>
            <Complete isOpen={showComplete} repair={repair} handleClose={closeComplete} update={setRepair}/>
            </>}

                {repair["repairCompletionDate"] && !repair["pickupDate"] ? <button style={{backgroundColor: 'rgb(34, 191, 40)'}} onClick={openPickup}>Process Pickup</button>: <></>}
            {showPickup && <>
            <PickUp isOpen={showPickup} repair={repair} handleClose={closePickup} update={setRepair}/>
            </>}


                
            

        </>
        
    )
}


export default RepairDetails