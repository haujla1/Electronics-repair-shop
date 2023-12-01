import React, {useContext, useEffect, useState} from "react";
import {Link} from 'react-router-dom';


function SearchBar(){
    return (
        <>
            <h3>Search Clients</h3>
            <Link to="/newClient">New Client</Link>
            <br />
            <Link to="/clientDetails/123123">Example Client Page Link</Link>
        </>
    )
}


export default SearchBar