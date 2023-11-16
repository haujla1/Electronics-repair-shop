import clientRouter from "./clients.js";
import repairRouter from './repairs.js';

export const configRoutes = app => {
    app.use('/clients', clientRouter);
    app.use('/repairs', repairRouter);
    app.use('/users', userRouter);
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Not found.'});
    });
};