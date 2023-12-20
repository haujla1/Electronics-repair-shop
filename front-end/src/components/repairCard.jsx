import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";

function RepairCard({ repair, deviceName }) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        m: 2,
        border: "1px solid #29642b",
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        "&:hover": {
          boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
        },
        borderRadius: 2,
      }}
    >
      <CardActionArea component={Link} to={`/repair/${repair._id}`}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {deviceName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Issue: {repair.issue}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Device ID: {repair.deviceID}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Work To Do: {repair.workToBeDone}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created Date:{" "}
            {new Date(repair.repairOrderCreationDate).toLocaleDateString()}
          </Typography>
          {repair.repairCompletionDate && (
            <Typography variant="body2" color="text.secondary">
              Completed Date:{" "}
              {new Date(repair.repairCompletionDate).toLocaleDateString()}
            </Typography>
          )}
          {repair.pickupDate && (
            <Typography variant="body2" color="text.secondary">
              Picked Up Date: {new Date(repair.pickupDate).toLocaleDateString()}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default RepairCard;
