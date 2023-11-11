import React, {useContext, useEffect, useState} from "react";
import { Route, Link, Routes} from 'react-router-dom';
import { AuthContext } from "../context/authContext";



const adminTools = () =>{

    let [users, setUsers] = useState(["test1", "test2", "test3"])
    let [loading, setLoading] = useState(true)

    const removeUser = async(user)=>{
        //remove from mongo in backend
        let remove = (user.target.value)
        let u = [...users].filter(x=> x!= remove)
        setUsers(u)

        console.log(users)
    }

    const handleAdd = async(e)=>{
        e.preventDefault()
        let {email} = e.target.elements
    
        try{
            //this is where we make the post to the backend
        }catch(err){
            //if it all goes wrong
        }

        //setUsers to users.push(newly created User)
        

        let u = [...users]
        u.push(email.value)
        setUsers(u)

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
            <h1>Admin</h1>
            <Link to="/">Home</Link>

            <div>
                <h2>Add Users to Organization</h2>
                <form className='form' onSubmit={handleAdd}>
                  <div className='form-group'>
                    <label>
                      Email Address to Add:
                      <br />
                      <input
                        name='email'
                        id='email'
                        type='email'
                        placeholder='Email'
                        required
                        autoFocus={true}
                      />
                    </label>
                  </div>
                  <button type="submit">Add User</button>
                </form>
            </div>
            <br />
            <br />
            <div>
                Existing Users Here with option to delete
                <ul>
                    {users.map(x=><li key={x}>{x} <button value={x} onClick={(y) => removeUser(y)}>Remove</button></li>)}
                </ul>
            </div>
        </>
    )
}


export default adminTools
