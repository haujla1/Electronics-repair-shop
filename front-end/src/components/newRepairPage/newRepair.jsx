import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from "../navBar";
import axios from "axios";

function NewRepair() {
  let { clientId, deviceId } = useParams();
  let [client, setClient] = useState(null);
  let [loading, setLoading] = useState(true);
  let [pdf, setPdf] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    async function getClient() {
      try {
        let data = (
          await axios(
            "http://ec2-3-95-175-219.compute-1.amazonaws.com:3000/clients/" +
              clientId
          )
        ).data;
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
      //make the axios
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

      let reportData = await axios.post("http://3.95.175.219:3000/repairs/", {
        clientId: clientId,
        deviceID: deviceId,
        workOrder: workOrder,
      });

      let reportRes = await axios.post(
        "http://3.95.175.219:3000/repairs/checkInReport",
        { reportData: reportData.data },
        { responseType: "arraybuffer" }
      );
      const pdfBlob = new Blob([reportRes.data], { type: "application/pdf" });

      console.log(reportRes.data.byteLength); // This should not be 0

      const url = URL.createObjectURL(pdfBlob);

      window.open(url, "_blank");

      // setPdf(url);
      //redirect???
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

      <p>
        Client: <Link to={"/clientDetails/" + clientId}>{clientId}</Link>
      </p>
      <p>Device: {deviceId}</p>

      <form onSubmit={handleSubmit}>
        <label>
          Preferred Email:
          <br />
          <input
            type="text"
            name="clientPreferredEmail"
            defaultValue={client.email}
          />
        </label>
        <br />
        <label>
          Preferred Phone:
          <br />
          <input
            type="text"
            name="clientPreferredPhoneNumber"
            defaultValue={client.phoneNumber}
          />
        </label>
        <br />
        <label>
          Issue:
          <br />
          <textarea name="issue" />
        </label>
        <br />
        <label>
          Issue Verified:
          <input type="checkbox" name="wasIssueVerified" />
        </label>
        <br />
        <label>
          Verification Reason:
          <br />
          <textarea name="stepsTakenToReplicateIssue" />
        </label>
        <br />
        <label>
          Repairs:
          <br />
          <textarea name="workToBeDone" />
        </label>
        <br />
        <label>
          Device Condition:
          <br />
          <textarea name="conditionOfDevice" />
        </label>

        <br />
        <button type="submit">Create</button>
      </form>

      <p>{error}</p>
    </>
  );
}

export default NewRepair;
