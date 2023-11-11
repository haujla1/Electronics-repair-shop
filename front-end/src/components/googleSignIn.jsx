import React from "react";
import { doSocialSignIn } from "../firebase/firebaseFunctions";

const googleSignIn = () => {
    const signIn = async() =>{
        try{
            await doSocialSignIn()
        }catch(e){
            alert(e) //switch out for displaying error normally
        }
    }

    return(
        <button onClick={() => signIn()}>Sign in with Google</button>
    )}

export default googleSignIn