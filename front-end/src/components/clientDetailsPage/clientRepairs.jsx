import React, {useContext, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import axios from "axios";
// import AddRepair from './addRepair.jsx'
import RepairCard from "../repairCard";
import {
    Grid
  } from '@mui/material';


function Repairs({clientId}){
    let [repairs, setRepairs] = useState([]);
    // let [device, setDevice] = useState(null);
    let [loading, setLoading] = useState(true);
    let [showAddRepair, setShowAddRepair] = useState(false)

    useEffect(() => {
        async function getRepairs(clientId) {
            try {
                let { data } = await axios.get(`http://localhost:3000/clients/${clientId}`);
                
                // console.log(data.Repairs);
                setRepairs(data.Repairs);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        getRepairs(clientId);
    }, []);

    return (
        <>
            <h3>Repair History</h3>

            <div>
                {
                    loading
                        ? (
                            <div>
                                <h4>Loading Repairs...</h4>
                            </div>
                        )
                        : (
                            repairs && repairs.length > 0
                                ?
                                    <Grid container>
                                    {
                                        repairs.map(repair => {
                                            return (
                                                <Grid item key={repair._id}><RepairCard repair={repair} /></Grid>
                                            );
                                        })
                                    }
                                    </ Grid>
                                :
                                    (
                                        <>
                                            <h4>No Repairs Found</h4>
                                        </>
                                    )
                        )
                }
            </div>

        </>
    )
}


export default Repairs