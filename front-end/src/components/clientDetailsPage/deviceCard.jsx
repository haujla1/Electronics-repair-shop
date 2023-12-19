import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";

function DeviceCard({ device, clientId }) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        m: 2,
        boxShadow: 3,
        "&:hover": {
          boxShadow: 6,
        },
        borderRadius: 2,
        borderColor: "primary.main",
        transition: "0.3s",
      }}
    >
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider", pb: 2 }}>
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

        <Typography
          variant="body2"
          color="text.secondary"
          component="div"
          sx={{ mb: 1 }}
        >
          <strong>Model:</strong> {device.modelNumber}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          component="div"
          sx={{ mb: 1 }}
        >
          <strong>Serial:</strong> {device.serialNumber}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          component="div"
          sx={{ mb: 1 }}
        >
          <strong>ID:</strong> {device._id}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to={`/newRepair/${clientId}/${device._id}`}
          startIcon={<BuildIcon />}
          sx={{ textTransform: "none" }}
        >
          New Repair
        </Button>
      </Box>
    </Card>
  );
}

export default DeviceCard;
