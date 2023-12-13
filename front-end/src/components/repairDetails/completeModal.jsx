import React, {useEffect, useState, useContext} from "react";

import ReactModal from 'react-modal';
import axios from "axios";





ReactModal.setAppElement('#root')

const Edit = ({repair, isOpen, handleClose, update}) => {
    let [showAddModal, setShowAddModal] = useState(isOpen)
    const [error, setError] = useState("")


    async function handleSubmit(e){
        e.preventDefault()
        setError("")
        try{
            
            let repairTechnicianNotes = e.target.repairTechnicianNotes.value
            let wasTheRepairSuccessful = e.target.wasTheRepairSuccessful.checked

            if(typeof repairTechnicianNotes != "string" || repairTechnicianNotes.trim().length < 1){
                setError("Must add Pick Up Notes.")
                return
            }
            if(typeof wasTheRepairSuccessful != "boolean" || e.target.wasTheRepairSuccessful.value != "on"){
                setError("Error: pickup type must be boolean")
                return
            }
            //make the axios
            let rep = await axios.put("http://localhost:3000/repairs/afterRepair", {repairID: repair._id, wasTheRepairSuccessful: wasTheRepairSuccessful, repairNotes:repairTechnicianNotes})
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

      var tzoffset = (new Date()).getTimezoneOffset() * 60000;

    return (
        <ReactModal name='completeRepair' isOpen={showAddModal} contentLabel="Complete" style={customStyles}>
            <form onSubmit={handleSubmit}>
                
                    <h3>Complete Repair</h3>
                    <label>
                        Repair Notes:
                        <br />
                        <textarea name='repairTechnicianNotes'  />
                    </label>
                    <br />
                    <label>
                        Repair Success:
                        <input type='checkbox' name='wasTheRepairSuccessful'  />
                    </label>
                    <br />
                
                
                <br />
                <button onClick={handleClose}>Cancel</button>
                <button type='submit'>Complete</button>
            </form>

            <p>{error}</p>

        </ReactModal>
    )
}

export default Edit