import SignOut from "./signOut"
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import axios from 'axios'

const noAccess = () => {
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const {currentUser, role} = useContext(AuthContext)

    const requestAccess = async (e) => {
        if(!currentUser){
            setError("Error fetching user data.")
            setMessage("")
            return
        }
        e.preventDefault()
        console.log(e.target.elements)
        const employeeId = e.target.elements.employeeId.value
        if(!employeeId){
            setError("Must supply Employee Id")
            setMessage("")
            return
        }

        try{
            let data = await axios.post('http://localhost:3000/users/request',{name: currentUser.displayName, email: currentUser.email, employeeId: employeeId, firebaseId: currentUser.uid})
            setError("")
        }catch(e){
            console.log(e)
            setError(e.response.data.error)
            setMessage("")
            return
        }

        setMessage("Access Requested!")

    }

    return (
        <>
        <h2>You do not have Access</h2>
        <p>Request Access here</p>


        <form onSubmit={requestAccess}>
            <label htmlFor="employeeId">Enter your Employee Id:</label>
            <input id="employeeId" name="employeeId" type="text" />

            <button type='submit'>Request Access</button>
        </form>


        <p>{error}</p>
        <p>{message}</p>
        <br />
        <SignOut />
        </>
    )
}

export default noAccess