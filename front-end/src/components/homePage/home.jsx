import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { AuthContext } from "../../context/authContext";
import Nav from "../navBar";
import SearchBar from "./search";
import RepairCard from "../repairCard";
import axios from "axios";
import "../../App.css";

function Home() {
  const { currentUser, role } = useContext(AuthContext);
  const [active, setActive] = useState([]);
  const [pickUp, setPickUp] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWOs() {
      setError("");
      try {
        let backendApiUrl = import.meta.env.VITE_BACKEND_API;
        let actives = (
          await axios.get(`${backendApiUrl}/repairs/activeRepairs`)
        ).data;
        let pickups = (
          await axios.get(`${backendApiUrl}/repairs/readyForPickupRepairs`)
        ).data;

        //get device client name and device name for each
        if (actives) {
          for (let i = 0; i < actives.length; i++) {
            if (!actives[i]) {
              continue;
            }
            let client = (
              await axios.get(`${backendApiUrl}/clients/${actives[i].clientID}`)
            ).data;

            actives[i]["clientName"] = client.name;
            let device = client.Devices.filter(
              (x) => x._id == actives[i].deviceID
            )[0];
            actives[i]["deviceName"] =
              device.manufacturer + " " + device.modelName;
          }
          setActive(actives);
        }

        if (pickups) {
          for (let i = 0; i < pickups.length; i++) {
            let client = (
              await axios.get(`${backendApiUrl}/clients/${pickups[i].clientID}`)
            ).data;

            pickups[i]["clientName"] = client.name;
            let device = client.Devices.filter(
              (x) => x._id == pickups[i].deviceID
            )[0];
            pickups[i]["deviceName"] =
              device.manufacturer + " " + device.modelName;
          }
          setPickUp(pickups);
        }

        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.log(e);
        setError(String(e));
      }
    }
    getWOs();
  }, []);
  //only if the current user is the admin
  return (
    <>
      <Nav pagename="Electronics Service Management System" />
      <SearchBar />

      {loading ? (
        <div className="center-loading">
          <CircularProgress />
        </div>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Box className="section-title-bar">
            <Typography variant="h4" className="section-title">
              Active Workorders
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {active.length ? (
              active.map((wo) => (
                <Grid item xs={12} sm={6} md={4} key={wo._id}>
                  <RepairCard
                    repair={wo}
                    deviceName={`${wo.clientName}'s ${wo.deviceName}`}
                  />
                </Grid>
              ))
            ) : (
              <Typography>No Active Workorders</Typography>
            )}
          </Grid>

          <Box className="section-title-bar">
            <Typography variant="h4" className="section-title">
              Ready for Pickup
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {pickUp.length ? (
              pickUp.map((wo) => (
                <Grid item xs={12} sm={6} md={4} key={wo._id}>
                  <RepairCard
                    repair={wo}
                    deviceName={`${wo.clientName}'s ${wo.deviceName}`}
                  />
                </Grid>
              ))
            ) : (
              <Typography>No Ready to Pickup Devices</Typography>
            )}
          </Grid>
        </>
      )}
    </>
  );
}

export default Home;
