import { Router } from 'express';
const router = Router();
// import * as repairs from '../data/repairs';

/**
 * potential routes and HTTP actions:
 * /repairs
 * POST / (create repair)
 * GET /:id (get repair by ID)
 * GET /:clientId/allRepairs (get all repairs for client)
 * PUT /afterRepair (update repair after repair)
 * PUT /afterPickup (update pickup after repair)
 */

export default router;