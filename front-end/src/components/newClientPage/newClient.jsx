import React, {useContext, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import Nav from "../navBar";


function NewClient(){
    return (
        <>
            <Nav pagename="Add Client"/>
            <p>Client Form Here</p>
        </>
        
    )
}


export default NewClient