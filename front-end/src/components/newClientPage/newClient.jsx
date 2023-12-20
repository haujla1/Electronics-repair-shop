import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../navBar";
import axios from "axios";
import constants from "../../../appConstants.js";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Alert,
} from "@mui/material";
function NewClient() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addClient = async (form) => {
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
    if (data.error) {
      setError(data.error);
    } else {
      alert("Client Added");
      navigate("/");
      setError("");
    }

    document.getElementById("add-client").reset();
    return;
  };

  return (
    <>
      <Nav pagename="Add Client" />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add a New Client
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="age"
                label="Age"
                name="age"
                type="number"
                InputProps={{
                  inputProps: {
                    min: constants.min_age,
                    max: constants.max_age,
                  },
                }}
              />
            </Grid>
          </Grid>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add Client
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default NewClient;
