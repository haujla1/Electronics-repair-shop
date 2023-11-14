import emailValidator from "email-validator";
import { ObjectId } from "mongodb";
import constants from "../../appConstants.js";
export const validateString = (value, fieldName) => {
  if (!value) throw `You must provide a ${fieldName}`;
  if (typeof value !== "string") throw `${fieldName} must be a string`;
  if (fieldName === "Address" && value.length > 100)
    throw `${fieldName} cannot be longer than 100 characters`;
  if (fieldName === "First Name" || fieldName === "Last Name") {
    if (value.length > 20)
      throw `${fieldName} cannot be longer than 20 characters`;
  }
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
  return new ObjectId(trimmedId);
};

export const validateAge = (age, fieldName) => {
  if (age < constants.min_age || age > constants.max_age) {
    throw new Error(
      `${fieldName} must be between ${min_age} and ${max_age} years old`
    );
  }
  return age;
};
