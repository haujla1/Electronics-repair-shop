import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from "../navBar";
import axios from "axios";

import Edit from "./editModal.jsx";
import Complete from "./completeModal.jsx";
import PickUp from "./pickupModal.jsx";
import "./repairDetails.css";
import { Typography, Paper, Grid, Button, Box, Divider } from "@mui/material";
function RepairDetails() {
  let { repairId } = useParams();
  let [repair, setRepair] = useState(null);
  let [loading, setLoading] = useState(true);
  let [showEdit, setShowEdit] = useState(false);
  let [showComplete, setShowComplete] = useState(false);
  let [showPickup, setShowPickup] = useState(false);

  function openEdit() {
    setShowEdit(true);
  }

  function closeEdit() {
    setShowEdit(false);
  }

  function openComplete() {
    setShowComplete(true);
  }

  function closeComplete() {
    setShowComplete(false);
  }

  function openPickup() {
    setShowPickup(true);
  }

  function closePickup() {
    setShowPickup(false);
  }

  useEffect(() => {
    async function getRepair() {
      try {
        let backendApiUrl = import.meta.env.VITE_BACKEND_API;

        let data = (await axios(`${backendApiUrl}/repairs/${repairId}`)).data;

        let client = (
          await axios.get(`${backendApiUrl}/clients/${data.clientID}`)
        ).data;

        data["clientName"] = client.name;
        let device = client.Devices.filter((x) => x._id == data.deviceID)[0];
        data["deviceName"] = device.manufacturer + " " + device.modelName;

        setRepair(data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }

    getRepair();
  }, [repairId]);

  if (loading) {
    return (
      <>
        <Nav pagename="Repair Info" />
        <h3>Loading</h3>
      </>
    );
  }

  if (!repair) {
    return (
      <>
        <Nav pagename="Repair Info" />
        <h3 className="error">404 Error: Repair Not Found (id:{repairId})</h3>
      </>
    );
  }

  return (
    <>
      <Nav pagename="Repair Info" />
      <Paper style={{ padding: "20px", margin: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">General Info</Typography>
            <Divider />
            <Box paddingY={2}>
              <Typography>
                <strong>Repair ID:</strong> {repair["_id"]}
              </Typography>
              <Typography>
                <strong>Device Name:</strong> {repair["deviceName"]}
              </Typography>
              <Typography>
                <strong>Client: </strong>
                <Link to={"/clientDetails/" + repair["clientID"]}>
                  {repair["clientName"]
                    ? repair["clientName"]
                    : repair["clientID"]}
                </Link>
              </Typography>
              <Typography>
                <strong>Issue:</strong> {repair["issue"]}
              </Typography>
              <Typography>
                <strong>Issue Verified:</strong>{" "}
                {repair["wasIssueVerified"] ? "Yes" : "No"}
              </Typography>
              <Typography>
                <strong>Verification Reason:</strong>{" "}
                {repair["stepsTakenToReplicateIssue"]}
              </Typography>
              <Typography>
                <strong>Repairs:</strong> {repair["workToBeDone"]}
              </Typography>
              <Typography>
                <strong>Device Condition:</strong> {repair["conditionOfDevice"]}
              </Typography>
              <Typography>
                <strong>Repair Status:</strong> {repair["repairStatus"]}
              </Typography>
            </Box>
          </Grid>

          {repair["repairCompletionDate"] && (
            <Grid item xs={12}>
              <Typography variant="h5">Repair Completed</Typography>
              <Divider />
              <Box paddingY={2}>
                <Typography>
                  <strong>Repairs Completed:</strong>{" "}
                  {new Date(
                    repair["repairCompletionDate"]
                  ).toLocaleDateString()}
                </Typography>
                <Typography>
                  <strong>Repair Notes:</strong>{" "}
                  {repair["repairTechnicianNotes"]}
                </Typography>
                <Typography>
                  <strong>Repair Success:</strong>{" "}
                  {repair["wasTheRepairSuccessful"] ? "Yes" : "No"}
                </Typography>
              </Box>
            </Grid>
          )}

          {repair["pickupDate"] && (
            <Grid item xs={12}>
              <Typography variant="h5">Pick Up</Typography>
              <Divider />
              <Box paddingY={2}>
                <Typography>
                  <strong>Picked Up:</strong>{" "}
                  {new Date(repair["pickupDate"]).toLocaleDateString()}
                </Typography>
                <Typography>
                  <strong>Pick Up Notes:</strong> {repair["pickupNotes"]}
                </Typography>
                <Typography>
                  <strong>Pick Up Demo:</strong>{" "}
                  {repair["pickupDemoDone"] ? "Yes" : "No"}
                </Typography>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              {!repair["repairCompletionDate"] && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={openComplete}
                >
                  Complete Repair
                </Button>
              )}

              {repair["repairCompletionDate"] && !repair["pickupDate"] && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={openPickup}
                >
                  Process Pickup
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {showComplete && (
        <Complete
          isOpen={showComplete}
          repair={repair}
          handleClose={closeComplete}
          update={setRepair}
        />
      )}

      {showPickup && (
        <PickUp
          isOpen={showPickup}
          repair={repair}
          handleClose={closePickup}
          update={setRepair}
        />
      )}
    </>
  );
}

export default RepairDetails;
