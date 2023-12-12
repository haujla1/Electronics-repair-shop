import React, {useContext, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import axios from "axios";


function SearchBar(){
    let [phoneNumber, setPhoneNumber] = useState("")
    let [client, setClient] = useState("")
    let [error, setError] = useState("")

    async function handleSearch(e){
        e.preventDefault()
        let phone = document.getElementById("phone").value
        if(typeof phone != "string" || phone.trim().length != 10){
          setError("Invalid Phone Number")
          return
        }
        try{
            let data = (await axios("http://localhost:3000/clients/phoneNumber/"+phone)).data
            setPhoneNumber(phone)
            setClient(data)
            setError("")
        }catch(e){
            setError("Client could not be found")
        }
    }

    return (
        <>
            <h3>Search Clients</h3>
            <form className='form' onSubmit={handleSearch}>
                  <div className='form-group'>
                    <label>
                      Enter Client's Phone Number:
                      <br />
                      <input
                        name='phone'
                        id='phone'
                        type='phone'
                        placeholder='Phone Number'
                        required
                        autoFocus={true}
                      />
                    </label>
                  </div>
                  <button type='submit'>
                    Search
                  </button>
            </form>

            <p>{error}</p>

            {client? <Link to={"/clientDetails/" + client._id}>{client.name}</Link>: <></>}
            <br />


            <Link to="/newClient">New Client</Link>
            <br />
            {/* <Link to="/clientDetails/123123">Example Client Page Link</Link> */}
        </>
    )
}


export default SearchBar