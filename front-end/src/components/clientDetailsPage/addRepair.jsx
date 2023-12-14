import React, {useEffect, useState, useContext} from "react";

import ReactModal from 'react-modal';
import axios from "axios";





ReactModal.setAppElement('#root')

const AddRepair = ({repairId, isOpen, handleClose, updateRepairs}) => {
    let [showAddModal, setShowAddModal] = useState(isOpen)
    const [error, setError] = useState("")


    async function handleSubmit(e){
        e.preventDefault()
        setError("")
        try{
            //make the axios
            let req = {repairId: repairId}

            req.repairType = e.target.repairType.value
            req.manufacturer = e.target.manufacturer.value
            req.modelName = e.target.modelName.value
            req.modelNumber = e.target.modelNumber.value
            req.serialNumber = e.target.serialNumber.value

            let data = (await axios.post("http://localhost:3000/repairs/"+repairId, req)).data

            updateRepairs(data)
        
            handleClose()
        }catch(e){
            setError(String(e.response.data.message))
        }

        return
       
    }

    const customStyles = { //taken from lecture code
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',
          border: '1px solid #28547a',
          borderRadius: '4px',
          color: 'black'
        }
      };

    return (
        <ReactModal name='editRepair' isOpen={showAddModal} contentLabel="Edit" style={customStyles}>
            <form onSubmit={handleSubmit}>
                <h3>New Repair Info</h3>
                <label>
                    Repair Type:
                    <input required type='text' name='repairType' />
                </label>
                <br />
                <label>
                    Manufacturer:
                    <input required type='text' name='manufacturer' />
                </label>
                <br />
                <label>
                    Model Name:
                    <input required type='text' name='modelName' />
                </label>
                <br />
                <label>
                    Model Number:
                    <input required type='text' name='modelNumber' />
                </label>
                <br />
                <label>
                    Serial Number:
                    <input required type='text' name='serialNumber' />
                </label>
                <br />


                <button onClick={handleClose}>Cancel</button>
                <button type='submit'>Add Repair</button>
            </form>

            <p>{error}</p>

        </ReactModal>
    )
}

export default AddRepair