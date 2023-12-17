import { Router } from 'express';
const clientRouter = Router();
import {
    createClient,
    getClientById,
    addDeviceToClient,
    getClientByPhoneNumber
} from '../data/clients.js';
import {
    validateString,
    validatePhoneNumber,
    validateEmail,
    validateAge,
    validateObjectId
} from '../util/validationUtil.js';
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
        if (typeof req.body.firstName === 'undefined') throw 'You must provide a First Name';
        req.body.firstName = validateString(req.body.firstName, "First Name");
        req.body.firstName = xss(req.body.firstName);

        if (typeof req.body.lastName === 'undefined') throw 'You must provide a Last Name';
        req.body.lastName = validateString(req.body.lastName, "Last Name");
        req.body.lastName = xss(req.body.lastName);

        if (typeof req.body.phoneNumber === 'undefined') throw 'You must provide a Phone Number';
        req.body.phoneNumber = validatePhoneNumber(req.body.phoneNumber);
        req.body.phoneNumber = xss(req.body.phoneNumber);

        if (typeof req.body.email === 'undefined') throw 'You must provide an Email';
        req.body.email = validateString(req.body.email, "Email");
        req.body.email = validateEmail(req.body.email);
        req.body.email = xss(req.body.email);

        if (typeof req.body.address === 'undefined') throw 'You must provide an Address';
        req.body.address = validateString(req.body.address, "Address");
        req.body.address = xss(req.body.address);

        if (typeof req.body.age === 'undefined') throw 'You must provide an Age';
        if (typeof req.body.age !== 'number') throw 'Age must be a number';
        req.body.age = validateAge(req.body.age, "Age");
    } catch (e) {
        if (typeof e.message === 'undefined')
            res.status(400).json({error: e});
        else
            res.status(400).json({error: e.message});
        return;
    }

    try {
        const client = await createClient(
            req.body.firstName,
            req.body.lastName,
            req.body.phoneNumber,
            req.body.email,
            req.body.address,
            req.body.age
        );
        res.json(client);
    } catch (e) {
        res.status(500).json({error: e});
    }
});

clientRouter.get('/:id', async (req, res) => {
    try {
        if (typeof req.params.id === 'undefined') throw 'You must provide a Client ID';
        req.params.id = validateObjectId(req.params.id, "Client ID");
        req.params.id = xss(req.params.id);
    } catch (e) {
        res.status(400).json({error: e});
        return;
    }

    try {
        const client = await getClientById(req.params.id);
        res.json(client);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

clientRouter.get('/phoneNumber/:phoneNumber', async (req, res) => {
    try {
        if (typeof req.params.phoneNumber === 'undefined') throw 'You must provide a phone number';
        if(typeof req.params.phoneNumber !== 'string') throw 'Phone number must be a string';
        req.params.phoneNumber = validatePhoneNumber(req.params.phoneNumber);
        req.params.phoneNumber = xss(req.params.phoneNumber);
    } catch (e) {
        res.status(400).json({error: e});
        return;
    }

    try {
        const client = await getClientByPhoneNumber(req.params.phoneNumber);
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
        if (typeof req.body.clientId === 'undefined') throw 'You must provide a Client ID'; 
        req.body.clientId = validateObjectId(req.body.clientId, "Client ID");
        req.body.clientId = xss(req.body.clientId);
      
        if (typeof req.body.deviceType === 'undefined') throw 'You must provide a Device Type';
        req.body.deviceType = validateString(req.body.deviceType, "Device Type");
        req.body.deviceType = xss(req.body.deviceType);

        if (typeof req.body.manufacturer === 'undefined') throw 'You must provide a Manufacturer';
        req.body.manufacturer = validateString(req.body.manufacturer, "Manufacturer");
        req.body.manufacturer = xss(req.body.manufacturer);

        if (typeof req.body.modelName === 'undefined') throw 'You must provide a Model Name';
        req.body.modelName = validateString(req.body.modelName, "Model Name");
        req.body.modelName = xss(req.body.modelName);

        if (typeof req.body.modelNumber === 'undefined') throw 'You must provide a Model Number';
        req.body.modelNumber = validateString(req.body.modelNumber, "Model Number");
        req.body.modelNumber = xss(req.body.modelNumber);

        if (typeof req.body.serialNumber === 'undefined') throw 'You must provide a Serial Number';
        req.body.serialNumber = validateString(req.body.serialNumber, "Serial Number");
        req.body.serialNumber = xss(req.body.serialNumber);
    } catch (e) {
        res.status(400).json({error: e});
        return;
    }

    try {
        const device = await addDeviceToClient(
            req.body.clientId,
            req.body.deviceType,
            req.body.manufacturer,
            req.body.modelName,
            req.body.modelNumber,
            req.body.serialNumber
        );
        res.json(device);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

export default clientRouter;