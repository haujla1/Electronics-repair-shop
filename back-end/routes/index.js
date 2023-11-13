import router from "./clients.js";
// import * as repairs from '../routes/repairs';

export const configRoutes = app => {
    app.use('/clients', router);
    // app.use('/repairs', repairs);
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Not found.'});
    });
};