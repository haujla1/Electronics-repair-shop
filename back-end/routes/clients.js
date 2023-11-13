import { Router } from 'express';
const clientRouter = Router();
import {
    createClient,
    getClientById,
    addDeviceToClient
} from '../data/clients.js';

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
        const client = await createClient(
            req.body.name,
            req.body.phoneNumber
        );
        res.json(client);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

clientRouter.get('/:id', async (req, res) => {
    try {
        const client = await getClientById(req.params.id);
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
        const client = await addDeviceToClient(
            req.body.id,
            req.body.deviceType,
            req.body.manufacturer,
            req.body.modelName,
            req.body.modelNumber,
            req.body.serialNumber
        );
        res.json(client);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

export default clientRouter;