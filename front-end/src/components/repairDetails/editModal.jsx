import React, {useEffect, useState, useContext} from "react";

import ReactModal from 'react-modal';
import axios from "axios";





ReactModal.setAppElement('#root')

const Edit = ({repair, isOpen, handleClose}) => {
    let [showAddModal, setShowAddModal] = useState(isOpen)
    const [error, setError] = useState("")


    async function handleSubmit(e){
        e.preventDefault()
        setError("")
        try{
            let date =e.target.repairOrderCreationDate.value
            let dateString = date.slice(5,7)+"/" + date.slice(8)+"/"+date.slice(0,4)

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

      var tzoffset = (new Date()).getTimezoneOffset() * 60000;

    return (
        <ReactModal name='editRepair' isOpen={showAddModal} contentLabel="Edit" style={customStyles}>
            <form onSubmit={handleSubmit}>
                <h3>General Info</h3>
                <label>
                    Work Order Opened:
                    <input type='datetime-local' name='repairOrderCreationDate' defaultValue={new Date(new Date(repair.repairOrderCreationDate)-tzoffset).toISOString().slice(0,-1)} />
                </label>
                <br />
                <label>
                    Issue:
                    <br />
                    <textarea name='issue' defaultValue={repair.issue} />
                </label>
                <br />
                <label>
                    Issue Verified:
                    <input type='checkbox' name='wasIssueVerified' defaultChecked={repair.wasIssueVerified} />
                </label>
                <br />
                <label>
                    Verification Reason:
                    <br />
                    <textarea name='stepsTakenToReplicateIssue' defaultValue={repair.stepsTakenToReplicateIssue} />
                </label>
                <br />
                <label>
                    Repairs:
                    <br />
                    <textarea name='workToBeDone' defaultValue={repair.workToBeDone} />
                </label>
                <br />
                <label>
                    Device Condition:
                    <br />
                    <textarea name='conditionOfDevice' defaultValue={repair.conditionOfDevice} />
                </label>
                <br />
                <label>
                    Repair Status:
                    <input type='text' name='repairStatus' defaultValue={repair.repairStatus} />
                </label>
                <br />

                {
                repair["repairCompletionDate"]?
                <>
                    <h3>Repair Completed</h3>
                    <label>
                        Repair Completed:
                        <input type='datetime-local' name='repairCompletionDate' defaultValue={new Date(new Date(repair.repairCompletionDate)-tzoffset).toISOString().slice(0,-1)} />
                    </label>
                    <br />
                    <label>
                        Repair Notes:
                        <br />
                        <textarea name='repairTechnicianNotes' defaultValue={repair.repairTechnicianNotes} />
                    </label>
                    <br />
                    <label>
                        Repair Success:
                        <input type='checkbox' name='wasTheRepairSuccessful' defaultChecked={repair.wasTheRepairSuccessful} />
                    </label>
                    <br />
                
                
                </>
                :<></>
                }

                {
                repair["isDevicePickedUpAlready"]?
                <>
                    <h3>Pick Up</h3>
                    <label>
                        Pick Up Completed:
                        <input type='datetime-local' name='pickupDate' defaultValue={new Date(new Date(repair.pickupDate)-tzoffset).toISOString().slice(0,-1)} />
                    </label>
                    <br />
                    <label>
                        Pick Up Notes:
                        <br />
                        <textarea name='pickupNotes' defaultValue={repair.pickupNotes} />
                    </label>
                    <br />
                    <label>
                        Repair Success:
                        <input type='checkbox' name='pickupDemoDone' defaultChecked={repair.pickupDemoDone} />
                    </label>
                    <br />
                
                
                </>
                :<></>
                }
                
                <br />
                <button onClick={handleClose}>Cancel</button>
                <button type='submit'>Save Changes</button>
            </form>

            <p>{error}</p>

        </ReactModal>
    )
}

export default Edit