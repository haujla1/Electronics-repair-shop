import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from 'react-router-dom';
import Nav from "../navBar";
import axios from "axios"




function RepairDetails(){
    let {repairId} = useParams()
    let [repair, setRepair] = useState(null)
    let [loading, setLoading] = useState(true)

    useEffect(()=>{
        async function getRepair() {
            try{
                let data = (await axios("http://localhost:3000/repairs/"+repairId)).data
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
            <h3>404 Error: Repair Not Found (id:{repairId})</h3>
        </>)
    }

    async function repairComplete(e){
        e.preventDefault()
        return
    }

    async function pickUpComplete(e){
        e.preventDefault()
        return
    }

    return (
        <>
            <Nav pagename="Repair Info"/>
            <h3>Repair Info</h3>

            <dl>
                <dt>Repair ID:</dt> <dd>{repair["_id"]}</dd>
                <dt>Device ID:</dt><dd> {repair["deviceID"]}</dd>
                <dt>Client:</dt><dd> <Link to={'/clientDetails/' + repair["clientID"]}>{repair["clientID"]}</Link></dd>
                <dt>Client Email:</dt><dd> <a href={"mailto:" + repair["clientPreferredEmail"]}>{repair["clientPreferredEmail"]}</a></dd>
                <dt>Work Order Opened:</dt> <dd>{new Date(repair["repairOrderCreationDate"]).toLocaleString()}</dd>
                <dt>Issue:</dt> <dd> {repair["issue"]}</dd>
                <dt>Issue Verified:</dt> <dd> {String(repair["wasIssueVerified"])}</dd>
                <dt>Verification Reason:</dt> <dd> {repair["stepsTakenToReplicateIssue"]}</dd>
                <dt>Repairs:</dt> <dd> {repair["workToBeDone"]}</dd>
                <dt>Device Condition:</dt> <dd> {repair["conditionOfDevice"]}</dd>
                <dt>Repair Status:</dt> <dd> {repair["repairStatus"]}</dd>
                
                {repair["repairCompletionDate"]?<>
                <dt>Repairs Completed:</dt> <dd> {new Date(repair["repairCompletionDate"]).toLocaleString()}</dd>
                <dt>Repair Notes:</dt> <dd> {repair["repairTechnicianNotes"]}</dd>
                <dt>Repair Success:</dt> <dd> {String(repair["wasTheRepairSuccessful"])}</dd>
                </>:<></>}


                {repair["isDevicePickedUpAlready"]?<>
                <dt>Picked Up:</dt> <dd> {new Date(repair["pickupDate"]).toLocaleString()}</dd>
                <dt>Pick Up Notes:</dt> <dd> {repair["pickupNotes"]}</dd>
                <dt>Pick Up Demo:</dt> <dd> {String(repair["pickupDemoDone"])}</dd>
                </>:<></>}

                
            </dl>

            {repair["repairCompletionDate"]?
            <form className='form' onSubmit={repairComplete}>
                <div>
                    <label>
                      Repair Completed:
                      <input 
                        name='repairCompleted'
                        id='repairCompleted'
                        type='datetime-local'
                        defaultValue = {new Date().toISOString().slice(0, -1)}
                      />
                    </label>
                    <br />
                    <label>
                      Notes:
                      <textarea 
                        name='TechNotes'
                        id='TechNotes'
                        placeholder = "Repair Notes"
                      />
                    </label>
                    <br />
                    <label>
                      Repair Successful:
                      <input 
                        name='repairSuccess'
                        id='repairSuccess'
                        type='checkbox'
                      />
                    </label>
                    <br />

                    
                  </div>
                  <button type='submit'>
                    Complete Repair
                  </button>
            </form>
            :<></>}



            {!repair["isDevicePickedUpAlready"]?
                        <form className='form' onSubmit={pickUpComplete}>
                            <div>
                                <label>
                                Picked Up:
                                <input 
                                    name='pickupCompleted'
                                    id='pickupCompleted'
                                    type='datetime-local'
                                    defaultValue = {new Date().toISOString().slice(0, -1)}
                                />
                                </label>
                                <br />
                                <label>
                                Notes:
                                <textarea 
                                    name='pickupNotes'
                                    id='pickupNotes'
                                    placeholder = "Pick Up Notes"
                                />
                                </label>
                                <br />
                                <label>
                                Pick Up Demo:
                                <input 
                                    name='pickupDemo'
                                    id='pickupDemo'
                                    type='checkbox'
                                />
                                </label>
                                <br />

                                
                            </div>
                            <button type='submit'>
                                Picked Up
                            </button>
                        </form>
                        :<></>}

            

        </>
        
    )
}


export default RepairDetails