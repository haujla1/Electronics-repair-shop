import { Router } from 'express';
const router = Router();
import {
    createRequest,
    getUser,
    approveUser,
    deleteUser,
    getAllAuthorizedUsers,
    getAllPendingUsers
} from '../data/users.js';

import xss from 'xss';
import {
    validateString,
    validateEmail,
} from "../util/validationUtil.js";


router.post('/request', async (req, res) => {
    let name
    let email
    let employeeId
    let firebaseId

    try{
        name = validateString(xss(req.body.name), "Name") 
        email =  validateEmail(xss(req.body.email))
        employeeId = validateString(xss(req.body.employeeId), "Employee ID")
        firebaseId = xss(req.body.firebaseId) //validate firebase ID
    }catch(e){
        return res.status(400).json({error: e})
    }

    //console.log(name, email, employeeId, firebaseId)

    try{
        let data = await createRequest(name, email, employeeId, firebaseId)
        return res.json(data)
    }catch(e){
        return res.status(500).json({error: e})
    }
})


router.get('/authorized/:adminFirebaseId', async (req, res) => {
    let adminFirebaseId

    try{
        adminFirebaseId = xss(req.params.adminFirebaseId)//validate firebase ID
    }catch(e){
        return res.status(400).json({error: e})
    }

    try{
        let data = await getAllAuthorizedUsers(adminFirebaseId)
        return res.json(data)
    }catch(e){
        return res.status(403).json({error: e})
    }
})

router.get('/pending/:adminFirebaseId', async (req, res) => {

    let adminFirebaseId

    try{
        adminFirebaseId = xss(req.params.adminFirebaseId)//validate firebase ID
    }catch(e){
        return res.status(400).json({error: e})
    }

    try{
        let data = await getAllPendingUsers(adminFirebaseId)
        return res.json(data)
    }catch(e){
        return res.status(403).json({error: e})
    }
})



router.patch('/approve', async (req, res) => {
    let adminFirebaseId
    let userFirebaseId

    try{
        adminFirebaseId = xss(req.body.adminFirebaseId) //validate firebase ID
        userFirebaseId = xss(req.body.userFirebaseId)//validate firebase ID
    }catch(e){
        return res.status(404).json({error: e})
    }

    try{
        let data = await approveUser(adminFirebaseId, userFirebaseId)
        return res.json(data)
    }catch(e){
        console.log(e)
        return res.status(403).json({error: e})
    }
})


router.patch('/remove', async (req, res) => {
    let adminFirebaseId
    let userFirebaseId

    try{
        adminFirebaseId = xss(req.body.adminFirebaseId) //validate firebase ID
        userFirebaseId = xss(req.body.userFirebaseId)//validate firebase ID
    }catch(e){
        return res.status(404).json({error: e})
    }

    try{
        let data = await deleteUser(adminFirebaseId, userFirebaseId)
        return res.json(data)
    }catch(e){
        return res.status(403).json({error: e})
    }
})

router.get('/:firebaseId/:email', async (req, res) => {
    let firebaseId
    let email
    try{
        firebaseId = xss(req.params.firebaseId) //validate firebase ID
        email = validateEmail(xss(req.params.email))
    }catch(e){
        return res.status(400).json({error: e})
    }

    try{
        let data = await getUser(email, firebaseId)
        return res.json(data)
    }catch(e){
        return res.status(404).json({error: e})
    }
})





export default router;