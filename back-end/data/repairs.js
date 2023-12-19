import { ObjectId } from "mongodb";
import { clients } from "../config/mongoCollections.js";
import emailValidator from "email-validator";
import { getClientById } from "./clients.js";
import axios from "axios";
import fs from "fs";
import {
  validateString,
  validatePhoneNumber,
  validateObjectId,
  validateEmail,
} from "../util/validationUtil.js";
import constants from "../appConstants.js";
import { sendEmail } from "../nodemailer/sendMailService.js";
import { redisClient } from "../redis.js";

function formatDate(date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
}

export const getDeviceById = async (clientId, deviceId) => {
  validateString(deviceId, "Device ID");
  validateString(clientId, "Client ID");

  if (!ObjectId.isValid(deviceId)) throw "Invalid Device ID format";
  if (!ObjectId.isValid(clientId)) throw "Invalid Client ID format";

  let client = await getClientById(clientId);

  if (!client) throw "No client with that ID";

  let device = client.Devices.find(
    (device) => device._id.toString() === deviceId
  );
  return device;
};

export const createRepair = async (clientId, deviceID, workOrder) => {
  clientId = validateObjectId(clientId, "Client ID");

  deviceID = validateObjectId(deviceID, "Device ID");

  let clientCollection = await clients();
  let client = await clientCollection.findOne({ _id: new ObjectId(clientId) });
  if (client === null) throw "No client with that id";

  let device = client.Devices.find(
    (device) => device._id.toString() === deviceID
  );
  if (device === undefined) throw "No device with that id for this client";

  if (
    !workOrder ||
    typeof workOrder !== "object" ||
    Object.keys(workOrder).length === 0
  ) {
    throw "Work order must be a non-empty object";
  }

  workOrder.clientPreferredEmail = validateEmail(
    workOrder.clientPreferredEmail
  );

  workOrder.clientPreferredPhoneNumber = validatePhoneNumber(
    workOrder.clientPreferredPhoneNumber,
    "Client Preferred Phone Number"
  );

  workOrder.issue = validateString(workOrder.issue, "Issue");

  if (typeof workOrder.wasIssueVerified !== "boolean") {
    throw "Was issue verified must be a boolean";
  }

  workOrder.stepsTakenToReplicateIssue = validateString(
    workOrder.stepsTakenToReplicateIssue,
    "Steps Taken To Replicate Issue"
  );
  workOrder.workToBeDone = validateString(
    workOrder.workToBeDone,
    "Work To Be Done"
  );
  workOrder.conditionOfDevice = validateString(
    workOrder.conditionOfDevice,
    "Condition Of Device"
  );
  const cacheKey = `client:${clientId}`;
  const now = new Date();
  const formattedDate = formatDate(now);

  let newRepair = {
    _id: new ObjectId(),
    clientID: clientId,
    deviceID: deviceID,
    clientPreferredEmail: workOrder.clientPreferredEmail,
    clientPreferredPhoneNumber: workOrder.clientPreferredPhoneNumber,
    repairOrderCreationDate: formattedDate,
    issue: workOrder.issue,
    wasIssueVerified: workOrder.wasIssueVerified,
    stepsTakenToReplicateIssue: workOrder.stepsTakenToReplicateIssue,
    workToBeDone: workOrder.workToBeDone,
    conditionOfDevice: workOrder.conditionOfDevice,
    repairStatus: constants.repairStatus[0],
  };

  client.Repairs.push(newRepair);
  const updatedInfo = await clientCollection.updateOne(
    { _id: new ObjectId(clientId) },
    { $set: client }
  );
  newRepair._id = newRepair._id.toString();
  if (!updatedInfo.acknowledged || updatedInfo.modifiedCount === 0) {
    throw "Could not update client successfully";
  }
  try {
    await redisClient.del(cacheKey);
  } catch (error) {
    throw ("Redis delete error:", error.nessage);
  }

  if (newRepair) {
    let client = await getClientById(clientId);
    let device = client.Devices.find(
      (device) => device._id.toString() === deviceID
    );

    let reportData = newRepair;
    reportData.clientName = client.name;
    reportData.clientEmail = client.email;
    reportData.clientPhone = client.phoneNumber;
    reportData.clientAddress = client.address;

    reportData.deviceType = device.deviceType;
    reportData.manufacturer = device.manufacturer;
    reportData.modelName = device.modelName;
    reportData.modelNumber = device.modelNumber;
    reportData.serialNumber = device.serialNumber;

    return reportData;
  }
};

