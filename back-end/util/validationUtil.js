import emailValidator from "email-validator";
import { ObjectId } from "mongodb";
import constants from "../appConstants.js";
export const validateString = (value, fieldName) => {
  if (!value) throw `You must provide a ${fieldName}`;
  if (typeof value !== "string") throw `${fieldName} must be a string`;

  if (fieldName === "Address" && value.length > constants.stringLimits.address)
    throw `${fieldName} cannot be longer than ${constants.stringLimits.address} characters`;
  if (fieldName === "First Name" || fieldName === "Last Name") {
    if (value.length > constants.stringLimits.first_last_names)
      throw `${fieldName} cannot be longer than ${constants.stringLimits.first_last_names} characters`;
  }
  if (
    fieldName === "Device Type" &&
    value.length > constants.stringLimits.deviceType
  )
    throw `${fieldName} cannot be longer than ${constants.stringLimits.deviceType} characters`;
  if (
    fieldName === "Manufacturer" &&
    value.length > constants.stringLimits.manufacturer
  )
    throw `${fieldName} cannot be longer than ${constants.stringLimits.manufacturer} characters`;
  if (
    fieldName === "Model Name" &&
    value.length > constants.stringLimits.modelName
  )
    throw `${fieldName} cannot be longer than ${constants.stringLimits.modelName} characters`;
  if (
    fieldName === "Model Number" &&
    value.length > constants.stringLimits.modelNumber
  )
    throw `${fieldName} cannot be longer than ${constants.stringLimits.modelNumber} characters`;
  if (
    fieldName === "Serial Number" &&
    value.length > constants.stringLimits.serialNumber
  )
    throw `${fieldName} cannot be longer than ${constants.stringLimits.serialNumber} characters`;
  if (fieldName === "Issue" && value.length > constants.stringLimits.issue)
    throw `${fieldName} cannot be longer than ${constants.stringLimits.issue} characters`;
  if (
    fieldName === "Steps Taken To Replicate Issue" &&
    value.length > constants.stringLimits.stepsTaken
  )
    throw `${fieldName} cannot be longer than ${constants.stringLimits.stepsTaken} characters`;
  if (
    fieldName === "Work To Be Done" &&
    value.length > constants.stringLimits.workToBeDone
  )
    throw `${fieldName} cannot be longer than ${constants.stringLimits.workToBeDone} characters`;
  if (
    fieldName === "Condition Of Device" &&
    value.length > constants.stringLimits.conditionOfDevice
  )
    throw `${fieldName} cannot be longer than ${constants.stringLimits.conditionOfDevice} characters`;

  let trimmedValue = value.trim();
  if (trimmedValue.length === 0) throw `${fieldName} cannot be empty`;
  return trimmedValue;
};

export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) throw "You must provide a phone number";
  if (typeof phoneNumber !== "string") throw "Phone number must be a string";
  let trimmedPhoneNumber = phoneNumber.trim();
  if (trimmedPhoneNumber.length !== 10)
    throw "Phone number must be 10 digits long";
  if (!/^\d+$/.test(trimmedPhoneNumber))
    throw "Phone number must contain only digits";
  return trimmedPhoneNumber;
};

export const validateEmail = (email) => {
  if (!emailValidator.validate(email)) throw "Email is not valid";
  else return email;
};

export const validateObjectId = (id, fieldName) => {
  if (!id) throw `You must provide an ${fieldName}`;
  if (typeof id !== "string") throw `${fieldName} must be a string`;
  let trimmedId = id.trim();
  if (trimmedId.length === 0) throw `${fieldName} cannot be empty`;
  if (!ObjectId.isValid(trimmedId)) throw `Invalid ${fieldName}`;
  return trimmedId;
};

export const validateAge = (age, fieldName) => {
  if (age < constants.min_age || age > constants.max_age) {
    throw new Error(
      `${fieldName} must be between ${constants.min_age} and ${constants.max_age} years old`
    );
  }
  return age;
};
