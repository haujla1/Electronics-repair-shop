import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from 'react-router-dom';
import Nav from "../navBar";
import Devices from "./clientDevices";
import Repairs from "./clientRepairs";
import axios from "axios";



function ClientDetails(){
    let {clientId} = useParams()
    let [client, setClient] = useState(null)
    let [loading, setLoading] = useState(true)

    useEffect(()=>{
        async function getClient() {
            try{
                let data = (await axios("http://localhost:3000/clients/"+clientId)).data
                setClient(data)
            }catch(e){
                console.log(e)
            }
            setLoading(false)
        }

        getClient()

    }, [clientId])

    if(loading){
        return(<>
            <Nav pagename="Client Info"/>
            <h3>Loading</h3>
        </>)
    }

    if(!client){
        return(<>
            <Nav pagename="Client Info"/>
            <h3>404 Error: Client Not Found</h3>
        </>)
    }


    return (
        <>
            <Nav pagename="Client Info"/>
            <h3>Client Info</h3>
            <dl>
                <dt>Name</dt>
                <dd>{client.name}</dd>

                <dt>Phone Number</dt>
                <dd>{client.phoneNumber}</dd>

                <dt>Email</dt>
                <dd><a href={"mailto:" + client.email}>{client.email}</a></dd>

                <dt>Address</dt>
                <dd>{client.address}</dd>
            </dl>
            

            <Devices clientId={clientId} />
            <Repairs clientId={clientId} />
        </>
        
    )
}


export default ClientDetails