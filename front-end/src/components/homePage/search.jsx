import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SearchBar() {
  let [phoneNumber, setPhoneNumber] = useState("");
  let [client, setClient] = useState("");
  let [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    let phoneElem = document.getElementById("phone");
    if (phoneElem.getAttribute("type") != "text") {
      setError("Invalid Input Type");
      return;
    }
    let phone = phoneElem.value;
    if (
      !/^\d+$/.test(phone) ||
      typeof phone != "string" ||
      phone.trim().length != 10
    ) {
      setError("Invalid Phone Number");
      return;
    }
    if (!/^\d+$/.test(phone)) {
      setError("Phone number must contain only numbers");
      return;
    }
    try {
      let backendApiUrl = import.meta.env.VITE_BACKEND_API;
      let data = (await axios(`${backendApiUrl}/clients/phoneNumber/${phone}`))
        .data;
      setPhoneNumber(phone);
      setClient(data);
      setError("");
    } catch (e) {
      setError("Client could not be found");
    }
  }

  return (
    <>
      <h3>Search Clients</h3>
      <form className="form" onSubmit={handleSearch}>
        <div className="form-group">
          <label>
            Search Client by Phone Number:
            <br />
            <input
              name="phone"
              id="phone"
              type="text"
              placeholder="Phone Number"
              required
              autoFocus={true}
            />
          </label>
          <button style={{ display: "inline-block" }} type="submit">
            Search
          </button>
        </div>
      </form>

      {error ? (
        <p className="error">
          {error}.{" "}
          {error === "Client could not be found" ? (
            <>
              Would you like to <Link to="/newClient">create a new client</Link>
              ?{" "}
            </>
          ) : (
            <></>
          )}
        </p>
      ) : (
        <></>
      )}

      {client ? (
        <p className="clientFound">
          {" "}
          Client Found:{" "}
          <Link to={"/clientDetails/" + client._id}>{client.name}</Link>
        </p>
      ) : (
        <></>
      )}
      <p>
        Or <Link to="/newClient">Create New Client</Link>
      </p>
      {/* <Link to="/clientDetails/123123">Example Client Page Link</Link> */}
    </>
  );
}

export default SearchBar;
