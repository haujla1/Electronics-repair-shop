import React, { useEffect, useState, useContext } from "react";

import ReactModal from "react-modal";
import axios from "axios";

ReactModal.setAppElement("#root");

const AddDevice = ({ clientId, isOpen, handleClose, updateDevices }) => {
  let [showAddModal, setShowAddModal] = useState(isOpen);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      //make the axios
      let req = { clientId: clientId };

      let { deviceType, manufacturer, modelName, modelNumber, serialNumber } =
        e.target.elements;
      if (
        deviceType.getAttribute("type") != "text" ||
        manufacturer.getAttribute("type") != "text" ||
        modelName.getAttribute("type") != "text" ||
        modelNumber.getAttribute("type") != "text" ||
        serialNumber.getAttribute("type") != "text"
      ) {
        setError("Invalid Input Type");
        return;
      }

      req.deviceType = deviceType.value;
      req.manufacturer = manufacturer.value;
      req.modelName = modelName.value;
      req.modelNumber = modelNumber.value;
      req.serialNumber = serialNumber.value;

      let backendApiUrl = import.meta.env.VITE_BACKEND_API;
      let data = (
        await axios.post(`${backendApiUrl}/clients/${clientId}/device`, req)
      ).data;

      updateDevices(data);
      console.log(data);

      handleClose();
    } catch (e) {
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
      name="editRepair"
      isOpen={showAddModal}
      contentLabel="Edit"
      style={customStyles}
    >
      <form onSubmit={handleSubmit}>
        <h3>New Device Info</h3>
        <label style={{ color: "#000" }}>
          Device Type:
          <input required type="text" name="deviceType" />
        </label>
        <br />
        <label style={{ color: "#000" }}>
          Manufacturer:
          <input required type="text" name="manufacturer" />
        </label>
        <br />
        <label style={{ color: "#000" }}>
          Model Name:
          <input required type="text" name="modelName" />
        </label>
        <br />
        <label style={{ color: "#000" }}>
          Model Number:
          <input required type="text" name="modelNumber" />
        </label>
        <br />
        <label style={{ color: "#000" }}>
          Serial Number:
          <input required type="text" name="serialNumber" />
        </label>
        <br />

        <button onClick={handleClose}>Cancel</button>
        <button type="submit">Add Device</button>
      </form>

      <p className="error">{error}</p>
    </ReactModal>
  );
};

export default AddDevice;
