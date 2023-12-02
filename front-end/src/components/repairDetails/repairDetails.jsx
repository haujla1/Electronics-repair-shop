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


    return (
        <>
            <Nav pagename="Repair Info"/>
            <h3>Repair Info</h3>
            <dt>
                {Object.keys(repair).map(x=><><dl>{x}</dl><dd>{repair[x]}</dd></>)}
            </dt>
            

        </>
        
    )
}


export default RepairDetails