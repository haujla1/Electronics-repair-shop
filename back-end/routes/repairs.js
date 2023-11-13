import { Router } from 'express';
const router = Router();
import {
    createRepair,
    getWorkorderById,
    updateWorkorderAfterRepair,
    updateWorkorderAfterPickup
} from '../data/clients.js';

/**
 * potential routes and HTTP actions:
 * /repairs
 * POST / (create repair)
 * GET /:id (get repair by ID)
 * PUT /afterRepair (update repair after repair)
 * PUT /afterPickup (update repair after pickup)
 */

router.post('/', async (req, res) => {
    console.log(req.body);
    try {
        const repair = await createRepair(
            req.body.clientId,
            req.body.deviceID,
            req.body.workOrder
        );
        res.json(repair);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const repair = await getWorkorderById(req.params.id);
        res.json(repair);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

router.put('/afterRepair', async (req, res) => {
    console.log(req.body);
    try {
        const repair = await updateWorkorderAfterRepair(
            req.body.repairID,
            req.body.repiarNotes,
            req.body.wasTheRepairSuccessful
        );
        res.json(repair);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

router.put('/afterPickup', async (req, res) => {
    console.log(req.body);
    try {
        const repair = await updateWorkorderAfterPickup(
            req.body.repairID,
            req.body.pickupDemoDone,
            req.body.pickupNotes
        );
        res.json(repair);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

export default router;