import clientRouter from "./clients.js";
import repairRouter from './repairs.js';

export const configRoutes = app => {
    app.use('/api/clients', clientRouter);
    app.use('/api/repairs', repairRouter);
    app.use('*', (req, res) => {
        console.log(`${req.originalUrl} not found.`);
        res.status(404).json({error: 'Not found.'});
    });
};