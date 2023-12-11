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

  let newRepair = {
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

    try {
      const response = await axios.post(
        "http://localhost:5488/api/report",
        {
          template: { name: "check-in" },
          data: reportData,
        },
        {
          //responseType: "blob",
          responseType: "arraybuffer", // Changed from 'blob' to 'arraybuffer'

        }
      );

      const pdfFilename = `Checkin-report-${newRepair._id}.pdf`;
      fs.writeFileSync(pdfFilename, Buffer.from(response.data, 'binary'));

//       fs.writeFileSync(pdfFilename, response.data);

      return newRepair;
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }
  }
};



export const getWorkorderById = async (repairId) => {
  validateString(repairId, "Repair ID");

  if (!ObjectId.isValid(repairId)) throw "Invalid Repair ID format";

  let clientCollection = await clients();
  let repair = await clientCollection
    .aggregate([
      { $unwind: "$Repairs" },
      { $match: { "Repairs._id": new ObjectId(repairId) } },
      { $replaceRoot: { newRoot: "$Repairs" } },
    ])
    .toArray();

  if (!repair.length) throw "No repair found with the provided ID";
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

  let repair = await getWorkorderById(repairID);
  if (repair === null) throw "No repair with that id";
  const repairStatus = wasTheRepairSuccessful ? "Completed" : "In Progress";

  const updateFilter = {
    _id: new ObjectId(repair.clientID),
    "Repairs._id": new ObjectId(repairID),
  };

  const updateQuery = {
    $set: {
      "Repairs.$.repairTechnicianNotes": repairNotes,
      "Repairs.$.wasTheRepairSuccessful": wasTheRepairSuccessful,
      "Repairs.$.repairStatus": constants.repairStatus[1],
      "Repairs.$.repairCompletionDate": new Date(),
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

  if (wasTheRepairSuccessful) {
    try {
      const client = await getClientById(updatedRepair.clientID);
      if (!client) throw "No client with that ID";

      await sendEmail(
        client.email,
        "Repair Order Completed",
        `Your repair with ID: ${repairID} is completed.`,
        `<p>Your repair with ID: ${repairID} is completed.</p>`
      );
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

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

  let repair = await getWorkorderById(repairID);
  if (repair === null) throw "No repair with that id";

  const updateFilter = {
    _id: new ObjectId(repair.clientID),
    "Repairs._id": new ObjectId(repairID),
  };

  const updateQuery = {
    $set: {
      "Repairs.$.pickupDemoDone": pickupDemoDone,
      "Repairs.$.pickupNotes": pickupNotes,
      // "Repairs.$.isDevicePickedUpAlready": true,
      "Repairs.$.repairStatus": constants.repairStatus[2],
      "Repairs.$.pickupDate": new Date(),
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

  try {
    const response = await axios.post(
      "http://localhost:5488/api/report",
      {
        template: { name: "Pick-up" },
        data: reportData,
      },
      {
        //responseType: "blob",
        responseType: "arraybuffer", // Changed from 'blob' to 'arraybuffer'

      }
    );
    const pdfFilename = `Pickup-report-${finalRepair._id}.pdf`;
    fs.writeFileSync(pdfFilename, Buffer.from(response.data, 'binary'));
  }
    catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }

    


  return await getWorkorderById(repairID);
};

// will find all the work orders with status constants.repairStatus[0] (in progress)
export const getActiveRepairs = async () => 
{
  let clientCollection = await clients();
  let activeRepairs = await clientCollection
    .aggregate([
      { $unwind: "$Repairs" },
      { $match: {"Repairs.repairStatus": constants.repairStatus[0]}},
      { $replaceRoot:{newRoot: "$Repairs"}},
    ])
    .toArray();

    if(activeRepairs.length === 0) throw "No active repairs";

  return activeRepairs;
}

export const getReadyForPickupRepairs = async () =>
{
  let clientCollection = await clients();
  let readyForPickupRepairs = await clientCollection
    .aggregate([
      { $unwind: "$Repairs" },
      { $match: {"Repairs.repairStatus": constants.repairStatus[1]}},
      { $replaceRoot: {newRoot: "$Repairs"}},
    ])
    .toArray();

    if(readyForPickupRepairs.length === 0) throw "No repairs ready for pickup";

  return readyForPickupRepairs;
}