export const makeCheckInReport = async (reportData) => {
  if (!reportData) throw "You must provide report data";
  if (typeof reportData !== "object" || Object.keys(reportData).length === 0)
    throw "Report data must be a non-empty object";

  // will do the validations later
  const jsReportUrl = process.env.JSREPORT_URL;
  try {
    const response = await axios.post(
      jsReportUrl,
      {
        template: { name: "check-in" },
        data: reportData,
      },
      {
        responseType: "arraybuffer",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating check-in report:", error);
    throw error;
  }
};

export const getWorkorderById = async (repairId) => {
  validateString(repairId, "Repair ID");

  if (!ObjectId.isValid(repairId)) throw "Invalid Repair ID format";
  const cacheKey = `repair:${repairId}`;

  try {
    const cachedRepair = await redisClient.get(cacheKey);
    if (cachedRepair) {
      return JSON.parse(cachedRepair);
    }
  } catch (error) {
    throw ("Redis get error:", error.message);
  }
  let clientCollection = await clients();
  let repair = await clientCollection
    .aggregate([
      { $unwind: "$Repairs" },
      { $match: { "Repairs._id": new ObjectId(repairId) } },
      { $replaceRoot: { newRoot: "$Repairs" } },
    ])
    .toArray();

  if (!repair.length) throw "No repair found with the provided ID";
  try {
    await redisClient.set(cacheKey, JSON.stringify(repair[0]));
    await redisClient.expire(cacheKey, 3600);
  } catch (error) {
    console.error("Redis set error:", error);
  }
  return repair[0];
};

export const updateWorkorderAfterRepair = async (
  repairID,
  repairNotes,
  wasTheRepairSuccessful
) => {
  repairID = validateString(repairID, "id");
  repairNotes = validateString(repairNotes, "repair notes");

  if (typeof wasTheRepairSuccessful !== "boolean")
    throw "Was the repair successful must be a boolean";

  if (!ObjectId.isValid(repairID)) throw "Invalid object ID";

  const cacheKey = `repair:${repairID}`;

  let repair = await getWorkorderById(repairID);
  if (repair === null) throw "No repair with that id";
  const repairStatus = wasTheRepairSuccessful ? "Completed" : "In Progress";

  const updateFilter = {
    _id: new ObjectId(repair.clientID),
    "Repairs._id": new ObjectId(repairID),
  };

  const now = new Date();
  const formattedDate = formatDate(now);

  const updateQuery = {
    $set: {
      "Repairs.$.repairTechnicianNotes": repairNotes,
      "Repairs.$.wasTheRepairSuccessful": wasTheRepairSuccessful,
      "Repairs.$.repairStatus": constants.repairStatus[1],
      "Repairs.$.repairCompletionDate": formattedDate,
    },
  };

  let clientCollection = await clients();
  const updatedInfo = await clientCollection.updateOne(
    updateFilter,
    updateQuery
  );

  if (!updatedInfo.acknowledged || updatedInfo.modifiedCount === 0) {
    throw "Could not update the repair successfully";
  }
  const updatedRepair = await getWorkorderById(repairID);

  // if (wasTheRepairSuccessful)
  // {
  try {
    const client = await getClientById(updatedRepair.clientID);
    if (!client) throw "No client with that ID";

    await sendEmail(
      repair.clientPreferredEmail,
      "Repair Order Completed",
      `Hi ${client.name}, 

        We are reaching out to you to inform you that your repair with ID: ${repairID} is completed. Please feel free 
        to come and pick up your device at your earliest convenience.
        
        This is an automated message, please do not reply to this email.`,
      `<p>Hi ${client.name},</p>
        <p> We are reaching out to you to inform you that your repair with ID: ${repairID} is completed. Please feel free 
        to come and pick up your device at your earliest convenience.</p>
        <br>
        <p>This is an automated message, please do not reply to this email.</p>`
    );
  } catch (error) {
    console.error("Failed to send email:", error);
  }
  // }

  try {
    await redisClient.del(cacheKey);
  } catch (error) {
    throw ("Redis delete error:", error.nessage);
  }

  let cachekey2 = `client:${repair.clientID}`;

  try {
    await redisClient.del(cachekey2);
  } catch (error) {
    throw ("Redis delete error:", error.nessage);
  }
  // try {
  //   await redisClient.set(cacheKey, JSON.stringify(repair));
  //   await redisClient.expire(cacheKey, 3600);
  // } catch (error) {
  //   throw ("Redis set error:", error.message);
  // }
  return await getWorkorderById(repairID);
};

export const updateWorkorderAfterPickup = async (
  repairID,
  pickupDemoDone,
  pickupNotes
) => {
  validateString(repairID, "repair ID");

  if (!ObjectId.isValid(repairID)) throw "Invalid object ID";

  if (typeof pickupDemoDone !== "boolean")
    throw "Pickup demo done must be a boolean";

  validateString(pickupNotes, "pickup notes");

  const cacheKey = `repair:${repairID}`;

  let repair = await getWorkorderById(repairID);
  if (repair === null) throw "No repair with that id";

  const updateFilter = {
    _id: new ObjectId(repair.clientID),
    "Repairs._id": new ObjectId(repairID),
  };

  const now = new Date();
  const formattedDate = formatDate(now);
  const updateQuery = {
    $set: {
      "Repairs.$.pickupDemoDone": pickupDemoDone,
      "Repairs.$.pickupNotes": pickupNotes,
      // "Repairs.$.isDevicePickedUpAlready": true,
      "Repairs.$.repairStatus": constants.repairStatus[2],
      "Repairs.$.pickupDate": formattedDate,
    },
  };

  let clientCollection = await clients();
  const updatedInfo = await clientCollection.updateOne(
    updateFilter,
    updateQuery
  );

  if (!updatedInfo.acknowledged || updatedInfo.modifiedCount === 0) {
    throw "Could not update the repair successfully";
  }
  try {
    await redisClient.del(cacheKey);
  } catch (error) {
    throw ("Redis delete error:", error.nessage);
  }

  let cachekey2 = `client:${repair.clientID}`;

  try {
    await redisClient.del(cachekey2);
  } catch (error) {
    throw ("Redis delete error:", error.nessage);
  }

  let finalRepair = await getWorkorderById(repairID);
  let client = await getClientById(finalRepair.clientID);
  let device = client.Devices.find(
    (device) => device._id.toString() === finalRepair.deviceID
  );

  let reportData = finalRepair;
  reportData.clientName = client.name;
  reportData.clientEmail = client.email;
  reportData.clientPhone = client.phoneNumber;
  reportData.clientAddress = client.address;

  reportData.deviceType = device.deviceType;
  reportData.manufacturer = device.manufacturer;
  reportData.modelName = device.modelName;
  reportData.modelNumber = device.modelNumber;
  reportData.serialNumber = device.serialNumber;

  // return await getWorkorderById(repairID);
  return reportData;
};

export const makePickupReport = async (reportData) => {
  if (!reportData) throw "You must provide report data";
  if (typeof reportData !== "object" || Object.keys(reportData).length === 0)
    throw "Report data must be a non-empty object";
  const jsReportUrl = process.env.JSREPORT_URL;
  try {
    const response = await axios.post(
      jsReportUrl,
      {
        template: { name: "Pick-up" },
        data: reportData,
      },
      {
        responseType: "arraybuffer",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating pickup report:", error);
    throw error;
  }
};

export const getActiveRepairs = async () => {
  let clientCollection = await clients();
  let activeRepairs = await clientCollection
    .aggregate([
      { $unwind: "$Repairs" },
      { $match: { "Repairs.repairStatus": constants.repairStatus[0] } },
      { $replaceRoot: { newRoot: "$Repairs" } },
    ])
    .toArray();

  return activeRepairs;
};

export const getReadyForPickupRepairs = async () => {
  let clientCollection = await clients();
  let readyForPickupRepairs = await clientCollection
    .aggregate([
      { $unwind: "$Repairs" },
      { $match: { "Repairs.repairStatus": constants.repairStatus[1] } },
      { $replaceRoot: { newRoot: "$Repairs" } },
    ])
    .toArray();

  //if(readyForPickupRepairs.length === 0) throw "No repairs ready for pickup";

  return readyForPickupRepairs;
};
