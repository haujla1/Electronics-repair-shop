import { ObjectId } from "mongodb";
import {clients} from "../config/mongoCollections.js";
import emailValidator from 'email-validator';
import {isAfter, isValid, parse, format} from 'date-fns';

//need create client
//need get client by id
//need create repair
//need get repair by id
//need get all repairs for the client
// need update repair after repair
// need update repair after pickup

export const createClient = async(name, phoneNumber)=>
{
    if (!name) throw "You must provide a name for your client";
    if (!phoneNumber) throw "You must provide a phone number for your client";

    if(typeof(name) !== "string") throw "Name must be a string";
    name = name.trim();
    if(name.length === 0) throw "Name cannot be empty";
    if(/\d/.test(name)) throw "Name cannot contain numbers";

    if(typeof(phoneNumber)!== "number") throw "Phone number must be a number";
    if(phoneNumber.toString().length !== 10) throw "Phone number must be 10 digits long";
    if(phoneNumber < 0) throw "Phone number cannot be negative";
    if(isNaN(phoneNumber)) throw "Phone number must be a number";

    let clientCollection = await clients();
    let newClient = 
    {
        _id: new ObjectId(),
        name: name,
        phoneNumber: phoneNumber,
        Devices : [], //empty for now 
	    Repairs: [] // empty for now 
    };
    const insertInfo = await clientCollection.insertOne(newClient);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
    {
        return "Was not able to add client."
    }
    else
    {
        return await getClientById(insertInfo.insertedId.toString());
    }
}

export const getClientById = async(id)=>
{
    if(!id) throw "You must provide an id to search for";
    if(typeof(id) !== "string") throw "Id must be a string";
    id = id.trim();
    if(id.length === 0) throw "Id cannot be empty";
    if(!ObjectId.isValid(id)) throw 'invalid object ID'

    let clientCollection = await clients();
    let client = await clientCollection.findOne({_id: new ObjectId(id)});
    if(client === null) throw "No client with that id";
    return client;
}

export const getClientByPhoneNumber = async(phoneNumber)=>
{
    if(!phoneNumber) throw "You must provide a phone number to search for";
    if(typeof(phoneNumber) !== "number") throw "Phone number must be a number";
    if(phoneNumber.toString().length !== 10) throw "Phone number must be 10 digits long";
    if(phoneNumber < 0) throw "Phone number cannot be negative";
    if(isNaN(phoneNumber)) throw "Phone number must be a number";

    let clientCollection = await clients();
    let client = await clientCollection.findOne({phoneNumber: phoneNumber});
    if(client === null) throw "No client with that phone number";
    return client;
}

export const addDeviceToClient = async(clientId, deviceType, manufacturer, modelName, modelNumber, serialNumber)=>
{
    if(!clientId) throw "You must provide an id to search for";
    if(typeof(clientId) !== "string") throw "Id must be a string";
    clientId = clientId.trim();
    if(clientId.length === 0) throw "Id cannot be empty";
    if(!ObjectId.isValid(clientId)) throw 'invalid object ID'

    if (!deviceType) throw "You must provide a device type";
    if (!manufacturer) throw "You must provide a manufacturer";
    if (!modelName) throw "You must provide a model name";
    if (!modelNumber) throw "You must provide a model number";
    if (!serialNumber) throw "You must provide a serial number";

    if(typeof(deviceType) !== "string") throw "Device type must be a string";
    deviceType = deviceType.trim();
    if(deviceType.length === 0) throw "Device type cannot be empty";

    if(typeof(manufacturer) !== "string") throw "Manufacturer must be a string";
    manufacturer = manufacturer.trim();
    if(manufacturer.length === 0) throw "Manufacturer cannot be empty";

    if(typeof(modelName) !== "string") throw "Model name must be a string";
    modelName = modelName.trim();
    if(modelName.length === 0) throw "Model name cannot be empty";

    if(typeof(modelNumber) !== "string") throw "Model number must be a string";
    modelNumber = modelNumber.trim();
    if(modelNumber.length === 0) throw "Model number cannot be empty";

    if(typeof(serialNumber) !== "string") throw "Serial number must be a string";
    serialNumber = serialNumber.trim();
    if(serialNumber.length === 0) throw "Serial number cannot be empty";

    let clientCollection = await clients();
    let client = await clientCollection.findOne({_id: new ObjectId(clientId)});
    if(client === null) throw "No client with that id";

    let newDevice = 
    {
        _id: new ObjectId(),
        deviceType: deviceType,
        manufacturer: manufacturer,
        modelName: modelName,
        modelNumber: modelNumber,
        serialNumber: serialNumber
    };

    client.Devices.push(newDevice);
    const updatedInfo = await clientCollection.updateOne({_id: new ObjectId(clientId)}, {$set: client});
    if (!updatedInfo.acknowledged || updatedInfo.modifiedCount === 0)
    {
        throw 'Could not update client successfully';
    }
    
    return await getClientById(clientId);

}

