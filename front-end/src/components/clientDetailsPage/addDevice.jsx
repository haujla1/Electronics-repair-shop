import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const AddDevice = ({ clientId, isOpen, handleClose, updateDevices }) => {
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { deviceType, manufacturer, modelName, modelNumber, serialNumber } =
      e.target.elements;

    try {
      const req = {
        clientId: clientId,
        deviceType: deviceType.value,
        manufacturer: manufacturer.value,
        modelName: modelName.value,
        modelNumber: modelNumber.value,
        serialNumber: serialNumber.value,
      };

      const backendApiUrl = import.meta.env.VITE_BACKEND_API;
      const response = await axios.post(
        `${backendApiUrl}/clients/${clientId}/device`,
        req
      );
      updateDevices(response.data);
      handleClose();
    } catch (e) {
      setError(e.response?.data?.error || "An unexpected error occurred.");
    }
  };

  const customStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: "none",
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={customStyles}>
        <Typography variant="h6" gutterBottom component="div">
          New Device Info
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Device Type"
            name="deviceType"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Manufacturer"
            name="manufacturer"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Model Name"
            name="modelName"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Model Number"
            name="modelNumber"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Serial Number"
            name="serialNumber"
          />

          {error && (
            <Typography variant="body2" color="error" gutterBottom>
              {error}
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Add Device
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddDevice;
