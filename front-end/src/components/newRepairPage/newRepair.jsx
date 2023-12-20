import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Nav from "../navBar";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
function NewRepair() {
  let { clientId, deviceId } = useParams();
  let [client, setClient] = useState(null);
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getClient() {
      try {
        let backendApiUrl = import.meta.env.VITE_BACKEND_API;
        let data = (await axios(`${backendApiUrl}/clients/${clientId}`)).data;
        let device = data.Devices.filter((x) => x._id == deviceId)[0];
        data.deviceName = device.manufacturer + " " + device.modelName;

        setClient(data);
      } catch (e) {
        setError(String(e));
      }
      setLoading(false);
    }
    getClient();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const {
        clientPreferredEmail,
        clientPreferredPhoneNumber,
        issue,
        wasIssueVerified,
        stepsTakenToReplicateIssue,
        workToBeDone,
        conditionOfDevice,
      } = e.target.elements;
      if (
        clientPreferredEmail.getAttribute("type") != "email" ||
        clientPreferredPhoneNumber.getAttribute("type") != "text" ||
        issue.tagName != "TEXTAREA" ||
        wasIssueVerified.getAttribute("type") != "checkbox" ||
        stepsTakenToReplicateIssue.tagName != "TEXTAREA" ||
        workToBeDone.tagName != "TEXTAREA" ||
        conditionOfDevice.tagName != "TEXTAREA"
      ) {
        throw "Invalid Input Type";
      }
    } catch (err) {
      setError(err);
      return;
    }

    try {
      let workOrder = {};
      workOrder.clientPreferredEmail = e.target.clientPreferredEmail.value;
      workOrder.clientPreferredPhoneNumber =
        e.target.clientPreferredPhoneNumber.value;
      workOrder.issue = e.target.issue.value;
      workOrder.wasIssueVerified = e.target.wasIssueVerified.value == "on";
      workOrder.issue = e.target.issue.value;
      workOrder.stepsTakenToReplicateIssue =
        e.target.stepsTakenToReplicateIssue.value;
      workOrder.workToBeDone = e.target.workToBeDone.value;
      workOrder.conditionOfDevice = e.target.conditionOfDevice.value;

      let backendApiUrl = import.meta.env.VITE_BACKEND_API;
      let reportData = await axios.post(`${backendApiUrl}/repairs/`, {
        clientId: clientId,
        deviceID: deviceId,
        workOrder: workOrder,
      });

      let reportRes = await axios.post(
        `${backendApiUrl}/repairs/checkInReport`,
        { reportData: reportData.data },
        { responseType: "arraybuffer" }
      );

      const pdfBlob = new Blob([reportRes.data], { type: "application/pdf" });

      console.log(reportRes.data.byteLength); // This should not be 0

      const url = URL.createObjectURL(pdfBlob);

      window.open(url, "_blank");

      // setPdf(url);
      navigate("/"); // go back to home page
      // make a new call to localhost:3000/repiars/checkInReport and give it the data from the above axios call
    } catch (e) {
      console.log(e);
      setError(String(e.response.data.error));
    }

    return;
  }

  const customStyles = {
    //taken from lecture code
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "50%",
      border: "1px solid #28547a",
      borderRadius: "4px",
    },
  };

  var tzoffset = new Date().getTimezoneOffset() * 60000;

  if (loading) {
    return <h3>Loading</h3>;
  }

  // if (pdf)
  // {
  //     console.log(pdf)
  //     return (
  //         <div>
  //             {pdf && <iframe src={pdf} width="100%" height="600px" />}
  //         </div>
  //     );
  //     }

  return (
    <>
      <Nav pagename="New Repair" />
      <Paper style={{ padding: "20px", margin: "20px" }}>
        <Typography variant="h5">New Repair for {client?.name}</Typography>
        <Typography variant="subtitle1">
          Device: {client?.deviceName}
        </Typography>
        <br />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Preferred Email"
                type="email"
                name="clientPreferredEmail"
                defaultValue={client?.email}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Preferred Phone Number"
                type="text"
                name="clientPreferredPhoneNumber"
                defaultValue={client?.phoneNumber}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Issue"
                name="issue"
                multiline
                rows={4}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox name="wasIssueVerified" />}
                label="Issue Verified"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Verification Reason"
                name="stepsTakenToReplicateIssue"
                multiline
                rows={4}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Repairs"
                name="workToBeDone"
                multiline
                rows={4}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Device Condition"
                name="conditionOfDevice"
                multiline
                rows={4}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Create
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && <Typography color="error">{error}</Typography>}
      </Paper>
    </>
  );
}

export default NewRepair;
