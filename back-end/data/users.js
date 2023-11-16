import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";


import {
    validateString,
    validatePhoneNumber,
    validateEmail,
    validateAge,
    validateObjectId,
} from "../util/validationUtil.js";


export const createRequest = async (name, email, employeeId, firebaseId) => { //for unknown users
    name = validateString(name, "Name")
    email = validateEmail(email)
    employeeId = validateString(employeeId, "employeeId")
    firebaseId = validateString(firebaseId, "firebaseId")

    let userCollection = await users()

    let prev = await userCollection.findOne({email: email})

    if(prev){
        throw "Email already exists"
    }

    let newUser = {
        name: name,
        email: email,
        employeeId: employeeId,
        status: "Pending",  //pending or approved
        firebaseId: firebaseId
    }

    const insertInfo = await userCollection.insertOne(newUser);
    const user = getUser(firebaseId);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw "Was not able to add user.";
    }
        
    return user;
    
}



export const createUser = async (name, email, employeeId, role, firebaseId) => { //for seed file only
    name = validateString(name, "Name")
    email = validateEmail(email)
    employeeId = validateString(employeeId, "employeeId")
    firebaseId = validateString(firebaseId, "firebaseId")
    
    if(role !== "Admin" && role !== "Technician"){
        throw "Invalid Role"
    }


    let userCollection = await users()

    let newUser = {
        name: name,
        email: email,
        employeeId: employeeId,
        status: "Approved",
        role:role,
        firebaseId: firebaseId
    }

    const insertInfo = await userCollection.insertOne(newUser);
    const user = getUser(firebaseId);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw "Was not able to add user.";
    }
        
    return user;
    
}



export const getUser = async (email, firebaseId) => { 

    let userCollection = await users()

    console.log(email, firebaseId)
    let user = await userCollection.findOne( { firebaseId: firebaseId, email:email} )

    if (user) {
        user._id = user._id.toString();
        return user;
    } else {
        if (user === null) throw "No matching user";
    }

    return user
}


export const approveUser = async (adminFirebaseId, userFirebaseId) => {
    let userCollection = await users()

    let user = await getUser(userFirebaseId)
    let admin = await getUser(adminFirebaseId)

    if(admin.status != "Approved" || admin.role != "Admin"){
        throw "Not Authorized User"
    }

    if(user.status != "Pending"){
        throw "User already approved"
    }

    //update status to approved and role to technician
    let updated = {...user, status:"Approved", role:"Technician"}
    delete updated._id

    await userCollection.findOneAndUpdate({ firebaseId: user.firebaseId }, {$set: updated})

    return updated

}


export const deleteUser = async (adminFirebaseId, userFirebaseId) => {
    let userCollection = await users()

    let user = await getUser(userFirebaseId)
    let admin = await getUser(adminFirebaseId)

    if(admin.status != "Approved" || admin.role != "Admin"){
        throw "Not Authorized User"
    }

    await userCollection.findOneAndDelete({ firebaseId: user.firebaseId })

    return user

}

export const getAllAuthorizedUsers = async (adminFirebaseId) => {
    let userCollection = await users()

    let admin = await getUser(adminFirebaseId)

    if(admin.status != "Approved" || admin.role != "Admin"){
        throw "Not Authorized User"
    }

    let allUsers = (await userCollection.find({status: "Approved"})).toArray()

    if(allUsers.length == 0){
        throw "No Users Found"
    }

    return allUsers
}


export const getAllPendingUsers = async (adminFirebaseId) => {
    let userCollection = await users()

    let admin = await getUser(adminFirebaseId)

    if(admin.status != "Approved" || admin.role != "Admin"){
        throw "Not Authorized User"
    }

    let allUsers = (await userCollection.find({status: "Pending"})).toArray()

    return allUsers
}


//console.log(await createUser("Kyle Admin", "kwboberg2@gmail.com", "123123", "Admin", "123"))
// console.log(await createRequest("Kyle Request", "kwboberg4@gmail.com", "456456", "456"))
// console.log(await getAllPendingUsers("123"))
//console.log(await deleteUser("123", "456"))
