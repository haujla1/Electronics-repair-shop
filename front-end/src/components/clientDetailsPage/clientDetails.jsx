import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from "../navBar";
import Devices from "./clientDevices";
import Repairs from "./clientRepairs";
import axios from "axios";
import { Card, CardContent, Typography, Box, Tabs, Tab } from "@mui/material";
import "./clientDetails.css";

function ClientDetails() {
  let { clientId } = useParams();
  let [client, setClient] = useState(null);
  let [loading, setLoading] = useState(true);
  let [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    async function getClient() {
      try {
        let backendApiUrl = import.meta.env.VITE_BACKEND_API;
        let data = (await axios(`${backendApiUrl}/clients/${clientId}`)).data;
        setClient(data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }

    getClient();
  }, [clientId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <>
        <Nav pagename="Client Info" />
        <Typography variant="h4" align="center">
          Loading...
        </Typography>
      </>
    );
  }

  if (!client) {
    return (
      <>
        <Nav pagename="Client Info" />
        <Typography variant="h4" align="center">
          404 Error: Client Not Found
        </Typography>
      </>
    );
  }

  return (
    <>
      <Nav pagename="Client Details" />
      <Card>
        <CardContent>
          <Box className="section-title-bar">
            <Typography variant="h5" component="h2">
              Client Details
            </Typography>
          </Box>

          <Box mt={2}>
            <Typography variant="body1">
              <strong>Name:</strong> {client.name}
            </Typography>
            <Typography variant="body1">
              <strong>Phone Number:</strong> {client.phoneNumber}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong>{" "}
              <a href={"mailto:" + client.email}>{client.email}</a>
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> {client.address}
            </Typography>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              indicatorColor="primary"
              textColor="primary"
              key={clientId} // add the key here
            >
              <Tab label="Devices" />
              <Tab label="Repairs" />
            </Tabs>
          </Box>
          {tabValue === 0 && <Devices clientId={clientId} />}
          {tabValue === 1 && <Repairs clientId={clientId} />}
        </CardContent>
      </Card>
    </>
  );
}

export default ClientDetails;
