import React, {useEffect, useState, useContext} from "react";

import ReactModal from 'react-modal';
import axios from "axios";





ReactModal.setAppElement('#root')

const PickUp = ({repair, isOpen, handleClose}) => {
    let [showAddModal, setShowAddModal] = useState(isOpen)
    const [error, setError] = useState("")


    async function handleSubmit(e){
        e.preventDefault()
        setError("")
        try{

            //make the axios
    
        
            handleClose()
        }catch(e){
            setError(String(e))
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
          borderRadius: '4px'
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