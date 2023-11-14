import { ObjectId } from "mongodb";
import { clients } from "../config/mongoCollections.js";
import {
  validateString,
  validatePhoneNumber,
  validateEmail,
  validateAge,
} from "../util/validationUtil.js";

export const createClient = async (
  firstName,
  lastName,
  phoneNumber,
  email,
  address,
  age
) => {
  firstName = validateString(firstName, "First Name");
  lastName = validateString(lastName, "Last Name");
  validatePhoneNumber(phoneNumber);
  email = validateEmail(email, "Email");
  address = validateString(address, "Address");
  age = validateAge(age, "Age");

  let clientCollection = await clients();
  let newClient = {
    _id: new ObjectId(),
    name: `${firstName} ${lastName}`,
    phoneNumber: phoneNumber,
    email: email,
    address: address,
    age: age,
    Devices: [],
    Repairs: [],
  };

  const insertInfo = await clientCollection.insertOne(newClient);
  const client = getClientById(newClient._id.toString());
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    return "Was not able to add client.";
  } else {
    return client;
  }
};

export const getClientById = async (id) => {
  if (!id) throw "You must provide an id to search for";
  if (typeof id !== "string") throw "Id must be a string";
  id = id.trim();
  if (id.length === 0) throw "Id cannot be empty";
  if (!ObjectId.isValid(id)) throw "invalid object ID";

  let clientCollection = await clients();
  let client = await clientCollection.findOne({ _id: new ObjectId(id) });
  if (client) {
    client._id = client._id.toString();
    return client;
  } else {
    if (client === null) throw "No client with that id";
  }
};

export const getClientByPhoneNumber = async (phoneNumber) => {
  validatePhoneNumber(phoneNumber);

  let clientCollection = await clients();
  let client = await clientCollection.findOne({
    phoneNumber: phoneNumber.trim(),
  });
  if (client === null) throw "No client found with the provided phone number";
  return client;
};

export const addDeviceToClient = async (
  clientId,
  deviceType,
  manufacturer,
  modelName,
  modelNumber,
  serialNumber
) => {
  validateString(clientId, "Client ID");
  if (!ObjectId.isValid(clientId)) throw "Invalid object ID";

  const validatedDeviceType = validateString(deviceType, "Device Type");
  const validatedManufacturer = validateString(manufacturer, "Manufacturer");
  const validatedModelName = validateString(modelName, "Model Name");
  const validatedModelNumber = validateString(modelNumber, "Model Number");
  const validatedSerialNumber = validateString(serialNumber, "Serial Number");

  let clientCollection = await clients();
  let client = await clientCollection.findOne({ _id: new ObjectId(clientId) });
  if (client === null) throw "No client with that id";

  let newDevice = {
    _id: new ObjectId().toString(),
    deviceType: validatedDeviceType,
    manufacturer: validatedManufacturer,
    modelName: validatedModelName,
    modelNumber: validatedModelNumber,
    serialNumber: validatedSerialNumber,
  };

  client.Devices.push(newDevice);
  const updatedInfo = await clientCollection.updateOne(
    { _id: new ObjectId(clientId) },
    { $set: { Devices: client.Devices } }
  );

  if (!updatedInfo.acknowledged || updatedInfo.modifiedCount === 0) {
    throw "Could not update client successfully";
  }

  return await getClientById(clientId);
};
