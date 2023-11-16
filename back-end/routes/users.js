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
    console.log(req.body);
    let name = validateString(xss(req.body.name), "Name") 
    let email =  validateEmail(xss(req.body.email))
    let employeeId = validateString(xss(req.body.employeeId), "Employee ID")
    let firebaseId = xss(req.body.firebaseId) //validate firebase ID


    try{
        let data = await createRequest(name, email, employeeId, firebaseId)
        res.json(data)
    }catch(e){
        res.status(500).json({error: e})
    }
})


router.get('/:firebaseId/:email', async (req, res) => {
    let firebaseId = xss(req.params.firebaseId) //validate firebase ID
    let email = validateEmail(xss(req.params.email))

    try{
        let data = await getUser(email, firebaseId)
        res.json(data)
    }catch(e){
        res.status(404).json({error: e})
    }
})


router.patch('/approve', async (req, res) => {
    let adminFirebaseId = xss(req.body.adminFirebaseId) //validate firebase ID
    let userFirebaseId = xss(req.body.userFirebaseId)//validate firebase ID

    try{
        let data = await approveUser(adminFirebaseId, userFirebaseId)
        res.json(data)
    }catch(e){
        res.status(403).json({error: e})
    }
})


router.delete('/remove', async (req, res) => {
    let adminFirebaseId = xss(req.body.adminFirebaseId) //validate firebase ID
    let userFirebaseId = xss(req.body.userFirebaseId)//validate firebase ID

    try{
        let data = await deleteUser(adminFirebaseId, userFirebaseId)
        res.json(data)
    }catch(e){
        res.status(403).json({error: e})
    }
})


router.get('/authorized/:adminFirebaseId', async (req, res) => {

    let adminFirebaseId = xss(req.params.adminFirebaseId)//validate firebase ID

    try{
        let data = await getAllAuthorizedUsers(adminFirebaseId)
        res.json(data)
    }catch(e){
        res.status(403).json({error: e})
    }
})

router.get('/pending/:adminFirebaseId', async (req, res) => {

    let adminFirebaseId = xss(req.params.adminFirebaseId)//validate firebase ID

    try{
        let data = await getAllPendingUsers(adminFirebaseId)
        res.json(data)
    }catch(e){
        res.status(403).json({error: e})
    }
})



export default router;