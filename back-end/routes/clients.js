import { Router } from 'express';
const router = Router();
import * as clients from '../data/clients.js';

/**
 * potential routes and HTTP actions:
 * /clients
 * POST / (create client)
 * GET /:id (get client by ID)
 * GET /:id/repairs (get all repairs for the client)
 */

router.post('/', async (req, res) => {
    console.log(req.body);
    try {
        const client = await clients.createClient(
            req.body.name,
            req.body.phoneNumber
        );
        res.json(client);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const client = await clients.getClientById(req.params.id);
        res.json(client);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

// update this when we are able to get all repairs for client
router.get('/:id/repairs', async (req, res) => {
});

export default router;