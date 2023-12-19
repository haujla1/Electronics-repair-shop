import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

function DeviceCard({ device, clientId }) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        m: 2,
        boxShadow: 3,
        "&:hover": {
          boxShadow: 5,
        },
        borderRadius: 2,
        borderColor: "primary.main",
      }}
    >
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            color="primary"
            sx={{ fontWeight: "medium" }}
          >
            {device.manufacturer} {device.modelName}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" component="div">
          <strong>Model Number:</strong> {device.modelNumber}
        </Typography>

        <Typography variant="body2" color="text.secondary" component="div">
          <strong>Serial Number:</strong> {device.serialNumber}
        </Typography>

        <Typography variant="body2" color="text.secondary" component="div">
          <strong>Device ID:</strong> {device._id}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/newRepair/${clientId}/${device._id}`}
          sx={{ textTransform: "none" }}
        >
          New Repair
        </Button>
      </Box>
    </Card>
  );
}

export default DeviceCard;
