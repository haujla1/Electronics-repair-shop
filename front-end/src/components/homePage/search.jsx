import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

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
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 0, mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
          Search Clients
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            mb: 2,
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSearch}
        >
          <TextField
            id="phone"
            label="Phone Number"
            type="text"
            placeholder="Phone Number"
            variant="outlined"
            required
            autoFocus
            sx={{ flex: 1 }}
            error={!!error}
            helperText={error}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ ml: 3, width: 150, height: 55 }}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Box>
        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
        {client && (
          <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
            Client Found:{" "}
            <Link to={"/clientDetails/" + client._id}>{client.name}</Link>
          </Typography>
        )}
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Button
            variant="text"
            startIcon={<AddCircleOutlineIcon />}
            component={Link}
            to="/newClient"
            sx={{ textTransform: "none" }}
          >
            Create New Client
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default SearchBar;
