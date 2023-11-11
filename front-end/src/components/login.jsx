import React, {useState, useContext} from "react";
import { Route, Link, Routes, Navigate} from 'react-router-dom';
import { AuthContext } from "../context/authContext";
import { dosignInWithEmailAndPassword, doPasswordReset } from "../firebase/firebaseFunctions";
import GoogleSignIn from "./googleSignIn";


function Login(){
    const {currentUser} = useContext(AuthContext)
    let [display, setDisplay] = useState("")

    const handleLogin = async(e)=>{
        e.preventDefault()
        let {email, password} = e.target.elements

        try{
            await dosignInWithEmailAndPassword(email.value, password.value)
        }catch(err){
            setDisplay(String(err))
        }
    }

    const passwordReset = (e) =>{
        e.preventDefault()
        let email = document.getElementById("email").value
        if(email){
            try{
                doPasswordReset(email)
                setDisplay("Reset Password Email Sent!")
            }catch(err){
                setDisplay(String(err))
            }
        }else{
            setDisplay("Please enter your email before reseting")
        }
    }


    if(currentUser){ 
        //check if they are nothing, manager, or regular
        return <Navigate to='/' replace={true} />
    }


    return (
            <div>
                <h1>Login</h1>
                <Link to="/signup">Or Create Account</Link>
                <form className='form' onSubmit={handleLogin}>
                  <div className='form-group'>
                    <label>
                      Email Address:
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
                  <br />
                  <div className='form-group'>
                    <label>
                      Password:
                      <br />
                      <input
                        name='password'
                        type='password'
                        placeholder='Password'
                        autoComplete='off'
                        required
                      />
                    </label>
                  </div>
        
                  <button type='submit'>
                    Login
                  </button>
                    <br />
                  <button  onClick={passwordReset}>
                    Forgot Password
                  </button>
                </form>
        
                <br />
                <GoogleSignIn />
                <br />
                <p>{display}</p>
              </div>
        );
}

export default Login