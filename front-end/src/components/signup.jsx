import React, { useContext, useState, useEffect } from "react";
import { Route, Link, Routes, Navigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/firebaseFunctions";
import { AuthContext } from "../context/authContext";

import GoogleSignIn from "./googleSignIn";

function SignUp() {
  const { currentUser, role } = useContext(AuthContext);

  const [error, setError] = useState("");

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  async function handleSignUp(e) {
    e.preventDefault();
    const { name, email, password, repeatPassword } = e.target.elements;
    if (
      name.getAttribute("type") != "text" ||
      email.getAttribute("type") != "email" ||
      password.getAttribute("type") != "password" ||
      repeatPassword.getAttribute("type") != "password"
    ) {
      setError("Invalid Input Type");
      return false;
    }
    if (password.value != repeatPassword.value) {
      setError("Passwords do not match.");
      return false;
    }

    try {
      await doCreateUserWithEmailAndPassword(
        email.value,
        password.value,
        name.value
      );
    } catch (err) {
      setError(String(err));
      return false;
    }

    setError("");
  }

  if (currentUser && role) {
    //check if they are nothing, manager, or regular
    console.log("ROle" + role);
    if (role == "Admin" || role == "Technician") {
      return <Navigate to="/" />;
    } else {
      return <Navigate to="/no-access" />;
    }
  }

  return (
    <div className="card">
      <h1>Sign up</h1>
      <Link to="/login">Or Login</Link>

      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label>
            Name:
            <br />
            <input
              className="form-control"
              required
              name="name"
              type="text"
              placeholder="Name"
              autoFocus={true}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <br />
            <input
              className="form-control"
              required
              name="email"
              type="email"
              placeholder="Email"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password:
            <br />
            <input
              className="form-control"
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="off"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Confirm Password:
            <br />
            <input
              className="form-control"
              name="repeatPassword"
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              required
            />
          </label>
        </div>
        <button
          className="button"
          id="submitButton"
          name="submitButton"
          type="submit"
        >
          Sign Up
        </button>
      </form>
      <br />

      <GoogleSignIn />
      <div className="error">{error}</div>
    </div>
  );
}

export default SignUp;
