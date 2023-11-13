import { Router } from 'express';
const router = Router();
import * as clients from '../data/clients';

/**
 * potential routes and HTTP actions:
 * /clients
 * POST / (create client)
 * GET /:id (get client by ID)
 * GET /:id/repairs (get all repairs for the client)
 */

export default router;