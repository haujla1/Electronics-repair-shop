import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchBar() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();
    const phone = event.target.phone.value;
    const backendApiUrl = import.meta.env.VITE_BACKEND_API;

    try {
      if (!/^\d{10}$/.test(phone)) {
        throw new Error("Phone number must contain 10 digits.");
      }

      const { data } = await axios.get(
        `${backendApiUrl}/clients/phoneNumber/${phone}`
      );
      setPhoneNumber(phone);
      setClient(data);
      setError("");
    } catch (e) {
      setClient(null);
      setError(e.response?.data?.error || "Client could not be found");
    }
  };

  return (
    <Box sx={{ my: 4, mx: 2 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Search Clients
        </Typography>
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          <TextField
            name="phone"
            label="Phone Number"
            variant="outlined"
            fullWidth
            error={!!error}
            helperText={error}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Box>
        {client && (
          <Typography sx={{ mt: 2 }}>
            Client Found:{" "}
            <Link to={`/clientDetails/${client._id}`}>{client.name}</Link>
          </Typography>
        )}
        <Typography sx={{ mt: 2 }}>
          Or <Link to="/newClient">Create New Client</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default SearchBar;
