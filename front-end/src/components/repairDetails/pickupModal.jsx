import React, {useEffect, useState, useContext} from "react";

import ReactModal from 'react-modal';
import axios from "axios";





ReactModal.setAppElement('#root')

const PickUp = ({repair, isOpen, handleClose, update}) => {
    let [showAddModal, setShowAddModal] = useState(isOpen)
    const [error, setError] = useState("")


    async function handleSubmit(e){
        e.preventDefault()
        setError("")
        try{
            
            let pickupNotes = e.target.pickupNotes.value
            let pickupDemoDone = e.target.pickupDemoDone.value

            if(typeof pickupNotes != "string" || pickupNotes.trim().length < 1){
                setError("Must add Pick Up Notes.")
                return
            }
            if(pickupDemoDone != "on" && pickupDemoDone != "off"){
                setError("Error: pickup type must be boolean")
                return
            }
            //make the axios
            let rep = await axios.put("http://localhost:3000/repairs/afterPickup", {repairID: repair._id, pickupDemoDone: pickupDemoDone=="on", pickupNotes:pickupNotes})
            update(rep.data)

            setError("")
            handleClose()
        }catch(e){
            console.log(e)
            setError(String(e.response.data.error))
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
        <ReactModal name='pickupRepair' isOpen={showAddModal} contentLabel="Pickup" style={customStyles}>
            <form onSubmit={handleSubmit}>
                    <h3>Pick Up</h3>
                    <label>
                        Pick Up Notes:
                        <br />
                        <textarea name='pickupNotes' />
                    </label>
                    <br />
                    <label>
                        Repair Success:
                        <input type='checkbox' name='pickupDemoDone'  />
                    </label>
                    <br />
  
                <br />
                <button onClick={handleClose}>Cancel</button>
                <button type='submit'>Picked Up</button>
            </form>

            <p>{error}</p>

        </ReactModal>
    )
}

export default PickUp