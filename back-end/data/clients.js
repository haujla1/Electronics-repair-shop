import { ObjectId } from "mongodb";
import { clients } from "../config/mongoCollections.js";
import {
  validateString,
  validatePhoneNumber,
  validateEmail,
  validateAge,
  validateObjectId,
} from "../util/validationUtil.js";
import { redisClient } from "../redis.js";

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
  phoneNumber = validatePhoneNumber(phoneNumber);
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
  id = validateObjectId(id, "Client ID");
  try {
    const cacheKey = `client:${id}`;
    const cachedClient = await redisClient.get(cacheKey);
    if (cachedClient) {
      return JSON.parse(cachedClient);
    }
  } catch (error) {
    console.error("Redis get error:", error);
  }
  let clientCollection = await clients();
  let client = await clientCollection.findOne({ _id: new ObjectId(id) });
  if (client) {
    client._id = client._id.toString();
    try {
      const cacheKey = `client:${id}`;
      await redisClient.set(cacheKey, JSON.stringify(client));
      await redisClient.expire(cacheKey, 3600);
    } catch (error) {
      throw ("Redis set error:", error.message);
    }
    return client;
  } else {
    if (client === null) throw "No client with that id";
  }
};

export const getClientByPhoneNumber = async (phoneNumber) => {
  phoneNumber = validatePhoneNumber(phoneNumber);
  const cacheKey = `client:phone:${phoneNumber.trim()}`;
  try {
    const cachedClient = await redisClient.get(cacheKey);
    if (cachedClient) {
      return JSON.parse(cachedClient);
    }
  } catch (error) {
    console.error("Redis get error:", error);
  }

  let clientCollection = await clients();
  let client = await clientCollection.findOne({
    phoneNumber: phoneNumber.trim(),
  });
  if (client) {
    try {
      await redisClient.set(cacheKey, JSON.stringify(client));
      await redisClient.expire(cacheKey, 3600);
    } catch (error) {
      throw ("Redis set error:", error.message);
    }
    return client;
  } else {
    throw "No client found with the provided phone number";
  }
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
    _id: new ObjectId(),
    deviceType: validatedDeviceType,
    manufacturer: validatedManufacturer,
    modelName: validatedModelName,
    modelNumber: validatedModelNumber,
    serialNumber: validatedSerialNumber,
  };
  newDevice._id = newDevice._id.toString();
  client.Devices.push(newDevice);
  const updatedInfo = await clientCollection.updateOne(
    { _id: new ObjectId(clientId) },
    { $set: { Devices: client.Devices } }
  );

  if (!updatedInfo.acknowledged || updatedInfo.modifiedCount === 0) {
    throw "Could not update client successfully";
  }

  return newDevice;
};
