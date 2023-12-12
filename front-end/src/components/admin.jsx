import React, {useContext, useEffect, useState} from "react";
import { Route, Link, Routes} from 'react-router-dom';
import { AuthContext } from "../context/authContext";
import axios from 'axios'
import Nav from "./navBar";



const adminTools = () =>{

    let [users, setUsers] = useState([])
    let [pendingUsers, setPendingUsers] = useState([])
    let [loading, setLoading] = useState(true)

    const {currentUser, role} = useContext(AuthContext)

    useEffect(() => {
        const getUsers= async () => {
            try{
                let approved = await axios("http://localhost:3000/users/authorized/" + currentUser.uid)
                setUsers(approved.data.filter(x=>x.role != "Admin"))
                let pending = await axios("http://localhost:3000/users/pending/" + currentUser.uid)
                setPendingUsers(pending.data)
                setLoading(false)
            }catch(e){
                console.log(e)
            }
        }

        getUsers()
    }, [])

    const removeUser = async(user)=>{
        //remove from mongo in backend
        let email = (user.target.value)
        let deleteUserFirebaseId

        try{
            if(pendingUsers.map(x=>x.email).includes(email)){
                deleteUserFirebaseId = pendingUsers.filter(x=>x.email == email)[0].firebaseId
                let v = [...pendingUsers]
                v = v.filter(x=>x.email != email)
                setPendingUsers(v)
            }else if(users.map(x=>x.email).includes(email)){
                deleteUserFirebaseId = users.filter(x=>x.email == email)[0].firebaseId
                let v = [...users]
                v = v.filter(x=>x.email != email)
                setUsers(v)
            }

            console.log(deleteUserFirebaseId)

            await axios.patch("http://localhost:3000/users/remove", {adminFirebaseId: currentUser.uid, userFirebaseId: deleteUserFirebaseId})

        }catch(e){
            console.log(e)
        }

    }

    const allowUser = async(user)=>{
        //remove from mongo in backend
        let email = (user.target.value)
        let newUser
        try{
            newUser = pendingUsers.filter(x=>x.email == email)[0]
            await axios.patch("http://localhost:3000/users/approve", {adminFirebaseId: currentUser.uid, userFirebaseId: newUser.firebaseId})
        }catch(e){
            console.log(e)
        }
        let u = [...users]
        u.push(newUser)
        setUsers(u)

        //remove user from pending list
        let v = [...pendingUsers]
        v = v.filter(x=>x.email != email)
        setPendingUsers(v)

    }


    useEffect(()=>{
        //query the backend for all users associated with organization, and use setUsers
        //just for testing
        setLoading(false)
    },[])


    if(loading){
        return <h1>Loading</h1>
    }

    return(
        <>
            <Nav pagename="Admin Tools"/>
            <div>
                <h2>Accepted Users</h2>
                <ul>
                    {users.map(x=><li key={x.name}>{x.name}-{x.email}-{x.employeeId}  <button style={{backgroundColor: 'rgb(191, 34, 34)', color: "rgb(255, 255, 255)"}} value={x.email} onClick={(y) => removeUser(y)}>Remove</button></li>)}
                </ul>
            </div>
            <br />
            <div>
                <h2>Pending Users</h2>
                <ul>
                    {pendingUsers.map(x=><li key={x.name}>{x.name}-{x.email}-{x.employeeId} <button style={{backgroundColor: 'rgb(191, 34, 34)', color: "rgb(255, 255, 255)"}} value={x.email} onClick={(y) => removeUser(y)}>Remove</button> <button style={{backgroundColor: 'rgb(10, 209, 97)'}} value={x.email} onClick={(y) => allowUser(y)}>Accept</button></li>)}
                </ul>
            </div>

        </>
    )
}


export default adminTools
