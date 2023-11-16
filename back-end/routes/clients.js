import { Router } from 'express';
const clientRouter = Router();
import {
    createClient,
    getClientById,
    addDeviceToClient
} from '../data/clients.js';
import { ObjectId } from 'mongodb';
import xss from 'xss';

/**
 * potential routes and HTTP actions:
 * /clients
 * POST / (create client)
 * GET /:id (get client by ID)
 * GET /:id/repairs (get all repairs for the client)
 * POST /:id/device (add device to client)
 */

clientRouter.post('/', async (req, res) => {
    console.log(req.body);
    try {
        if (typeof(req.body.name) === 'undefined') throw "You must provide a name for your client";
        if (typeof(req.body.phoneNumber) === 'undefined') throw "You must provide a phone number for your client";
    
        if(typeof(req.body.name) !== "string") throw "Name must be a string";
        req.body.name = req.body.name.trim();
        if(req.body.name.length === 0) throw "Name cannot be empty";
        if(/\d/.test(req.body.name)) throw "Name cannot contain numbers";
    
        if(typeof(req.body.phoneNumber)!== "number") throw "Phone number must be a number";
        if(req.body.phoneNumber.toString().length !== 10) throw "Phone number must be 10 digits long";
        if(req.body.phoneNumber < 0) throw "Phone number cannot be negative";
        if(isNaN(req.body.phoneNumber)) throw "Phone number must be a number";
    } catch (e) {
        res.status(400).json({error: e});
        return;S
    }

    try {
        const client = await createClient(
            xss(req.body.name),
            req.body.phoneNumber
        );
        res.json(client);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

clientRouter.get('/:id', async (req, res) => {
    try {
        if(typeof(req.params.id) === 'undefined') throw "You must provide an id to search for";
        if(typeof(req.params.id) !== "string") throw "Id must be a string";
        req.params.id = req.params.id.trim();
        if(req.params.id.length === 0) throw "Id cannot be empty";
        if(!ObjectId.isValid(req.params.id)) throw 'invalid object ID'
    } catch (e) {
        res.status(400).json({error: e});
        return;S
    }

    try {
        const client = await getClientById(xss(req.params.id));
        res.json(client);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

// update this when we are able to get all repairs for client
clientRouter.get('/:id/repairs', async (req, res) => {
});

clientRouter.post('/:id/device', async (req, res) => {
    console.log(req.body);
    try {
        if(typeof(req.body.id) === 'undefined') throw "You must provide an id to search for";
        if(typeof(req.body.id) !== "string") throw "Id must be a string";
        req.body.id = req.body.id.trim();
        if(req.body.id.length === 0) throw "Id cannot be empty";
        if(!ObjectId.isValid(req.body.id)) throw 'invalid object ID';
    
        if (typeof(req.body.deviceType) === 'undefined') throw "You must provide a device type";
        if (typeof(req.body.manufacturer) === 'undefined') throw "You must provide a manufacturer";
        if (typeof(req.body.modelName) === 'undefined') throw "You must provide a model name";
        if (typeof(req.body.modelNumber) === 'undefined') throw "You must provide a model number";
        if (typeof(req.body.serialNumber) === 'undefined') throw "You must provide a serial number";
    
        if(typeof(req.body.deviceType) !== "string") throw "Device type must be a string";
        req.body.deviceType = req.body.deviceType.trim();
        if(req.body.deviceType.length === 0) throw "Device type cannot be empty";
    
        if(typeof(req.body.manufacturer) !== "string") throw "Manufacturer must be a string";
        req.body.manufacturer = req.body.manufacturer.trim();
        if(req.body.manufacturer.length === 0) throw "Manufacturer cannot be empty";
    
        if(typeof(req.body.modelName) !== "string") throw "Model name must be a string";
        req.body.modelName = req.body.modelName.trim();
        if(req.body.modelName.length === 0) throw "Model name cannot be empty";
    
        if(typeof(req.body.modelNumber) !== "string") throw "Model number must be a string";
        req.body.modelNumber = req.body.modelNumber.trim();
        if(req.body.modelNumber.length === 0) throw "Model number cannot be empty";
    
        if(typeof(req.body.serialNumber) !== "string") throw "Serial number must be a string";
        req.body.serialNumber = req.body.serialNumber.trim();
        if(req.body.serialNumber.length === 0) throw "Serial number cannot be empty";
    } catch (e) {
        res.status(400).json({error: e});
        return;S
    }

    try {
        const client = await addDeviceToClient(
            xss(req.body.id),
            xss(req.body.deviceType),
            xss(req.body.manufacturer),
            xss(req.body.modelName),
            xss(req.body.modelNumber),
            xss(req.body.serialNumber)
        );
        res.json(client);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

export default clientRouter;