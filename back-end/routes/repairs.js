import { Router } from 'express';
const repairRouter = Router();
import {
    createRepair,
    getWorkorderById,
    updateWorkorderAfterRepair,
    updateWorkorderAfterPickup,
    getActiveRepairs,
    makeCheckInReport,
    getReadyForPickupRepairs
} from '../data/repairs.js';
import { 
    validateString,
    validateEmail,
    validatePhoneNumber,
    validateObjectId
} from '../util/validationUtil.js';
import xss from 'xss';

/**
 * potential routes and HTTP actions:
 * /repairs
 * POST / (create repair)
 * GET /:id (get repair by ID)
 * GET /activeRepairs (get all active repairs)
 * GET /readyForPickupRepairs (get all repairs ready for pickup)
 * PUT /afterRepair (update repair after repair)
 * PUT /afterPickup (update repair after pickup)
 */


repairRouter.put('/afterRepair', async (req, res) => {
    console.log(req.body);
    try {
        if (typeof req.body.repairID === 'undefined') throw "You must provide a Repair ID";
        req.body.repairID = validateObjectId(req.body.repairID, "Repair ID");
        req.body.repairID = validateString(req.body.repairID, "Repair ID");
        req.body.repairID = xss(req.body.repairID);
    
        if (typeof req.body.repairNotes === 'undefined') throw "You must provide Repair Notes";
        req.body.repairNotes = validateString(req.body.repairNotes, "Repair Notes");
        req.body.repairNotes = xss(req.body.repairNotes);
    
        if (typeof req.body.wasTheRepairSuccessful === 'undefined') throw "You must provide Was the Repair Successful";
        if (typeof req.body.wasTheRepairSuccessful !== 'boolean') throw "Was the Repair Successful must be a boolean";
    } catch (e) {
        res.status(400).json({error: e});
        return;
    }

    try {
        const repair = await updateWorkorderAfterRepair(
            req.body.repairID,
            req.body.repairNotes,
            req.body.wasTheRepairSuccessful
        );
        res.json(repair);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

repairRouter.put('/afterPickup', async (req, res) => {
    console.log(req.body);
    try {
        if (typeof req.body.repairID === 'undefined') throw "You must provide a Repair ID";
        req.body.repairID = validateObjectId(req.body.repairID, "Repair ID");
        req.body.repairID = validateString(req.body.repairID, "Repair ID");
        req.body.repairID = xss(req.body.repairID);
    
        if (typeof req.body.pickupDemoDone === 'undefined') throw "You must provide Pickup Demo Done";
        if (typeof req.body.pickupDemoDone !== "boolean") throw "Pickup Demo Done must be a boolean";
    
        if (typeof req.body.pickupNotes === 'undefined') throw "You must provide Pickup Notes";
        req.body.pickupNotes = validateString(req.body.pickupNotes, "Pickup Notes");
        req.body.pickupNotes = xss(req.body.pickupNotes);
    } catch (e) {
        res.status(400).json({error: e});
        return;
    }

    try {
        const repair = await updateWorkorderAfterPickup(
            req.body.repairID,
            req.body.pickupDemoDone,
            req.body.pickupNotes
        );
        res.json(repair);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

repairRouter.get('/activeRepairs', async (req, res) =>
{
    try 
    {
        const repairs = await getActiveRepairs();
        res.json(repairs);
    } 
    catch (e) {

        res.status(404).json({error: e});
    }
});

repairRouter.post('/checkInReport', async (req, res) => 
{
    if (typeof req.body.reportData === 'undefined') throw "You must provide report data";
    let data = req.body.reportData;
    //reportData is a JSON object

    try {
        const pdfData = await makeCheckInReport(data);

        // Set headers for PDF response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Checkin-report.pdf'); // Or 'inline' to display in the browser

        // Send the PDF data as the response
        res.send(pdfData);
    }
    catch (e)
    {
        res.status(400).json({error: e});
    }
});

repairRouter.get('/readyForPickupRepairs', async (req, res) =>
{
    try 
    {
        const repairs = await getReadyForPickupRepairs();
        res.json(repairs);
    } 
    catch (e) {

        res.status(404).json({error: e});
    }
});

repairRouter.post('/', async (req, res) => {
    console.log(req.body);
    try {
        if (typeof req.body.clientId === 'undefined') throw "You must provide a Client ID";
        req.body.clientId = validateObjectId(req.body.clientId, "Client ID");
        req.body.clientId = xss(req.body.clientId);
    
        if (typeof req.body.deviceID === 'undefined') throw "You must provide a Device ID";
        req.body.deviceID = validateObjectId(req.body.deviceID, "Device ID");
        req.body.deviceID = xss(req.body.deviceID);
    
        if (
            !req.body.workOrder ||
            typeof req.body.workOrder !== "object" ||
            Object.keys(req.body.workOrder).length === 0
        ) {
            throw "Work order must be a non-empty object";
        }
        
        if (typeof req.body.workOrder.clientPreferredEmail === 'undefined') throw "You must provide a Client Preferred Email";
        req.body.workOrder.clientPreferredEmail = validateEmail(req.body.workOrder.clientPreferredEmail);
        req.body.workOrder.clientPreferredEmail = xss(req.body.workOrder.clientPreferredEmail);
    
        if (typeof req.body.workOrder.clientPreferredPhoneNumber === 'undefined') throw "You must provide a Client Preferred Phone Number";
        req.body.workOrder.clientPreferredPhoneNumber = validatePhoneNumber(req.body.workOrder.clientPreferredPhoneNumber);
        req.body.workOrder.clientPreferredPhoneNumber = xss(req.body.workOrder.clientPreferredPhoneNumber);
        
        if (typeof req.body.workOrder.issue === 'undefined') throw "You must provide an Issue";
        req.body.workOrder.issue = validateString(req.body.workOrder.issue, "Issue");
        req.body.workOrder.issue = xss(req.body.workOrder.issue);
    
        if (typeof req.body.workOrder.wasIssueVerified === 'undefined') throw "You must provide a Was Issue Verified";
        if (typeof req.body.workOrder.wasIssueVerified !== "boolean") throw "Was Issue Verified must be a boolean";
    
        if (typeof req.body.workOrder.stepsTakenToReplicateIssue === 'undefined') throw "You must provide Steps Taken To Replicate Issue";
        req.body.workOrder.stepsTakenToReplicateIssue = validateString(req.body.workOrder.stepsTakenToReplicateIssue, "Steps Taken To Replicate Issue");
        req.body.workOrder.stepsTakenToReplicateIssue = xss(req.body.workOrder.stepsTakenToReplicateIssue);
    
        if (typeof req.body.workOrder.workToBeDone === 'undefined') throw "You must provide Work To Be Done";
        req.body.workOrder.workToBeDone = validateString(req.body.workOrder.workToBeDone, "Work To Be Done");
        req.body.workOrder.workToBeDone = xss(req.body.workOrder.workToBeDone);
    
        if (typeof req.body.workOrder.conditionOfDevice === 'undefined') throw "You must provide a Condition Of Device";
        req.body.workOrder.conditionOfDevice = validateString(req.body.workOrder.conditionOfDevice, "Condition Of Device");
        req.body.workOrder.conditionOfDevice = xss(req.body.workOrder.conditionOfDevice);
    } catch (e) {
        res.status(400).json({error: e});
        return;
    }

    try {
        const repair = await createRepair(
            req.body.clientId,
            req.body.deviceID,
            req.body.workOrder
        );
        res.json(repair);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

repairRouter.get('/:id', async (req, res) => {
    try {
        if (typeof req.params.id === 'undefined') throw "You must provide a Repair ID";
        req.params.id = validateObjectId(req.params.id, "Repair ID");
        req.params.id = xss(req.params.id);
    } catch (e) {
        res.status(400).json({error: e});
        return;
    }

    try {
        const repair = await getWorkorderById(req.params.id);
        res.json(repair);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

export default repairRouter;