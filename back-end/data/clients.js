import { ObjectId } from "mongodb";
import {clients} from "../config/mongoCollections.js";

//need create client
//need get client by id
//need get all client
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
