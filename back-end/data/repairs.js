import { ObjectId } from "mongodb";
import { clients } from "../config/mongoCollections.js";
import emailValidator from "email-validator";
import {
  validateString,
  validatePhoneNumber,
  validateObjectId,
  validateEmail,
} from "../util/validationUtil.js";
import constants from "../../appConstants.js";

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
  return newRepair;
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

  const updateFilter = {
    _id: new ObjectId(repair.clientID),
    "Repairs._id": new ObjectId(repairID),
  };

  const updateQuery = {
    $set: {
      "Repairs.$.repairTechnicianNotes": repairNotes,
      "Repairs.$.wasTheRepairSuccessful": wasTheRepairSuccessful,
      "Repairs.$.repairStatus": "Ready to be Picked Up",
      "Repairs.$.isDevicePickedUpAlready": false,
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
      "Repairs.$.isDevicePickedUpAlready": true,
      "Repairs.$.repairStatus": "completed",
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
  return await getWorkorderById(repairID);
};
