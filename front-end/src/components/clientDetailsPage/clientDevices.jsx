import React, {useContext, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import axios from "axios";
import stockAndroidImg from '../../assets/stock-android-image.webp';
import stockIphoneImg from '../../assets/stock-iphone-image.jpeg';
import AddDevice from './addDevice.jsx'


function Devices({clientId}){
    let [devices, setDevices] = useState([]);
    let [loading, setLoading] = useState(true);
    let [showAddDevice, setShowAddDevice] = useState(false)

    useEffect(() => {
        async function getDevices(clientId) {
            try {
                let { data } = await axios.get(`http://localhost:3000/clients/${clientId}`);
                console.log(data.Devices);
                setDevices(data.Devices);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        getDevices(clientId);
    }, []);

    function openAddDevice(){
        setShowAddDevice(true)
    }

    function closeAddDevice(){
        setShowAddDevice(false)
    }

    function updateDevices(newDevice){
        let newList = [...devices]
        newList.push(newDevice)
        setDevices(newList)
    }

    return (
        <>
            <h3>Devices</h3>
            {/* <p>Devices for {clientId} here</p>
            <p>Cards for each device, with image or stock image of device type (i.e. if iphone 8 get a pic of iphone 8 somehow). Then when clicked on opens the modal with repair history (and links to full repair info) and button to create a new repair.</p> */}

            <div>
                {
                    loading
                        ? (
                            <div>
                                <h4>Loading Devices...</h4>
                            </div>
                        )
                        : (
                            devices.map(device => {
                                return (
                                    <div className="card" key={device._id}>
                                        <h5>{device.manufacturer} {device.modelName}</h5>
                                        {
                                            device.manufacturer === 'Samsung'
                                                ? (
                                                    <img src={stockAndroidImg} alt="Samsung Phone" width="50%"/>
                                                )
                                                : (
                                                    <img src={stockIphoneImg} alt="iPhone" width="50%"/>
                                                )
                                        }
                                        <dl>
                                            <dt>Model Number:</dt>
                                            <dd>{device.modelNumber}</dd>

                                            <dt>Serial Number:</dt>
                                            <dd>{device.serialNumber}</dd>

                                        </dl>

                                        <Link to={`/newRepair/${clientId}/${device._id}`}>New Repair</Link>
                                    </div>
                                );
                            })
                        )
                }
            </div>

            <br/>

            <button onClick={openAddDevice}>Add Device</button>
            {showAddDevice && <AddDevice clientId={clientId} isOpen={showAddDevice} handleClose={closeAddDevice} updateDevices={updateDevices}/>}

        </>
    )
}


export default Devices