export const createRepair = async(clientId, deviceID, workOrder)=>
{
    if(!clientId) throw "You must provide an id to search for";
    if(typeof(clientId) !== "string") throw "Id must be a string";
    clientId = clientId.trim();
    if(clientId.length === 0) throw "Id cannot be empty";
    if(!ObjectId.isValid(clientId)) throw 'invalid object ID'

    if(!deviceID) throw "You must provide an id to search for";
    if(typeof(deviceID) !== "string") throw "Id must be a string";
    deviceID = deviceID.trim();
    if(deviceID.length === 0) throw "Id cannot be empty";
    if(!ObjectId.isValid(deviceID)) throw 'invalid object ID'

    let clientCollection = await clients();
    let client = await clientCollection.findOne({_id: new ObjectId(clientId)});
    if(client === null) throw "No client with that id";

    let device = client.Devices.find(device => device._id.toString() === deviceID);
    if(device === undefined) throw "No device with that id for this client";

    if (!workOrder) throw "You must provide a work order";
    if(typeof(workOrder) !== "object") throw "Work order must be an object";
    let workOrderKeys = Object.keys(workOrder); 
    if(Object.keys(workOrder).length === 0 ) throw "Work order cannot be empty";
    
    if(!workOrder.clientPreferredEmail) throw "You must provide a client preferred email";
    if(typeof(workOrder.clientPreferredEmail) !== "string") throw "Client preferred email must be a string";
    workOrder.clientPreferredEmail = workOrder.clientPreferredEmail.trim();
    if(workOrder.clientPreferredEmail.length === 0) throw "Client preferred email cannot be empty";
    if(!emailValidator.validate(workOrder.clientPreferredEmail)) throw "Client preferred email is not valid";

    if(!workOrder.clientPreferredPhoneNumber) throw "You must provide a client preferred phone number";
    if(typeof(workOrder.clientPreferredPhoneNumber) !== "number") throw "Client preferred phone number must be a number";
    if(workOrder.clientPreferredPhoneNumber.toString().length !== 10) throw "Client preferred phone number must be 10 digits long";
    if(workOrder.clientPreferredPhoneNumber < 0) throw "Client preferred phone number cannot be negative";
    if(isNaN(workOrder.clientPreferredPhoneNumber)) throw "Client preferred phone number must be a number";
    
    if(!workOrder.issue) throw "You must provide an issue";
    if(typeof(workOrder.issue) !== "string") throw "Issue must be a string";
    workOrder.issue = workOrder.issue.trim();
    if(workOrder.issue.length === 0) throw "Issue cannot be empty";

    if(!workOrder.wasIssueVerified) throw "You must provide a was issue verified";
    if(typeof(workOrder.wasIssueVerified) !== "boolean") throw "Was issue verified must be a boolean";

    if(!workOrder.stepsTakenToReplicateIssue) throw "You must provide steps taken to replicate issue";
    if(typeof(workOrder.stepsTakenToReplicateIssue) !== "string") throw "Steps taken to replicate issue must be a string";
    workOrder.stepsTakenToReplicateIssue = workOrder.stepsTakenToReplicateIssue.trim();
    if(workOrder.stepsTakenToReplicateIssue.length === 0) throw "Steps taken to replicate issue cannot be empty";

    if(!workOrder.workToBeDone) throw "You must provide work to be done";
    if(typeof(workOrder.workToBeDone) !== "string") throw "Work to be done must be a string";
    workOrder.workToBeDone = workOrder.workToBeDone.trim();
    if(workOrder.workToBeDone.length === 0) throw "Work to be done cannot be empty";

    if(!workOrder.conditionOfDevice) throw "You must provide a condition of device";
    if(typeof(workOrder.conditionOfDevice) !== "string") throw "Condition of device must be a string";
    workOrder.conditionOfDevice = workOrder.conditionOfDevice.trim();
    if(workOrder.conditionOfDevice.length === 0) throw "Condition of device cannot be empty";

    let newRepair = 
    {
        _id: new ObjectId(),
        clientID: clientId,
        deviceID: deviceID,
        clientPreferredEmail: workOrder.clientPreferredEmail,
        clientPreferredPhoneNumber: workOrder.clientPreferredPhoneNumber,
        repairOrderCreationDate: new Date(),
        issue: workOrder.issue,
        wasIssueVerified: workOrder.wasIssueVerified,
        stepsTakenToReplicateIssue: workOrder.stepsTakenToReplicateIssue,
        workToBeDone: workOrder.workToBeDone,
        conditionOfDevice: workOrder.conditionOfDevice,
        repairStatus: "In Progress",
    }

    client.Repairs.push(newRepair);
    const updatedInfo = await clientCollection.updateOne({_id: new ObjectId(clientId)}, {$set: client});
    if (!updatedInfo.acknowledged || updatedInfo.modifiedCount === 0)
    {
        throw 'Could not update client successfully';
    }
    return newRepair;
}


