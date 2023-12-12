import React, {useContext, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import axios from "axios";
import stockAndroidImg from '../../assets/stock-android-image.webp';
import stockIphoneImg from '../../assets/stock-iphone-image.jpeg';
// import AddRepair from './addRepair.jsx'


function Repairs({clientId}){
    let [repairs, setRepairs] = useState([]);
    // let [device, setDevice] = useState(null);
    let [loading, setLoading] = useState(true);
    let [showAddRepair, setShowAddRepair] = useState(false)

    useEffect(() => {
        async function getRepairs(clientId) {
            try {
                let { data } = await axios.get(`http://localhost:3000/clients/${clientId}`);
                console.log(data.Repairs);
                setRepairs(data.Repairs);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        getRepairs(clientId);
    }, []);

    function openAddRepair(){
        setShowAddRepair(true)
    }

    function closeAddRepair(){
        setShowAddRepair(false)
    }

    function updateRepairs(newRepair){
        let newList = [...repairs]
        newList.push(newRepair)
        setRepairs(newList)
    }

    return (
        <>
            <h3>Repairs</h3>
            {/* <p>Repairs for {repairId} here</p>
            <p>Cards for each repair, with image or stock image of repair type (i.e. if iphone 8 get a pic of iphone 8 somehow). Then when clicked on opens the modal with repair history (and links to full repair info) and button to create a new repair.</p> */}

            <div>
                {
                    loading
                        ? (
                            <div>
                                <h4>Loading Repairs...</h4>
                            </div>
                        )
                        : (
                            repairs.map(repair => {
                                return (
                                    <div className="card" key={repair._id}>
                                        <h3>{repair.issue}</h3>
                                        <dl>
                                            <dt>Was Issue Verified?</dt>
                                            <dd>
                                                {
                                                    repair.wasIssueVerified
                                                        ? "Yes"
                                                        : "No"
                                                }
                                            </dd>

                                            <dt>Steps Taken to Replicate Issue:</dt>
                                            <dd>{repair.stepsTakenToReplicateIssue}</dd>

                                            <dt>Device:</dt>
                                            <dd>{repair.deviceID}</dd>

                                            <dt>Work to Be Done:</dt>
                                            <dd>{repair.workToBeDone}</dd>

                                            <dt>Condition of Device:</dt>
                                            <dd>{repair.conditionOfDevice}</dd>

                                            <dt>Repair Status:</dt>
                                            <dd>{repair.repairStatus}</dd>

                                            <dt>Order Creation Date:</dt>
                                            <dd>{new Date(repair.repairOrderCreationDate).toLocaleString()}</dd>

                                            {
                                                repair.repairStatus === 'Completed' ||
                                                repair.repairStatus === 'Picked-up'
                                                    ? 
                                                        (
                                                            <>
                                                                <dt>Technician Notes:</dt>
                                                                <dd>{repair.repairTechnicianNotes}</dd>

                                                                <dt>Completion Date:</dt>
                                                                <dd>{new Date(repair.repairCompletionDate).toLocaleString()}</dd>

                                                                <dt>Was the Repair Successful?</dt>
                                                                <dd>
                                                                    {
                                                                        repair.wasTheRepairSuccessful
                                                                            ? "Yes"
                                                                            : "No"
                                                                    }
                                                                </dd>

                                                                {
                                                                    repair.repairStatus === 'Completed'
                                                                        ?
                                                                            (
                                                                                <>
                                                                                    <dt>Was Picked Up Already?</dt>
                                                                                    <dd>No</dd>

                                                                                    <dt>Was the Pick-up Demo Done?</dt>
                                                                                    <dd>No</dd>
                                                                                </>
                                                                            )
                                                                        : (<></>)
                                                                }
                                                            </>
                                                        )
                                                    : (<></>)
                                            }

                                            {
                                                repair.repairStatus === 'Picked-up'
                                                    ? 
                                                        (
                                                            <>
                                                                <dt>Was Picked Up Already?</dt>
                                                                <dd>Yes</dd>

                                                                <dt>Was the Pick-up Demo Done?</dt>
                                                                <dd>
                                                                    {
                                                                        repair.pickupDemoDone
                                                                            ? "Yes"
                                                                            : "No"
                                                                    }
                                                                </dd>

                                                                <dt>Pick-up Notes:</dt>
                                                                <dd>{repair.pickupNotes}</dd>

                                                                <dt>Pick-up Date:</dt>
                                                                <dd>{new Date(repair.pickupDate).toLocaleString()}</dd>
                                                            </>
                                                        )
                                                    : 
                                                        (<></>)
                                            }

                                        </dl>
                                    </div>
                                );
                            })
                        )
                }
            </div>

        </>
    )
}


export default Repairs