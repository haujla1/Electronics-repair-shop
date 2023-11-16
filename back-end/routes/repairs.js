import { Router } from 'express';
const router = Router();
import {
    createRepair,
    getWorkorderById,
    updateWorkorderAfterRepair,
    updateWorkorderAfterPickup
} from '../data/clients.js';
import { ObjectId } from 'mongodb';
import emailValidator from 'email-validator';
import xss from 'xss';

/**
 * potential routes and HTTP actions:
 * /repairs
 * POST / (create repair)
 * GET /:id (get repair by ID)
 * PUT /afterRepair (update repair after repair)
 * PUT /afterPickup (update repair after pickup)
 */

router.post('/', async (req, res) => {
    console.log(req.body);
    try {
        if(typeof(req.body.clientId) === 'undefined') throw "You must provide an id to search for";
        if(typeof(req.body.clientId) !== "string") throw "Id must be a string";
        req.body.clientId = req.body.clientId.trim();
        if(req.body.clientId.length === 0) throw "Id cannot be empty";
        if(!ObjectId.isValid(req.body.clientId)) throw 'invalid object ID'
    
        if(typeof(req.body.deviceID) === 'undefined') throw "You must provide an id to search for";
        if(typeof(req.body.deviceID) !== "string") throw "Id must be a string";
        req.body.deviceID = req.body.deviceID.trim();
        if(req.body.deviceID.length === 0) throw "Id cannot be empty";
        if(!ObjectId.isValid(req.body.deviceID)) throw 'invalid object ID'
    
        if (typeof(req.body.workOrder) === 'undefined') throw "You must provide a work order";
        if(typeof(req.body.workOrder) !== "object") throw "Work order must be an object";
        if(Object.keys(req.body.workOrder).length === 0 ) throw "Work order cannot be empty";
        
        if(typeof(req.body.workOrder.clientPreferredEmail) === 'undefined') throw "You must provide a client preferred email";
        if(typeof(req.body.workOrder.clientPreferredEmail) !== "string") throw "Client preferred email must be a string";
        req.body.workOrder.clientPreferredEmail = req.body.workOrder.clientPreferredEmail.trim();
        if(req.body.workOrder.clientPreferredEmail.length === 0) throw "Client preferred email cannot be empty";
        if(!emailValidator.validate(req.body.workOrder.clientPreferredEmail)) throw "Client preferred email is not valid";
        req.body.workOrder.clientPreferredEmail = xss(req.body.workOrder.clientPreferredEmail);
    
        if(typeof(req.body.workOrder.clientPreferredPhoneNumber) === 'undefined') throw "You must provide a client preferred phone number";
        if(typeof(req.body.workOrder.clientPreferredPhoneNumber) !== "number") throw "Client preferred phone number must be a number";
        if(req.body.workOrder.clientPreferredPhoneNumber.toString().length !== 10) throw "Client preferred phone number must be 10 digits long";
        if(req.body.workOrder.clientPreferredPhoneNumber < 0) throw "Client preferred phone number cannot be negative";
        if(isNaN(req.body.workOrder.clientPreferredPhoneNumber)) throw "Client preferred phone number must be a number";
        
        if(typeof(req.body.workOrder.issue) === 'undefined') throw "You must provide an issue";
        if(typeof(req.body.workOrder.issue) !== "string") throw "Issue must be a string";
        req.body.workOrder.issue = req.body.workOrder.issue.trim();
        if(req.body.workOrder.issue.length === 0) throw "Issue cannot be empty";
        req.body.workOrder.issue = xss(req.body.workOrder.issue);
    
        if(typeof(req.body.workOrder.wasIssueVerified) === 'undefined') throw "You must provide a was issue verified";
        if(typeof(req.body.workOrder.wasIssueVerified) !== "boolean") throw "Was issue verified must be a boolean";
    
        if(typeof(req.body.workOrder.stepsTakenToReplicateIssue) === 'undefined') throw "You must provide steps taken to replicate issue";
        if(typeof(req.body.workOrder.stepsTakenToReplicateIssue) !== "string") throw "Steps taken to replicate issue must be a string";
        req.body.workOrder.stepsTakenToReplicateIssue = req.body.workOrder.stepsTakenToReplicateIssue.trim();
        if(req.body.workOrder.stepsTakenToReplicateIssue.length === 0) throw "Steps taken to replicate issue cannot be empty";
        req.body.workOrder.stepsTakenToReplicateIssue = xss(req.body.workOrder.stepsTakenToReplicateIssue);
    
        if(typeof(req.body.workOrder.workToBeDone) === 'undefined') throw "You must provide work to be done";
        if(typeof(req.body.workOrder.workToBeDone) !== "string") throw "Work to be done must be a string";
        req.body.workOrder.workToBeDone = req.body.workOrder.workToBeDone.trim();
        if(req.body.workOrder.workToBeDone.length === 0) throw "Work to be done cannot be empty";
        req.body.workOrder.workToBeDone = xss(req.body.workOrder.workToBeDone);
    
        if(typeof(req.body.workOrder.conditionOfDevice) === 'undefined') throw "You must provide a condition of device";
        if(typeof(req.body.workOrder.conditionOfDevice) !== "string") throw "Condition of device must be a string";
        req.body.workOrder.conditionOfDevice = req.body.workOrder.conditionOfDevice.trim();
        if(req.body.workOrder.conditionOfDevice.length === 0) throw "Condition of device cannot be empty";
        req.body.workOrder.conditionOfDevice = xss(req.body.workOrder.conditionOfDevice);
    } catch (e) {
        res.status(400).json({error: e});
        return;
    }

    try {
        const repair = await createRepair(
            xss(req.body.clientId),
            xss(req.body.deviceID),
            req.body.workOrder
        );
        res.json(repair);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

router.get('/:id', async (req, res) => {
    try {
        if(typeof(req.params.id) === 'undefined') throw "You must provide an id to search for";
        if(typeof(req.params.id) !== "string") throw "Id must be a string";
        req.params.id = req.params.id.trim();
        if(req.params.id.length === 0) throw "Id cannot be empty";
        if(!ObjectId.isValid(req.params.id)) throw 'invalid object ID'
    } catch (e) {
        res.status(400).json({error: e});
        return;
    }

    try {
        const repair = await getWorkorderById(xss(req.params.id));
        res.json(repair);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

router.put('/afterRepair', async (req, res) => {
    console.log(req.body);
    try {
        if(typeof(req.body.repairID) === 'undefined') throw "You must provide an id to search for";
        if(typeof(req.body.repairID) !== "string") throw "Id must be a string";
        req.body.repairID = req.body.repairID.trim();
        if(req.body.repairID.length === 0) throw "Id cannot be empty";
        if(!ObjectId.isValid(req.body.repairID)) throw 'invalid object ID'
    
        if (typeof(req.body.repiarNotes) === 'undefined') throw "You must provide repair notes";
        if(typeof(req.body.repiarNotes) !== "string") throw "Repair notes must be a string";
        req.body.repiarNotes = req.body.repiarNotes.trim();
        if(req.body.repiarNotes.length === 0) throw "Repair notes cannot be empty";
    
        if (typeof(req.body.wasTheRepairSuccessful) === 'undefined') throw "You must provide was the repair successful";
        if(typeof(req.body.wasTheRepairSuccessful) !== "boolean") throw "Was the repair successful must be a boolean";
    } catch (e) {
        res.status(400).json({error: e});
        return;
    }

    try {
        const repair = await updateWorkorderAfterRepair(
            xss(req.body.repairID),
            xss(req.body.repiarNotes),
            req.body.wasTheRepairSuccessful
        );
        res.json(repair);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

router.put('/afterPickup', async (req, res) => {
    console.log(req.body);
    try {
        if(typeof(req.body.repairID) === 'undefined') throw "You must provide an id to search for";
        if(typeof(req.body.repairID) !== "string") throw "Id must be a string";
        req.body.repairID = req.body.repairID.trim();
        if(req.body.repairID.length === 0) throw "Id cannot be empty";
        if(!ObjectId.isValid(req.body.repairID)) throw 'invalid object ID'
    
        if (typeof(req.body.pickupDemoDone) === 'undefined') throw "You must provide pickup demo done";
        if(typeof(req.body.pickupDemoDone) !== "boolean") throw "Pickup demo done must be a boolean";
    
        if (typeof(req.body.pickupNotes) === 'undefined') throw "You must provide pickup notes";
        if(typeof(req.body.pickupNotes) !== "string") throw "Pickup notes must be a string";
        req.body.pickupNotes = req.body.pickupNotes.trim();
        if(req.body.pickupNotes.length === 0) throw "Pickup notes cannot be empty";
    } catch (e) {
        res.status(400).json({error: e});
        return;
    }

    try {
        const repair = await updateWorkorderAfterPickup(
            xss(req.body.repairID),
            req.body.pickupDemoDone,
            xss(req.body.pickupNotes)
        );
        res.json(repair);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

export default router;