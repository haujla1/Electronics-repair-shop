import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../navBar";
import axios from "axios";
import constants from "../../../appConstants.js";

function NewClient() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addClient = async (form) => {
    // console.log(form);
    try {
      let backendApiUrl = import.meta.env.VITE_BACKEND_API;
      let { data } = await axios.post(`${backendApiUrl}/clients`, form);
      return data;
    } catch (e) {
      console.log(e);
      return { error: e.response.data.error };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      firstName: firstNameElem,
      lastName: lastNameElem,
      phoneNumber: phoneNumberElem,
      email: emailElem,
      address: addressElem,
      age: ageElem,
    } = e.target.elements;

    // Protect against changes through inspect element.
    if (
      firstNameElem.getAttribute("type") !== "text" ||
      lastNameElem.getAttribute("type") !== "text" ||
      phoneNumberElem.getAttribute("type") !== "text" ||
      emailElem.getAttribute("type") !== "email" ||
      addressElem.getAttribute("type") !== "text" ||
      ageElem.getAttribute("type") !== "number"
    ) {
      setError("Invalid Input Type");
      return;
    }

    let firstName = firstNameElem.value;
    let lastName = lastNameElem.value;
    let phoneNumber = phoneNumberElem.value;
    let email = emailElem.value;
    let address = addressElem.value;
    let age = ageElem.value;

    // Do the form validation.
    const form = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      address: address,
      age: parseInt(age, 10),
    };
    // console.log(form);

    let data = await addClient(form);
    console.log(data);
    if (data.error) {
      setError(data.error);
      return;
    }

    document.getElementById("add-client").reset();
    setError("");
    alert("Client Added");
    navigate("/"); // redirect to home page
    return;
  };

  return (
    <>
      <Nav pagename="Add Client" />
      <div>
        <form id="add-client" onSubmit={handleSubmit}>
          <div>
            <label>
              First Name:
              <br />
              <input type="text" id="firstName" required autoFocus={true} />
            </label>
          </div>

          <div>
            <label>
              Last Name:
              <br />
              <input type="text" id="lastName" required />
            </label>
          </div>

          <div>
            <label>
              Phone Number:
              <br />
              <input type="text" id="phoneNumber" required />
            </label>
          </div>

          <div>
            <label>
              Email:
              <br />
              <input type="email" id="email" required />
            </label>
          </div>

          <div>
            <label>
              Address:
              <br />
              <input type="text" id="address" required />
            </label>
          </div>

          <div>
            <label>
              Age:
              <br />
              <input
                type="number"
                id="age"
                required
                min={constants.min_age}
                max={constants.max_age}
              />
            </label>
          </div>

          <button type="submit">Add Client</button>
          <br />
          <p>{error}</p>
        </form>
      </div>
    </>
  );
}

export default NewClient;
