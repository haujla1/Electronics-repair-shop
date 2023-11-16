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

import { ObjectId } from 'mongodb';
import emailValidator from 'email-validator';
import xss from 'xss';


router.post('/request', async (req, res) => {
    console.log(req.body);
    let name = req.body.name //validate these
    let email = req.body.email
    let employeeId = req.body.employeeId
    let firebaseId = req.body.firebaseId


    try{
        let data = await createRequest(name, email, employeeId, firebaseId)
        res.json(data)
    }catch(e){
        res.status(500).json({error: e})
    }
})


router.get('/:firebaseId', async (req, res) => {
    let firebaseId = req.params.firebaseId //validate

    try{
        let data = await getUser(firebaseId)
        res.json(data)
    }catch(e){
        res.status(404).json({error: e})
    }
})


router.patch('/approve', async (req, res) => {
    let adminFirebaseId = req.body.adminFirebaseId //validate these
    let userFirebaseId = req.body.userFirebaseId

    try{
        let data = await approveUser(adminFirebaseId, userFirebaseId)
        res.json(data)
    }catch(e){
        res.status(403).json({error: e})
    }
})


router.delete('/remove', async (req, res) => {
    let adminFirebaseId = req.body.adminFirebaseId //validate these
    let userFirebaseId = req.body.userFirebaseId

    try{
        let data = await deleteUser(adminFirebaseId, userFirebaseId)
        res.json(data)
    }catch(e){
        res.status(403).json({error: e})
    }
})


router.get('/authorized-users/:adminFirebaseId', async (req, res) => {

    let adminFirebaseId = req.params.adminFirebaseId

    try{
        let data = await getAllAuthorizedUsers(adminFirebaseId)
        res.json(data)
    }catch(e){
        res.status(403).json({error: e})
    }
})

router.get('/pending-users/:adminFirebaseId', async (req, res) => {

    let adminFirebaseId = req.params.adminFirebaseId

    try{
        let data = await getAllPendingUsers(adminFirebaseId)
        res.json(data)
    }catch(e){
        res.status(403).json({error: e})
    }
})



export default router;