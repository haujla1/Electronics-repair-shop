import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AddDevice from "./addDevice.jsx";

function Devices({ clientId }) {
  let [devices, setDevices] = useState([]);
  let [loading, setLoading] = useState(true);
  let [showAddDevice, setShowAddDevice] = useState(false);

  useEffect(() => {
    async function getDevices(clientId) {
      try {
        let { data } = await axios.get(
          `http://3.95.175.219:3000/clients/${clientId}`
        );
        console.log(data.Devices);
        setDevices(data.Devices);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }

    getDevices(clientId);
  }, []);

  function openAddDevice() {
    setShowAddDevice(true);
  }

  function closeAddDevice() {
    setShowAddDevice(false);
  }

  function updateDevices(newDevice) {
    let newList = [...devices];
    newList.push(newDevice);
    setDevices(newList);
  }

  return (
    <>
      <h3>Devices</h3>
      <div>
        {loading ? (
          <div>
            <h4>Loading Devices...</h4>
          </div>
        ) : devices.length > 0 ? (
          devices.map((device) => {
            return (
              <div className="card" key={device._id}>
                <h5>
                  {device.manufacturer} {device.modelName}
                </h5>
                <dl>
                  <dt>Model Number:</dt>
                  <dd>{device.modelNumber}</dd>

                  <dt>Serial Number:</dt>
                  <dd>{device.serialNumber}</dd>
                </dl>

                <Link to={`/newRepair/${clientId}/${device._id}`}>
                  New Repair
                </Link>
              </div>
            );
          })
        ) : (
          <>
            <h3>No Devices Found</h3>
          </>
        )}
      </div>

      <br />

      <button onClick={openAddDevice}>Add Device</button>
      {showAddDevice && (
        <AddDevice
          clientId={clientId}
          isOpen={showAddDevice}
          handleClose={closeAddDevice}
          updateDevices={updateDevices}
        />
      )}
    </>
  );
}

export default Devices;
