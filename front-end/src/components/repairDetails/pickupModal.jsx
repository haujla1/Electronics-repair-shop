import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import axios from "axios";

ReactModal.setAppElement("#root");

const PickUp = ({ repair, isOpen, handleClose, update }) => {
  let [showAddModal, setShowAddModal] = useState(isOpen);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      let pickupNotes = e.target.pickupNotes.value;
      let pickupDemoDone = e.target.pickupDemoDone.checked;

      if (typeof pickupNotes != "string" || pickupNotes.trim().length < 1) {
        setError("Must add Pick Up Notes.");
        return;
      }
      if (
        typeof pickupDemoDone != "boolean" ||
        e.target.pickupDemoDone.value != "on"
      ) {
        setError("Error: pickup type must be boolean");
        return;
      }
      let backendApiUrl = import.meta.env.VITE_BACKEND_API;

      let rep = await axios.put(`${backendApiUrl}/repairs/afterPickup`, {
        repairID: repair._id,
        pickupDemoDone: pickupDemoDone,
        pickupNotes: pickupNotes,
      });

      let reportRes = await axios.post(
        `${backendApiUrl}/repairs/pickupReport`,
        { reportData: rep.data },
        { responseType: "arraybuffer" }
      );

      const pdfBlob = new Blob([reportRes.data], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);

      window.open(url, "_blank");

      setError("");
      handleClose();
      navigate("../../"); //go back to home page
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
      color: "black",
    },
  };

  return (
    <ReactModal
      name="pickupRepair"
      isOpen={showAddModal}
      contentLabel="Pickup"
      style={customStyles}
    >
      <form onSubmit={handleSubmit}>
        <h3>Pick Up</h3>
        <label>
          Pick Up Notes:
          <br />
          <textarea name="pickupNotes" />
        </label>
        <br />
        <label>
          Pick Up Demo Done:
          <input type="checkbox" name="pickupDemoDone" />
        </label>
        <br />

        <br />
        <button onClick={handleClose}>Cancel</button>
        <button type="submit">Process Pickup</button>
      </form>

      <p className="error">{error}</p>
    </ReactModal>
  );
};

export default PickUp;