export const getWorkorderById = async(repairId)=>
{
    if(!repairId) throw "You must provide an id to search for";
    if(typeof(repairId) !== "string") throw "Id must be a string";
    repairId = repairId.trim();
    if(repairId.length === 0) throw "Id cannot be empty";
    if(!ObjectId.isValid(repairId)) throw 'invalid object ID'

    let clientCollection = await clients();
    let allClients = await clientCollection.find({}).toArray();
    let repair = undefined;

    for(let i = 0; i < allClients.length; i++)
    {
        repair = allClients[i].Repairs.find(repair => repair._id.toString() === repairId);
        if(repair !== undefined) break;
    }
    if(repair === undefined) throw "No repair with that id";
    return repair;
}

export const updateWorkorderAfterRepair = async(repairID, repiarNotes, wasTheRepairSuccessful)=>
{
    if(!repairID) throw "You must provide an id to search for";
    if(typeof(repairID) !== "string") throw "Id must be a string";
    repairID = repairID.trim();
    if(repairID.length === 0) throw "Id cannot be empty";
    if(!ObjectId.isValid(repairID)) throw 'invalid object ID'

    if (!repiarNotes) throw "You must provide repair notes";
    if(typeof(repiarNotes) !== "string") throw "Repair notes must be a string";
    repiarNotes = repiarNotes.trim();
    if(repiarNotes.length === 0) throw "Repair notes cannot be empty";

    if (!wasTheRepairSuccessful) throw "You must provide was the repair successful";
    if(typeof(wasTheRepairSuccessful) !== "boolean") throw "Was the repair successful must be a boolean";


    let repair = await getWorkorderById(repairID);
    if(repair === null) throw "No repair with that id";
    
    const updateFilter = 
    {
        _id: new ObjectId(repair.clientID),
        "Repairs._id": new ObjectId(repairID)
    };

    const updateQuery = 
    {
        $set: 
        {
            "Repairs.$.repairTechnicianNotes": repiarNotes,
            "Repairs.$.wasTheRepairSuccessful": wasTheRepairSuccessful,
            "Repairs.$.repairStatus": "ready to be picked up",
            "Repairs.$.isDevicePickedUpAlready": false,
            "Repairs.$.repairCompletionDate": new Date()
        }
    };

    let clientCollection = await clients();
    const updatedInfo = await clientCollection.updateOne(updateFilter, updateQuery);

    if (!updatedInfo.acknowledged || updatedInfo.modifiedCount === 0) {
        throw 'Could not update the repair successfully';
    }
    return await getWorkorderById(repairID);

}

export const updateWorkorderAfterPickup = async(repairID, pickupDemoDone,pickupNotes)=>
{
    if(!repairID) throw "You must provide an id to search for";
    if(typeof(repairID) !== "string") throw "Id must be a string";
    repairID = repairID.trim();
    if(repairID.length === 0) throw "Id cannot be empty";
    if(!ObjectId.isValid(repairID)) throw 'invalid object ID'

    if (!pickupDemoDone) throw "You must provide pickup demo done";
    if(typeof(pickupDemoDone) !== "boolean") throw "Pickup demo done must be a boolean";

    if (!pickupNotes) throw "You must provide pickup notes";
    if(typeof(pickupNotes) !== "string") throw "Pickup notes must be a string";
    pickupNotes = pickupNotes.trim();
    if(pickupNotes.length === 0) throw "Pickup notes cannot be empty";

    let repair = await getWorkorderById(repairID);
    if(repair === null) throw "No repair with that id";

    const updateFilter = 
    {
        _id: new ObjectId(repair.clientID),
        "Repairs._id": new ObjectId(repairID)
    };

    const updateQuery = 
    {
        $set: 
        {
            "Repairs.$.pickupDemoDone": pickupDemoDone,
            "Repairs.$.pickupNotes": pickupNotes,
            "Repairs.$.isDevicePickedUpAlready": true,
            "Repairs.$.repairStatus": "completed",
            "Repairs.$.pickupDate": new Date()
        }
    };

    let clientCollection = await clients();
    const updatedInfo = await clientCollection.updateOne(updateFilter, updateQuery);

    if (!updatedInfo.acknowledged || updatedInfo.modifiedCount === 0) {
        throw 'Could not update the repair successfully';
    }
    return await getWorkorderById(repairID);
}

