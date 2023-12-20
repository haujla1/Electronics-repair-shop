import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";

const AddRepair = ({ repairId, isOpen, handleClose, updateRepairs }) => {
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      let req = {
        repairId: repairId,
        repairType: e.target.repairType.value,
        manufacturer: e.target.manufacturer.value,
        modelName: e.target.modelName.value,
        modelNumber: e.target.modelNumber.value,
        serialNumber: e.target.serialNumber.value,
      };

      let backendApiUrl = import.meta.env.VITE_BACKEND_API;
      let data = (await axios.post(`${backendApiUrl}/repairs/${repairId}`, req))
        .data;
      updateRepairs(data);
      handleClose();
    } catch (e) {
      setError(String(e.response.data.message));
    }
  }

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>New Repair Info</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" m={1} p={1}>
            <TextField
              required
              label="Repair Type"
              name="repairType"
              margin="normal"
            />
            <TextField
              required
              label="Manufacturer"
              name="manufacturer"
              margin="normal"
            />
            <TextField
              required
              label="Model Name"
              name="modelName"
              margin="normal"
            />
            <TextField
              required
              label="Model Number"
              name="modelNumber"
              margin="normal"
            />
            <TextField
              required
              label="Serial Number"
              name="serialNumber"
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="primary" type="submit">
            Add Repair
          </Button>
        </DialogActions>
      </form>
      {error && (
        <p style={{ color: "red", padding: "0 24px", marginBottom: "20px" }}>
          {error}
        </p>
      )}
    </Dialog>
  );
};

export default AddRepair;
