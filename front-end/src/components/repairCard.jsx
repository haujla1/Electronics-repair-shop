import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

function RepairCard({ repair, deviceName }) {
  return (
    <Card
      className="card repairCard"
      variant="outlined"
      sx={{
        height: "auto",
        width: 250,
        border: "1px solid #29642b",
        maxHeight: 600,
      }}
    >
      <CardContent>
        <CardActionArea component={Link} to={`/repair/${repair._id}`}>
          <Typography
            className="deviceName"
            sx={{
              borderBottom: "1px solid #29642b",
              fontWeight: "bold",
            }}
            gutterBottom
            variant="h6"
            component="h3"
          >
            {deviceName
              ? deviceName
              : repair.pickupDate
              ? "Picked Up"
              : repair.repairCompletionDate
              ? "Repair Complete"
              : "In Progress"}
          </Typography>
        </CardActionArea>

        <Typography className="issue" gutterBottom component="div">
          <dl>
            <dt>Issue:</dt>{" "}
            <dd>
              {repair.issue.length > 50
                ? repair.issue.slice(0, 50) + "..."
                : repair.issue}
            </dd>
          </dl>
        </Typography>

        <Typography className="id" gutterBottom component="div">
          <dl>
            <dt>Device:</dt> <dd>{repair.deviceID}</dd>
          </dl>
        </Typography>

        <Typography gutterBottom component="div">
          <dl>
            <dt>Work To Do:</dt>{" "}
            <dd>
              {repair.workToBeDone.length > 100
                ? repair.workToBeDone.slice(0, 100) + "..."
                : repair.workToBeDone}
            </dd>
          </dl>
        </Typography>

        <Typography gutterBottom component="div">
          <dl>
            <dt>Created Date:</dt>{" "}
            <dd>
              {new Date(repair.repairOrderCreationDate).toLocaleDateString()}
            </dd>
          </dl>
        </Typography>

        {repair.repairCompletionDate ? (
          <Typography gutterBottom component="div">
            <dl>
              <dt>Completed Date:</dt>{" "}
              <dd>
                {new Date(repair.repairCompletionDate).toLocaleDateString()}
              </dd>
            </dl>
          </Typography>
        ) : (
          <></>
        )}

        {repair.pickupDate ? (
          <Typography gutterBottom component="div">
            <dl>
              <dt>Picked Up Date:</dt>{" "}
              <dd>{new Date(repair.pickupDate).toLocaleDateString()}</dd>
            </dl>
          </Typography>
        ) : (
          <></>
        )}

        <Typography gutterBottom component="div" className="id">
          <dl>
            <dt>Repair ID:</dt> <dd>{repair._id}</dd>
          </dl>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default RepairCard;
